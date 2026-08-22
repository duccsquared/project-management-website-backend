/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, expect, it } from 'node:test';
import { buildPrismaQuery } from './buildPrismaQuery';

describe('buildPrismaQuery - to-one relational filters', () => {
  it('builds a simple nested to-one filter (owner.name$contains)', () => {
    const result = buildPrismaQuery({ 'owner.name$contains': 'Aria' } as any);

    expect(result.where).toEqual({
      owner: { name: { contains: 'Aria' } },
    });
  });

  it('builds a deeper to-one filter (owner.name$equals)', () => {
    const result = buildPrismaQuery({ 'owner.name$equals': 'Aria Hernandez' } as any);

    expect(result.where).toEqual({
      owner: { name: { equals: 'Aria Hernandez' } },
    });
  });
});

describe('buildPrismaQuery - to-many relational filters', () => {
  it('builds members$some.user.name$equals', () => {
    const result = buildPrismaQuery({
      'members$some.user.name$equals': 'Aria',
    } as any);

    expect(result.where).toEqual({
      members: { some: { user: { name: { equals: 'Aria' } } } },
    });
  });

  it('builds members$every.user.name$equals', () => {
    const result = buildPrismaQuery({
      'members$every.user.name$equals': 'Aria',
    } as any);

    expect(result.where).toEqual({
      members: { every: { user: { name: { equals: 'Aria' } } } },
    });
  });

  it('builds members$none.user.name$equals', () => {
    const result = buildPrismaQuery({
      'members$none.user.name$equals': 'Aria',
    } as any);

    expect(result.where).toEqual({
      members: { none: { user: { name: { equals: 'Aria' } } } },
    });
  });

  it('supports non-equals operators on the to-many leaf', () => {
    const result = buildPrismaQuery({
      'members$some.user.name$contains': 'Ari',
    } as any);

    expect(result.where).toEqual({
      members: { some: { user: { name: { contains: 'Ari' } } } },
    });
  });

  it('builds a deeper to-many chain (roles$some.projectMembers$some.user.name$equals)', () => {
    const result = buildPrismaQuery({
      'roles$some.projectMembers$some.user.name$equals': 'John',
    } as any);

    expect(result.where).toEqual({
      roles: {
        some: {
          projectMembers: {
            some: { user: { name: { equals: 'John' } } },
          },
        },
      },
    });
  });
});

describe('buildPrismaQuery - relational filter errors', () => {
  it('throws for an invalid to-many keyword', () => {
    expect(() =>
      buildPrismaQuery({ 'members$any.user.name$equals': 'Aria' } as any),
    ).toThrow(/Invalid relation filter 'any'/);
  });

  it('throws when a to-many filter is applied to a scalar leaf', () => {
    expect(() =>
      buildPrismaQuery({ 'members.user.name$some': 'Aria' } as any),
    ).toThrow(/Cannot apply to-many filter 'some' to scalar field 'name'/);
  });

  it('throws when two different to-many filters are used on one relation', () => {
    expect(() =>
      buildPrismaQuery({
        'members$some.user.name$equals': 'Aria',
        'members$every.user.name$equals': 'Bob',
      } as any),
    ).toThrow(/Relation 'members' is already filtered with 'some'; cannot also use 'every'/);
  });

  it('throws for a relation segment with multiple markers', () => {
    expect(() =>
      buildPrismaQuery({ 'members$some$every.user.name$equals': 'Aria' } as any),
    ).toThrow(/expected at most one to-many filter/);
  });
});

describe('buildPrismaQuery - flat filters and pagination still work', () => {
  it('keeps flat operator filters intact', () => {
    const result = buildPrismaQuery({ name$contains: 'Warehouse' } as any);

    expect(result.where).toEqual({ name: { contains: 'Warehouse' } });
  });

  it('keeps pagination and sorting intact alongside relation filters', () => {
    const result = buildPrismaQuery({
      page: 2,
      limit: 5,
      sortBy: 'createdAt',
      order: 'desc',
      'members$some.user.name$equals': 'Aria',
    } as any);

    expect(result.skip).toBe(5);
    expect(result.take).toBe(5);
    expect(result.orderBy).toEqual({ createdAt: 'desc' });
    expect(result.where).toEqual({
      members: { some: { user: { name: { equals: 'Aria' } } } },
    });
  });
});
