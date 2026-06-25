# NeoComerz Server - Testing Guide

This guide covers how to run and write tests for the NeoComerz e-commerce server project.

## 📋 Table of Contents

- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Category Tests](#category-tests)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🧪 Test Types

### 1. Unit Tests
- Test individual functions and methods in isolation
- Mock external dependencies
- Fast execution
- Located in `src/**/*.spec.ts`

### 2. Integration Tests
- Test multiple components working together
- Test API endpoints with real database interactions
- Slower but more comprehensive
- Located in `test/**/*.e2e-spec.ts`

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (auto-runs on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:cov

# Run tests in debug mode
pnpm test:debug

# Run only integration/e2e tests
pnpm test:e2e
```

### Running Specific Tests

```bash
# Run tests for a specific file
pnpm test category.service.spec.ts

# Run tests for a specific directory
pnpm test src/category/

# Run tests matching a pattern
pnpm test --testNamePattern="should create"

# Run tests with coverage for specific files
pnpm test --coverage --collectCoverageFrom="src/category/**/*"
```

## 📁 Test Structure

### Unit Test File Structure
```
src/category/
├── category.service.ts
├── category.service.spec.ts    # Unit tests for service
├── category.controller.ts
├── category.controller.spec.ts # Unit tests for controller
└── dto/
    ├── create-category.dto.ts
    └── update-category.dto.ts
```

### Integration Test Structure
```
test/
├── jest-e2e.json              # E2E test configuration
├── category.e2e-spec.ts        # Integration tests for categories
├── user.e2e-spec.ts          # Integration tests for users
└── app.e2e-spec.ts           # General app tests
```

## 📂 Category Tests

We've created comprehensive tests for the Category module:

### Unit Tests

#### 1. CategoryService Tests (`src/category/category.service.spec.ts`)

**Test Coverage:**
- ✅ Service initialization
- ✅ Create category (with and without parent)
- ✅ Find all categories (with nested children)
- ✅ Find category by ID
- ✅ Update category
- ✅ Delete category

**Key Features:**
- Mocked PrismaService for isolation
- Comprehensive test scenarios
- Proper cleanup with `afterEach`

#### 2. CategoryController Tests (`src/category/category.controller.spec.ts`)

**Test Coverage:**
- ✅ Controller initialization
- ✅ POST /category (create)
- ✅ GET /category (find all)
- ✅ GET /category/:id (find one)
- ✅ PATCH /category/:id (update)
- ✅ DELETE /category/:id (remove)

**Key Features:**
- Mocked CategoryService
- Parameter validation tests
- HTTP status code verification

### Integration Tests

#### Category E2E Tests (`test/category.e2e-spec.ts`)

**Test Coverage:**
- ✅ Create category (POST)
- ✅ Create category with parent (POST)
- ✅ Validation errors (POST)
- ✅ Get all categories (GET)
- ✅ Get category by ID (GET)
- ✅ Update category (PATCH)
- ✅ Delete category (DELETE)
- ✅ 404 error handling

**Key Features:**
- Real HTTP requests using supertest
- Full application lifecycle
- Database interaction testing
- Error scenario testing

## 📝 Writing New Tests

### Unit Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { PrismaService } from '../prisma/prisma.service';

describe('YourService', () => {
  let service: YourService;
  let prisma: PrismaService;

  const mockPrisma = {
    yourModel: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('yourMethod', () => {
    it('should perform expected behavior', async () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };
      mockPrisma.yourModel.create.mockResolvedValue(expected);

      // Act
      const result = await service.yourMethod(input);

      // Assert
      expect(mockPrisma.yourModel.create).toHaveBeenCalledWith({
        data: input,
      });
      expect(result).toEqual(expected);
    });
  });
});
```

### Integration Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('YourController (e2e)', () => {
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

  describe('/your-endpoint (POST)', () => {
    it('should create resource', () => {
      const createDto = {
        /* your DTO data */
      };

      return request(app.getHttpServer())
        .post('/your-endpoint')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.property).toBe(createDto.property);
        });
    });
  });
});
```

## 🎯 Best Practices

### 1. Test Structure (AAA Pattern)
```typescript
it('should do something', async () => {
  // Arrange - Set up test data and mocks
  const input = { name: 'Test' };
  const expected = { id: '1', name: 'Test' };
  mockService.create.mockResolvedValue(expected);

  // Act - Execute the method being tested
  const result = await service.create(input);

  // Assert - Verify the result
  expect(result).toEqual(expected);
  expect(mockService.create).toHaveBeenCalledWith(input);
});
```

### 2. Mocking Guidelines
- Mock external dependencies (databases, APIs)
- Use consistent mock data
- Clear mocks after each test
- Test both success and error scenarios

### 3. Test Naming
- Use descriptive test names
- Follow the pattern: "should [expected behavior] when [condition]"
- Group related tests with `describe` blocks

### 4. Coverage Goals
- Aim for 80%+ code coverage
- Test all public methods
- Test edge cases and error conditions
- Test validation rules

## 🔧 Test Configuration

### Jest Configuration (package.json)
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### E2E Test Configuration (test/jest-e2e.json)
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$"
}
```

## 📊 Coverage Reports

### Viewing Coverage
```bash
# Generate coverage report
pnpm test:cov

# View coverage in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds
Add to your `jest` configuration:
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Test Database Connection
```bash
# Ensure test database is running
docker-compose up -d

# Reset test database
pnpm db:migrate:reset
```

#### 2. Import Errors
```typescript
// Use this import for supertest
import request from 'supertest';

// Not this
import * as request from 'supertest';
```

#### 3. Timeout Issues
```bash
# Increase test timeout
pnpm test --testTimeout=10000
```

#### 4. Mock Issues
```typescript
// Clear mocks properly
afterEach(() => {
  jest.clearAllMocks();
});
```

### Debugging Tests

#### 1. Console Logging
```typescript
it('should debug', () => {
  console.log('Debug info:', someVariable);
  // Your test code
});
```

#### 2. VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

#### 3. Breakpoint Debugging
```typescript
it('should debug with breakpoint', () => {
  debugger; // This will pause execution in debug mode
  // Your test code
});
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:cov
```

## 🎉 Running Category Tests

### Quick Start

```bash
# 1. Run all category unit tests
pnpm test src/category/

# 2. Run category integration tests
pnpm test:e2e -- test/category.e2e-spec.ts

# 3. Run category tests with coverage
pnpm test --coverage --collectCoverageFrom="src/category/**/*"

# 4. Run tests in watch mode while developing
pnpm test:watch -- src/category/
```

### Expected Output

When tests pass, you should see:
```
 PASS  src/category/category.service.spec.ts
 PASS  src/category/category.controller.spec.ts
 PASS  test/category.e2e-spec.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.345 s
```

---

**Happy Testing! 🧪**
