import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings' })
  findFirst() {
    return this.settingsService.findFirst();
  }

  @Patch()
  @ApiOperation({ summary: 'Create or update settings' })
  upsert(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.upsert(updateSettingDto);
  }
}
