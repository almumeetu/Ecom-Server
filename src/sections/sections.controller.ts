import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections' })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section by ID' })
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update section by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete section by ID' })
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(id);
  }
}
