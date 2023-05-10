import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './patients.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
