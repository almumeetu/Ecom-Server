import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user notifications' })
  findAll(@Request() req) {
    return this.notificationService.findAll(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Request() req, @Param('id') id: string) {
    return this.notificationService.markRead(req.user.id, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Request() req) {
    return this.notificationService.markAllRead(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Request() req, @Param('id') id: string) {
    return this.notificationService.remove(req.user.id, id);
  }
}
