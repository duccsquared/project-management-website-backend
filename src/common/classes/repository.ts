import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { buildPrismaQuery } from 'src/common/utils/buildPrismaQuery';
import { QueryDTO } from 'src/common/dto/query.dto';

interface PrismaDelegate {
  findMany(args?: any): Promise<any[]>;
  findUnique(args: any): Promise<any>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  updateMany(args: any): Promise<any>;
  delete(args: any): Promise<any>;
  deleteMany(args: any): Promise<any>;
}

/**
 * Returns the set of writable (scalar) field names for a Prisma model from the
 * client's runtime data model. Relation fields (kind === 'object'), read-only
 * managed fields (@updatedAt) and virtual fields that don't exist in the schema
 * are excluded. Falls back to no filtering when the metadata isn't available.
 */
type PrismaRuntimeField = {
  kind?: string;
  isUpdatedAt?: boolean;
  name?: string;
};

function getScalarFields(prisma: PrismaService, entityName: string): Set<string> | null {
  try {
    const runtimeDataModel = (prisma as unknown as {
      _runtimeDataModel?: {
        models?: Record<string, { fields?: PrismaRuntimeField[] }>;
      };
    })._runtimeDataModel;
    const modelMeta = runtimeDataModel?.models?.[entityName];
    const fields = modelMeta?.fields;
    if (!Array.isArray(fields)) {
      return null;
    }

    const scalarFieldNames = fields
      // Only scalar (writable) fields. Relations (kind === 'object') need
      // nested connect/disconnect syntax and can't be set from raw arrays.
      .filter((field: PrismaRuntimeField) => field.kind === 'scalar')
      // @updatedAt fields are managed by Prisma and always overridden.
      .filter((field: PrismaRuntimeField) => !field.isUpdatedAt)
      .map((field: PrismaRuntimeField) => field.name)
      .filter((name): name is string => typeof name === 'string');

    return new Set<string>(scalarFieldNames);
  } catch {
    return null;
  }
}

@Injectable()
export class BaseRepository<T> {
    entityName: string;

  constructor(protected prisma: PrismaService, entityName: string) {
    this.entityName = entityName;
  }

  async getAll(query: QueryDTO): Promise<any[]> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).findMany(prismaQuery);
  }

  async getById(id: number, query: QueryDTO): Promise<any> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).findUnique({ include: prismaQuery.include, where: { id } });
  }

  async create(data: T): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).create({ data: this.sanitizeData(data) });
  }

  async update(id: number, data: T): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).update({ where: { id }, data: this.sanitizeData(data) });
  }

  async updateMany(query: QueryDTO, data: T): Promise<any> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).updateMany({ where: prismaQuery.where, data: this.sanitizeData(data) });
  }

  async delete(id: number): Promise<any> {
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).delete({ where: { id } });
  }

  async deleteMany(query: QueryDTO): Promise<any> {
    const prismaQuery = buildPrismaQuery(query);
    return (this.prisma[this.entityName] as unknown as PrismaDelegate).deleteMany({ where: prismaQuery.where });
  }

  /**
   * Removes any fields that Prisma would reject in a write operation:
   * - relation fields (e.g. `assignments`, `members`) which need nested
   *   connect/disconnect syntax, not raw arrays
   * - read-only managed fields (`@updatedAt`)
   * - extra fields not present in the Prisma schema (e.g. `assignedTo`)
   *
   * The client payload is often the full serialized resource (including
   * relations and computed properties), so we only pass writable scalars.
   */
  private sanitizeData(data: T): Partial<T> {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return data as Partial<T>;
    }

    // The id belongs in `where`, never in `data`, and clients typically echo
    // the whole resource back. Drop it up front.
    const dataRecord: Record<string, unknown> = { ...(data as Record<string, unknown>) };
    delete dataRecord['id'];

    const scalarFields = getScalarFields(this.prisma, this.entityName);
    if (scalarFields === null) {
      // Metadata unavailable: drop only relation-looking arrays and the id.
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(dataRecord)) {
        if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
          continue; // drop nested objects / arrays (relations)
        }
        sanitized[key] = value;
      }
      return sanitized as Partial<T>;
    }

    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(dataRecord)) {
      if (scalarFields.has(key)) {
        sanitized[key] = dataRecord[key];
      }
    }
    return sanitized as Partial<T>;
  }
}
