import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ConfirmPaymentDto,
  CreateManualPaymentDto,
  InitiatePaymentDto,
} from './dto/payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate payment for an order' })
  initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiate(dto);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Create manual payment record' })
  createManual(@Body() dto: CreateManualPaymentDto) {
    return this.paymentService.createManual(dto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment status' })
  confirm(@Body() dto: ConfirmPaymentDto) {
    return this.paymentService.confirm(dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Payment provider webhook placeholder' })
  webhook(@Body() payload: any) {
    return this.paymentService.webhook(payload);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments by order ID' })
  orderPayments(@Param('orderId') orderId: string) {
    return this.paymentService.orderPayments(orderId);
  }
}
