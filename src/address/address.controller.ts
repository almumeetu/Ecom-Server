import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ 
    status: 201, 
    description: 'Address created successfully',
    type: AddressResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Request() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for the current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of addresses',
    type: [AddressResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.addressService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Address details',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.addressService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Address updated successfully',
    type: AddressResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Address deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiForbiddenResponse({ description: 'Cannot delete address used in orders' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  remove(@Request() req, @Param('id') id: string) {
    return this.addressService.remove(id, req.user.id);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set an address as default' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Address set as default',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  setDefault(@Request() req, @Param('id') id: string) {
    return this.addressService.setDefault(id, req.user.id);
  }
}
