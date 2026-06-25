// Mock the entire prisma module to avoid loading the actual Prisma client
jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, PrismaService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category without parent', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Electronics',
        slug: 'electronics',
      };

      const expectedCategory = {
        id: 'uuid-123',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category.findUnique.mockResolvedValue({ id: 'parent-uuid' });
      prisma.category.create.mockResolvedValue(expectedCategory);

      const result = await service.create(createCategoryDto);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Electronics',
          slug: 'electronics',
          parent: undefined,
        },
      });
      expect(result).toEqual(expectedCategory);
    });

    it('should create a category with parent', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Laptops',
        slug: 'laptops',
        parentId: 'parent-uuid',
      };

      const expectedCategory = {
        id: 'uuid-456',
        name: 'Laptops',
        slug: 'laptops',
        parentId: 'parent-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category.findUnique.mockResolvedValue({ id: 'parent-uuid' });
      prisma.category.create.mockResolvedValue(expectedCategory);

      const result = await service.create(createCategoryDto);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Laptops',
          slug: 'laptops',
          parent: {
            connect: { id: 'parent-uuid' },
          },
        },
      });
      expect(result).toEqual(expectedCategory);
    });
  });

  describe('findAll', () => {
    it('should return all root categories with nested children', async () => {
      const expectedCategories = [
        {
          id: 'uuid-1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          children: [
            {
              id: 'uuid-2',
              name: 'Laptops',
              slug: 'laptops',
              parentId: 'uuid-1',
              children: [
                {
                  id: 'uuid-3',
                  name: 'Gaming Laptops',
                  slug: 'gaming-laptops',
                  parentId: 'uuid-2',
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      prisma.category.findMany.mockResolvedValue(expectedCategories);

      const result = await service.findAll();

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: {
          parentId: null,
        },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedCategories);
    });

    it('should return empty array when no categories exist', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const expectedCategory = {
        id: 'uuid-123',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category.findUnique.mockResolvedValue(expectedCategory);

      const result = await service.findOne(123);

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: {
          id: '123',
        },
      });
      expect(result).toEqual(expectedCategory);
    });

    it('should return null when category not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Electronics',
        slug: 'updated-electronics',
      };

      const expectedCategory = {
        id: 'uuid-123',
        name: 'Updated Electronics',
        slug: 'updated-electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category.update.mockResolvedValue(expectedCategory);

      const result = await service.update(123, updateCategoryDto);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: {
          id: '123',
        },
        data: updateCategoryDto,
      });
      expect(result).toEqual(expectedCategory);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const deletedCategory = {
        id: 'uuid-123',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category.delete.mockResolvedValue(deletedCategory);

      const result = await service.remove(123);

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: {
          id: '123',
        },
      });
      expect(result).toEqual(deletedCategory);
    });
  });
});
