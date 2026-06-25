import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profile.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  me(@Request() req) {
    return this.profileService.me(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  update(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(req.user.id, dto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload profile avatar. Local storage is default; set STORAGE_PROVIDER=s3 for S3.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { avatar: { type: 'string', format: 'binary' } } } })
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.profileService.uploadAvatar(req.user.id, file);
  }

  @Delete('avatar')
  @ApiOperation({ summary: 'Delete current avatar' })
  deleteAvatar(@Request() req) {
    return this.profileService.deleteAvatar(req.user.id);
  }
}
