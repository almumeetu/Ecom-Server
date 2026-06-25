import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
