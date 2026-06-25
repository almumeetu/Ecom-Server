import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttributeService } from './attribute.service';
import {
  CreateAttributeDto,
  CreateAttributeValueDto,
  UpdateAttributeDto,
  UpdateAttributeValueDto,
} from './dto/attribute.dto';

@ApiTags('Attributes')
@Controller()
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post('attributes')
  @ApiOperation({ summary: 'Create attribute' })
  create(@Body() dto: CreateAttributeDto) {
    return this.attributeService.create(dto);
  }

  @Get('attributes')
  @ApiOperation({ summary: 'List attributes with values' })
  findAll() {
    return this.attributeService.findAll();
  }

  @Get('attributes/:id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Patch('attributes/:id')
  @ApiOperation({ summary: 'Update attribute' })
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributeService.update(id, dto);
  }

  @Delete('attributes/:id')
  @ApiOperation({ summary: 'Delete attribute' })
  remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }

  @Post('attributes/:attributeId/values')
  @ApiOperation({ summary: 'Create attribute value' })
  createValue(@Param('attributeId') attributeId: string, @Body() dto: CreateAttributeValueDto) {
    return this.attributeService.createValue(attributeId, dto);
  }

  @Get('attributes/:attributeId/values')
  @ApiOperation({ summary: 'List attribute values' })
  listValues(@Param('attributeId') attributeId: string) {
    return this.attributeService.listValues(attributeId);
  }

  @Patch('attribute-values/:id')
  @ApiOperation({ summary: 'Update attribute value' })
  updateValue(@Param('id') id: string, @Body() dto: UpdateAttributeValueDto) {
    return this.attributeService.updateValue(id, dto);
  }

  @Delete('attribute-values/:id')
  @ApiOperation({ summary: 'Delete attribute value' })
  removeValue(@Param('id') id: string) {
    return this.attributeService.removeValue(id);
  }
}
