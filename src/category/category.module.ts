import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [UploadModule],
  exports: [CategoryService],
})
export class CategoryModule { }
