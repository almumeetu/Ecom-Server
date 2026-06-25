import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { UploadModule } from '../upload/upload.module';
import { ProductDiscountModule } from '../product-discount/product-discount.module';

@Module({
  imports: [UploadModule, ProductDiscountModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
