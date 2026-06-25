import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { WholesaleOrderRequestController } from './wholesale-order-request.controller';
import { WholesaleOrderRequestService } from './wholesale-order-request.service';

@Module({
  imports: [NotificationModule],
  controllers: [WholesaleOrderRequestController],
  providers: [WholesaleOrderRequestService],
})
export class WholesaleOrderRequestModule {}
