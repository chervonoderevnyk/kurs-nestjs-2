import { forwardRef, Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PrismaService } from '../core/orm/prisma.service';
import { PatientsController } from './patients.controller';
import { DoctorsService } from '../doctors/doctors.service';
import { DoctorsModule } from '../doctors/doctors.module';


@Module({
  providers: [PatientsService, PrismaService, DoctorsService],
  imports: [forwardRef(() => DoctorsModule), PrismaService, PatientsModule],
  controllers: [PatientsController],
  exports: [PatientsService],
})
export class PatientsModule {}
