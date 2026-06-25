import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { WholesaleOrderRequestService } from './wholesale-order-request.service';
import {
  ConvertToOrderDto,
  CreateWholesaleOrderRequestDto,
  ListWholesaleRequestsQueryDto,
  UpdateWholesaleRequestStatusDto,
} from './dto/wholesale-order-request.dto';

@ApiTags('Wholesale Order Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wholesale-requests')
export class WholesaleOrderRequestController {
  constructor(
    private readonly wholesaleService: WholesaleOrderRequestService,
  ) {}

  // ----- Customer -----------------------------------------------------------

  @Post()
  @ApiOperation({ summary: 'Submit a new wholesale order request' })
  create(@Request() req, @Body() dto: CreateWholesaleOrderRequestDto) {
    return this.wholesaleService.create(req.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'List my wholesale order requests' })
  findMine(@Request() req) {
    return this.wholesaleService.findMine(req.user.id);
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Get one of my wholesale order requests' })
  findOneForUser(@Request() req, @Param('id') id: string) {
    return this.wholesaleService.findOneForUser(id, req.user.id);
  }

  // ----- Admin --------------------------------------------------------------

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all wholesale order requests (admin)' })
  findAll(@Query() query: ListWholesaleRequestsQueryDto) {
    return this.wholesaleService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get a wholesale order request by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.wholesaleService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Approve, reject, or request more info for a request (admin)',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateWholesaleRequestStatusDto,
  ) {
    return this.wholesaleService.updateStatus(id, dto);
  }

  @Post(':id/convert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Convert an approved request into a wholesale order (admin)',
  })
  convertToOrder(@Param('id') id: string, @Body() dto: ConvertToOrderDto) {
    return this.wholesaleService.convertToOrder(id, dto);
  }
}
