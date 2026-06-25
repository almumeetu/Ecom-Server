import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tag by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tag by ID' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
