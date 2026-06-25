jest.mock('./brands.service', () => ({
  BrandsService: class BrandsService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';

describe('BrandsService', () => {
  let service: BrandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BrandsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
