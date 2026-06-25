import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary (KPIs, trends, recent orders)' })
  summary(@Query() query: DashboardQueryDto) {
    return this.dashboardService.summary(query);
  }

  @Get('sales-trend')
  @ApiOperation({ summary: 'Get sales revenue bucketed by day or month' })
  salesTrend(@Query() query: DashboardQueryDto) {
    return this.dashboardService.salesTrend(query);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get best-selling products for the window' })
  topProducts(@Query() query: DashboardQueryDto) {
    return this.dashboardService.topProducts(query);
  }
}
