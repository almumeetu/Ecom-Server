import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Activity Logs')
@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List activity logs' })
  findAll() {
    return this.prisma.activityLog.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List activity logs by user' })
  byUser(@Param('userId') userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
