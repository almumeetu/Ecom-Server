import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Category (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/category (POST)', () => {
    it('should create a new category', () => {
      const createCategoryDto = {
        name: 'Test Category',
        slug: 'test-category',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(createCategoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.slug).toBe(createCategoryDto.slug);
        });
    });

    it('should create a category with parent', () => {
      const createCategoryDto = {
        name: 'Sub Category',
        slug: 'sub-category',
        parentId: 'parent-uuid',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(createCategoryDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createCategoryDto.name);
          expect(res.body.slug).toBe(createCategoryDto.slug);
          expect(res.body.parentId).toBe(createCategoryDto.parentId);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidCategoryDto = {
        name: '', // Empty name should fail validation
        slug: 'invalid-slug',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(invalidCategoryDto)
        .expect(400);
    });
  });

  describe('/category (GET)', () => {
    it('should return all categories', () => {
      return request(app.getHttpServer())
        .get('/category')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('slug');
          }
        });
    });
  });

  describe('/category/:id (GET)', () => {
    it('should return a category by id', () => {
      // First create a category to get its ID
      const createCategoryDto = {
        name: 'Test Category for Get',
        slug: 'test-category-get',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(createCategoryDto)
        .expect(201)
        .then((res) => {
          const categoryId = res.body.id;

          // Now test GET by ID
          return request(app.getHttpServer())
            .get(`/category/${categoryId}`)
            .expect(200)
            .expect((getRes) => {
              expect(getRes.body.id).toBe(categoryId);
              expect(getRes.body.name).toBe(createCategoryDto.name);
              expect(getRes.body.slug).toBe(createCategoryDto.slug);
            });
        });
    });

    it('should return 404 for non-existent category', () => {
      return request(app.getHttpServer())
        .get('/category/non-existent-id')
        .expect(404);
    });
  });

  describe('/category/:id (PATCH)', () => {
    it('should update a category', () => {
      // First create a category to update
      const createCategoryDto = {
        name: 'Category to Update',
        slug: 'category-to-update',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(createCategoryDto)
        .expect(201)
        .then((res) => {
          const categoryId = res.body.id;

          const updateCategoryDto = {
            name: 'Updated Category Name',
            slug: 'updated-category-slug',
          };

          // Now test PATCH
          return request(app.getHttpServer())
            .patch(`/category/${categoryId}`)
            .send(updateCategoryDto)
            .expect(200)
            .expect((updateRes) => {
              expect(updateRes.body.id).toBe(categoryId);
              expect(updateRes.body.name).toBe(updateCategoryDto.name);
              expect(updateRes.body.slug).toBe(updateCategoryDto.slug);
            });
        });
    });

    it('should return 404 when updating non-existent category', () => {
      const updateCategoryDto = {
        name: 'Updated Name',
        slug: 'updated-slug',
      };

      return request(app.getHttpServer())
        .patch('/category/non-existent-id')
        .send(updateCategoryDto)
        .expect(404);
    });
  });

  describe('/category/:id (DELETE)', () => {
    it('should delete a category', () => {
      // First create a category to delete
      const createCategoryDto = {
        name: 'Category to Delete',
        slug: 'category-to-delete',
      };

      return request(app.getHttpServer())
        .post('/category')
        .send(createCategoryDto)
        .expect(201)
        .then((res) => {
          const categoryId = res.body.id;

          // Now test DELETE
          return request(app.getHttpServer())
            .delete(`/category/${categoryId}`)
            .expect(200);
        });
    });

    it('should return 404 when deleting non-existent category', () => {
      return request(app.getHttpServer())
        .delete('/category/non-existent-id')
        .expect(404);
    });
  });
});
