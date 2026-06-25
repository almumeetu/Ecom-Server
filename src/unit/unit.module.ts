import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [PrismaModule],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
