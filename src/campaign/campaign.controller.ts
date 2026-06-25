import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new campaign' })
  create(
    @Body() dto: CreateCampaignDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.campaignService.create(dto, files);
  }

  @Get()
  @ApiOperation({ summary: 'List all campaigns' })
  findAll() {
    return this.campaignService.findAll();
  }

  @Get('sections')
  @ApiOperation({ summary: 'List all sections for campaign creation' })
  getSections() {
    return this.campaignService.getSections();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update campaign by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.campaignService.update(id, dto, files);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change campaign status (active/inactive)' })
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignService.changeStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete campaign by ID' })
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
