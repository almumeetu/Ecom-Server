import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateGuestOrderDto, CreateOrderDto, ListOrdersQueryDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from current user cart' })
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.id, dto);
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Create order as guest (no auth required)' })
  createGuest(@Body() dto: CreateGuestOrderDto) {
    return this.orderService.createGuest(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all orders with search, filters, and pagination (admin)' })
  findAll(@Query() query: ListOrdersQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user orders' })
  myOrders(@Request() req) {
    return this.orderService.myOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancel(@Request() req, @Param('id') id: string) {
    return this.orderService.cancel(id, req.user.id);
  }
}
