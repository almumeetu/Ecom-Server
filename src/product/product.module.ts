import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [UploadModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
