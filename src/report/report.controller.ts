import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportService } from './report.service';
import { ReportExportService } from './report-export.service';
import { ReportFormat, ReportQueryDto } from './dto/report-query.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly exportService: ReportExportService,
  ) {}

  @Get('sales')
  @ApiOperation({ summary: 'Get sales report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'format', enum: ReportFormat, required: false })
  async sales(@Query() query: ReportQueryDto, @Res() res: Response) {
    if (query.format === 'csv') {
      const csv = await this.exportService.salesToCsv(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.csv"');
      res.send(csv);
    } else if (query.format === 'pdf') {
      const buf = await this.exportService.salesToPdf(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
      res.end(buf);
    } else {
      const data = await this.reportService.getSalesReport(query.startDate, query.endDate, query.page, query.limit);
      res.json(data);
    }
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user registration report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'format', enum: ReportFormat, required: false })
  async users(@Query() query: ReportQueryDto, @Res() res: Response) {
    if (query.format === 'csv') {
      const csv = await this.exportService.usersToCsv(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="customer-report.csv"');
      res.send(csv);
    } else if (query.format === 'pdf') {
      const buf = await this.exportService.usersToPdf(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="customer-report.pdf"');
      res.end(buf);
    } else {
      const data = await this.reportService.getUserReport(query.startDate, query.endDate, query.page, query.limit);
      res.json(data);
    }
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'format', enum: ReportFormat, required: false })
  async inventory(@Query() query: ReportQueryDto, @Res() res: Response) {
    if (query.format === 'csv') {
      const csv = await this.exportService.inventoryToCsv(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.csv"');
      res.send(csv);
    } else if (query.format === 'pdf') {
      const buf = await this.exportService.inventoryToPdf(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.pdf"');
      res.end(buf);
    } else {
      const data = await this.reportService.getInventoryReport(query.startDate, query.endDate, query.page, query.limit);
      res.json(data);
    }
  }

  @Get('purchases')
  @ApiOperation({ summary: 'Get purchase report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'format', enum: ReportFormat, required: false })
  async purchases(@Query() query: ReportQueryDto, @Res() res: Response) {
    if (query.format === 'csv') {
      const csv = await this.exportService.purchasesToCsv(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="purchase-report.csv"');
      res.send(csv);
    } else if (query.format === 'pdf') {
      const buf = await this.exportService.purchasesToPdf(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="purchase-report.pdf"');
      res.end(buf);
    } else {
      const data = await this.reportService.getPurchaseReport(query.startDate, query.endDate, query.page, query.limit);
      res.json(data);
    }
  }

  @Get('discounts')
  @ApiOperation({ summary: 'Get discount/coupon report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'format', enum: ReportFormat, required: false })
  async discounts(@Query() query: ReportQueryDto, @Res() res: Response) {
    if (query.format === 'csv') {
      const csv = await this.exportService.discountsToCsv(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="discount-report.csv"');
      res.send(csv);
    } else if (query.format === 'pdf') {
      const buf = await this.exportService.discountsToPdf(query.startDate, query.endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="discount-report.pdf"');
      res.end(buf);
    } else {
      const data = await this.reportService.getDiscountReport(query.startDate, query.endDate, query.page, query.limit);
      res.json(data);
    }
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get consolidated overview of all reports' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async overview(@Query() query: ReportQueryDto) {
    return this.reportService.getOverview(query.startDate, query.endDate);
  }
}
