import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(createNewsDto: CreateNewsDto, image?: Express.Multer.File) {
    const { image: _image, coverImageUrl: _coverImageUrl, isPublished, ...data } = createNewsDto;

    let finalImageUrl: string | null = null;
    if (image) {
      finalImageUrl = await this.uploadService.uploadFile(image, 'news');
    }

    const published = isPublished ?? false;

    try {
      return await this.prisma.news.create({
        data: {
          ...data,
          coverImageUrl: finalImageUrl,
          isPublished: published,
          publishedAt: published ? new Date() : null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A news article with slug "${data.slug}" already exists`,
        );
      }
      throw error;
    }
  }

  // Public: only published articles, newest first.
  findPublished() {
    return this.prisma.news.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  // Admin: every article (drafts included), newest first.
  findAll() {
    return this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException(`News article with ID ${id} not found`);
    }
    return news;
  }

  async findBySlug(slug: string) {
    const news = await this.prisma.news.findUnique({ where: { slug } });
    if (!news || !news.isPublished) {
      throw new NotFoundException(`News article "${slug}" not found`);
    }
    return news;
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    image?: Express.Multer.File,
  ) {
    const existing = await this.findOne(id);
    const {
      image: _image,
      coverImageUrl,
      isPublished,
      ...data
    } = updateNewsDto;

    let finalImageUrl: string | null | undefined = undefined;
    if (image) {
      if (existing.coverImageUrl) {
        await this.uploadService.deleteFile(existing.coverImageUrl);
      }
      finalImageUrl = await this.uploadService.uploadFile(image, 'news');
    } else if (coverImageUrl === '') {
      if (existing.coverImageUrl) {
        await this.uploadService.deleteFile(existing.coverImageUrl);
      }
      finalImageUrl = null;
    }

    // Track publish transitions so publishedAt reflects the first time it went live.
    let publishedAt: Date | null | undefined = undefined;
    if (isPublished !== undefined) {
      if (isPublished && !existing.isPublished) {
        publishedAt = existing.publishedAt ?? new Date();
      } else if (!isPublished) {
        publishedAt = null;
      }
    }

    try {
      return await this.prisma.news.update({
        where: { id },
        data: {
          ...data,
          ...(finalImageUrl !== undefined ? { coverImageUrl: finalImageUrl } : {}),
          ...(isPublished !== undefined ? { isPublished } : {}),
          ...(publishedAt !== undefined ? { publishedAt } : {}),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A news article with slug "${data.slug}" already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const news = await this.findOne(id);
    if (news.coverImageUrl) {
      await this.uploadService.deleteFile(news.coverImageUrl);
    }
    return this.prisma.news.delete({ where: { id } });
  }
}
