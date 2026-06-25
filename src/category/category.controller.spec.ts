import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Mock the CategoryService to avoid Prisma import issues
jest.mock('./category.service', () => ({
  CategoryService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get(CategoryService) as jest.Mocked<CategoryService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
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

      service.create.mockResolvedValue(expectedCategory);

      const result = await controller.create(createCategoryDto);

      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual(expectedCategory);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const expectedCategories = [
        {
          id: 'uuid-1',
          name: 'Electronics',
          slug: 'electronics',
          parentId: null,
          children: [],
        },
        {
          id: 'uuid-2',
          name: 'Clothing',
          slug: 'clothing',
          parentId: null,
          children: [],
        },
      ];

      service.findAll.mockResolvedValue(expectedCategories);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCategories);
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

      service.findOne.mockResolvedValue(expectedCategory);

      const result = await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedCategory);
    });

    it('should handle string id conversion', async () => {
      const expectedCategory = {
        id: 'uuid-456',
        name: 'Laptops',
        slug: 'laptops',
        parentId: 'uuid-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      service.findOne.mockResolvedValue(expectedCategory);

      const result = await controller.findOne('456');

      expect(service.findOne).toHaveBeenCalledWith(456);
      expect(result).toEqual(expectedCategory);
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

      service.update.mockResolvedValue(expectedCategory);

      const result = await controller.update('123', updateCategoryDto);

      expect(service.update).toHaveBeenCalledWith(123, updateCategoryDto);
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

      service.remove.mockResolvedValue(deletedCategory);

      const result = await controller.remove('123');

      expect(service.remove).toHaveBeenCalledWith(123);
      expect(result).toEqual(deletedCategory);
    });
  });
});
