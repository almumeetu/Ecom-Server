import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportExportService } from './report-export.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportController],
  providers: [ReportService, ReportExportService],
  exports: [ReportService, ReportExportService],
})
export class ReportModule {}
