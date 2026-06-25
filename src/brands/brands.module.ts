import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService]
})
export class BrandsModule { }
