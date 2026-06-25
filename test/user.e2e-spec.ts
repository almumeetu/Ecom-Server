import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept-Version', '1')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '+8801234567890',
          role: 'customer',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('john@example.com');
          userId = res.body.id;
        });
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept-Version', '1')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('should fail with short password', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept-Version', '1')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Accept-Version', '1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get a user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Accept-Version', '1')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/non-existent-id')
        .set('Accept-Version', '1')
        .expect(404);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update a user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Accept-Version', '1')
        .send({
          name: 'Updated Name',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Name');
        });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should soft delete a user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Accept-Version', '1')
        .expect(204);
    });

    it('should return 404 for deleted user', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Accept-Version', '1')
        .expect(404);
    });
  });
});
