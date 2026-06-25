import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  me(userId: string) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { user: { select: { id: true, name: true, email: true, phone: true } }, avatarMedia: true },
    });
  }

  update(userId: string, dto: UpdateProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
      include: { avatarMedia: true },
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Avatar file is required');
    const url = await this.uploadService.uploadFile(file, 'avatars');
    return this.prisma.$transaction(async (tx) => {
      const media = await tx.media.create({
        data: {
          url,
          type: 'image',
          provider: process.env.STORAGE_PROVIDER === 's3' ? 's3' : 'local',
        },
      });
      return tx.userProfile.upsert({
        where: { userId },
        update: { avatarMediaId: media.id },
        create: { userId, avatarMediaId: media.id },
        include: { avatarMedia: true },
      });
    });
  }

  async deleteAvatar(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { avatarMedia: true },
    });
    if (!profile?.avatarMedia) return { message: 'No avatar found' };
    await this.prisma.userProfile.update({ where: { userId }, data: { avatarMediaId: null } });
    await this.prisma.media.delete({ where: { id: profile.avatarMedia.id } });
    await this.uploadService.deleteFile(profile.avatarMedia.url);
    return { message: 'Avatar deleted successfully' };
  }
}
