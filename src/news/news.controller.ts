import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

const multipartBody = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      slug: { type: 'string' },
      excerpt: { type: 'string' },
      content: { type: 'string' },
      author: { type: 'string' },
      isPublished: { type: 'boolean' },
      image: { type: 'string', format: 'binary' },
      coverImageUrl: { type: 'string', nullable: true },
    },
    required: ['title', 'slug', 'content'],
  },
};

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a news/blog article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multipartBody)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.newsService.create(createNewsDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get published news/blog articles (public)' })
  findPublished() {
    return this.newsService.findPublished();
  }

  @Get('manage')
  @ApiOperation({ summary: 'Get all news/blog articles including drafts (admin)' })
  findAll() {
    return this.newsService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a published article by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news/blog article by ID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news/blog article' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ ...multipartBody, schema: { ...multipartBody.schema, required: [] } })
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.newsService.update(id, updateNewsDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news/blog article' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
