import { QueryDTO } from "../dto/query.dto";

export function buildPrismaQuery(query: QueryDTO) {
  const { page = 1, limit = 10, sortBy, order = 'asc', ...filters } = query;

  const where: Record<string, any> = {};

  for (const key in filters) {
    if (filters[key]) {
      where[key] = {
        contains: filters[key] as string,
        mode: 'insensitive', // case-insensitive search
      };
    }
  }

  return {
    where,
    skip: (page - 1) * limit,
    take: Number(limit),
    orderBy: sortBy
      ? { [sortBy]: order }
      : undefined,
  };
}