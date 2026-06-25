import { Controller, Get, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@ApiTags('Policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get policies' })
  findFirst() {
    return this.policiesService.findFirst();
  }

  @Patch()
  @ApiOperation({ summary: 'Create or update policies' })
  upsert(@Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policiesService.upsert(updatePolicyDto);
  }
}
