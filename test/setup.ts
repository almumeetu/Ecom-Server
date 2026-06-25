// Jest setup file to handle Prisma client in tests
import { PrismaClient } from '../src/generated/prisma/client';

// Mock Prisma Client for tests
jest.mock('../src/generated/prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $on: jest.fn(),
    $use: jest.fn(),
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

// Set test timeout
jest.setTimeout(10000);
