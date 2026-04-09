import { QueryDTO } from "../dto/query.dto";

export function buildPrismaQuery(query: QueryDTO) {
  const { page = 1, limit = 10, sortBy, order = 'asc', include, ...filters } = query;

  // filter handling
  const where: Record<string, any> = {};

  for (const key in filters) {
    if (filters[key]) {
      where[key] = {
        contains: filters[key] as string,
        mode: 'insensitive', // case-insensitive search
      };
    }
  }

  // relational handling
  const includeObj: Record<string, boolean> = {};
  if(include != null && typeof include === 'string') {
    const relations: string[] = include.split(',');

    relations.forEach((rel: string) => {
      includeObj[rel] = true;
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