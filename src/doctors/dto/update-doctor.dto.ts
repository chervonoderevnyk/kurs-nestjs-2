import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './doctors.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
