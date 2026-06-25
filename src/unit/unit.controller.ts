import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { UnitService } from './unit.service';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a unit of measurement' })
  create(@Body() dto: CreateUnitDto) {
    return this.unitService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List units of measurement' })
  findAll() {
    return this.unitService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unit by ID' })
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update unit by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit by ID' })
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
