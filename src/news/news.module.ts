import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [UploadModule],
  exports: [NewsService],
})
export class NewsModule {}
