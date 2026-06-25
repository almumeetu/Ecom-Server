import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { SearchController } from './search.controller';

@Module({
  imports: [ProductModule],
  controllers: [SearchController],
})
export class SearchModule {}
