/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { QueryDTO } from '../dto/query.dto';

// Prisma to-many (one-to-many / many-to-many) relation filter keywords.
// A relation segment may be suffixed with one of these to select which
// related records must match, e.g. members$some.user.name$equals=Aria.
const TO_MANY_FILTERS = ['some', 'every', 'none'] as const;

// Scalar comparison operators supported by Prisma. 
// The trailing '$...' of a relational query key is only treated as the scalar operator when it is one
const SCALAR_OPERATORS = ['equals', 'contains', 'gt', 'gte', 'lt', 'lte', 'in', 'not',] as const;

function isScalarOperator(value: string): boolean {
  return (SCALAR_OPERATORS as readonly string[]).includes(value);
}

type ToManyFilter = (typeof TO_MANY_FILTERS)[number];

function isNumeric(str) {
  if (typeof str !== 'string') return false; 
  return str.trim() !== '' && !isNaN(Number(str));
}

export function buildPrismaQuery(query: QueryDTO) {
  const { page = 1, limit = 10, sortBy, order = 'asc', include, ...filters } = query;

  // filter handling
  const where: Record<string, unknown> = {};

  for (const key in filters) {
    const value: unknown = filters[key] as unknown;

    // Handle nested relational fields (paths containing '.')
    // The field path may itself contain '$' to-many markers (e.g. members$some.user.name),
    // so only a trailing scalar operator is stripped from the key.
    if (key.includes('.')) {
      // parse relational query into separate components
      const parts = key.split('$');
      const lastPart = parts[parts.length - 1];
      const hasOperator = isScalarOperator(lastPart);

      const field = hasOperator ? parts.slice(0, -1).join('$') : key;
      const prismaOperator = hasOperator ? lastPart : 'equals';

      let parsedValue = prismaOperator === 'in' && typeof value === 'string' ? value.split(',') : value;
      if(isNumeric(parsedValue)) {
        parsedValue = Number(parsedValue)
      } 
      buildNestedRelation(where, field, prismaOperator, parsedValue);
      continue;
    }

    // Flat (non-relational) fields - keep original behavior unchanged.
    const [field, operator] = key.split('$');

    // Default operator
    // valid operators: equals, contains gt, gte, lt, lte, in, not
    const prismaOperator = operator || 'equals';

    // Handle comma-separated arrays
    const parsedValue =
      prismaOperator === 'in' && typeof value === 'string'
        ? value.split(',')
        : value as string;

    if (!Object.prototype.hasOwnProperty.call(where, field)) {
      // initialize as a record for nested operators
      (where as Record<string, Record<string, unknown>>)[field] = {};
    }

    ((where as Record<string, Record<string, unknown>>)[field])[prismaOperator] = parsedValue;
  }


  // relational handling
  const includeObj: Record<string, any> = {};
  if(include != null && typeof include === 'string') {
    const relations: string[] = include.split(',');

    relations.forEach((rel: string) => {
      // Support nested includes with dot notation
      if (rel.includes('.')) {
        buildNestedInclude(includeObj, rel);
      } else {
        includeObj[rel] = true;
      }
    });
  }

  return {
    where,
    include: includeObj,
    skip: (page - 1) * limit,
    take: Number(limit),
    orderBy: sortBy
      ? { [sortBy]: order }
      : undefined,
  };
}

interface RelationSegment {
  field: string;
  marker?: ToManyFilter;
}

function buildNestedRelation(
  where: Record<string, any>,
  path: string,
  operator: string,
  value: any,
) {
  // get segment and ensure segment validity
  const segments: RelationSegment[] = path.split('.').map((key) => {
    const parts = key.split('$');
    if (parts.length > 2) {
      throw new Error(`Invalid relation segment '${key}': expected at most one to-many filter.`);
    }
    const [field, marker] = parts;
    if (marker && !(TO_MANY_FILTERS as readonly string[]).includes(marker)) {
      throw new Error(`Invalid relation filter '${marker}'. Supported values: ${TO_MANY_FILTERS.join(', ')}.` );
    }
    return { field, marker: marker as ToManyFilter | undefined };
  });

  // get last segment and ensure that a to-many filter isn't applied
  const leaf = segments[segments.length - 1];
  if (leaf.marker) {
    throw new Error(`Cannot apply to-many filter '${leaf.marker}' to scalar field '${leaf.field}'.`);
  }

  let current = where;

  // loop through each segment
  for (let i = 0; i < segments.length - 1; i++) {
    const { field, marker } = segments[i];

    // A to-many relation may only be filtered by one of some/every/none.
    // Guards against conflicting filters from separate query keys, e.g.
    // members$some.user.name$equals=Aria + members$every.user.name$equals=Bob.
    if (marker && current[field]) {
      const existingFilter = TO_MANY_FILTERS.find(
        (f) => current[field][f] !== undefined,
      );
      if (existingFilter && existingFilter !== marker) {
        throw new Error(
          `Relation '${field}' is already filtered with '${existingFilter}'; cannot also use '${marker}'.`,
        );
      }
    }

    // recursively define query
    current[field] = current[field] || {};
    if (marker) {
      current[field][marker] = current[field][marker] || {};
      current = current[field][marker];
    } else {
      current = current[field];
    }
  }

  current[leaf.field] = {
    [operator]: value,
  };
}

function buildNestedInclude(
  includeObj: Record<string, any>,
  path: string,
) {
  const keys = path.split('.');
  
  let current: Record<string, any> = includeObj;
  
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      // Last key - set to true or create include object if not exists
      if (!current[keys[i]]) {
        current[keys[i]] = true;
      }
    } else {
      // Intermediate key - ensure it has an include object
      if (!current[keys[i]] || typeof current[keys[i]] === 'boolean') {
        current[keys[i]] = { include: {} };
      } else if (!(current[keys[i]] as Record<string,any>).include) {
        (current[keys[i]] as Record<string,any>).include = {};
      }
      current = (current[keys[i]] as Record<string,any>).include as Record<string,any>;
    }
  }
}