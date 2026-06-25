import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';
import { ShipmentService } from './shipment.service';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create shipment' })
  create(@Body() dto: CreateShipmentDto) {
    return this.shipmentService.create(dto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get shipments by order ID' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.shipmentService.findByOrder(orderId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shipment' })
  update(@Param('id') id: string, @Body() dto: UpdateShipmentDto) {
    return this.shipmentService.update(id, dto);
  }

  @Patch(':id/shipped')
  @ApiOperation({ summary: 'Mark shipment as shipped' })
  markShipped(@Param('id') id: string) {
    return this.shipmentService.markShipped(id);
  }

  @Patch(':id/delivered')
  @ApiOperation({ summary: 'Mark shipment as delivered' })
  markDelivered(@Param('id') id: string) {
    return this.shipmentService.markDelivered(id);
  }
}
