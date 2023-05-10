import { forwardRef, Module } from '@nestjs/common';

import { DoctorsService } from './doctors.service';
import { PrismaService } from '../core/orm/prisma.service';
import { DoctorsController } from './doctors.controller';
import { PatientsModule } from '../patients/patients.module';
import { PatientsService } from '../patients/patients.service';

@Module({
  providers: [DoctorsService, PrismaService, PatientsService],
  imports: [PrismaService, forwardRef(() => PatientsModule)],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
