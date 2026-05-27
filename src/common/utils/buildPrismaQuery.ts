import { QueryDTO } from "../dto/query.dto";

export function buildPrismaQuery(query: QueryDTO) {
  const { page = 1, limit = 10, sortBy, order = 'asc', include, ...filters } = query;

  // filter handling
  const where: Record<string, unknown> = {};

  for (const key in filters) {
    const value: unknown = filters[key] as unknown;

    // Split field + operator
    const [field, operator] = key.split('_');

    // Default operator
    // valid operators: equals, contains gt, gte, lt, lte, in, not
    const prismaOperator = operator || 'equals';

    // Handle nested relational fields
    if (field.includes('.')) {
      buildNestedRelation(where, field, prismaOperator, value);
      continue;
    }

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
      // e.g., "projects.project" or "owner" or "projects.project.owner"
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

function buildNestedRelation(
  where: Record<string, any>,
  path: string,
  operator: string,
  value: any,
) {
  const keys = path.split('.');

  let current = where;

  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = current[keys[i]] as Record<string, any> || {};
    current = current[keys[i]] as Record<string, any>;
  }

  current[keys[keys.length - 1]] = {
    [operator]: value as string,
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