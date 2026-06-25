import { Module } from '@nestjs/common';
import { ActivityLogController } from './activity-log.controller';

@Module({
  controllers: [ActivityLogController],
})
export class ActivityLogModule {}
