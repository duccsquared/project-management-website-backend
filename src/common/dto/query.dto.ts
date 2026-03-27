export class QueryDTO {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';

  // dynamic filters
  [key: string]: any;
}