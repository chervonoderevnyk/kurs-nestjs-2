import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Doctor } from '@prisma/client';

import { CreateDoctorDto } from './dto/doctors.dto';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreatePatientDto } from '../patients/dto/patients.dto';
import { PatientsService } from '../patients/patients.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../core/file-upload/file.upload';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorService: DoctorsService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService,
  ) {}

  @Get()
  async findAll() {
    return this.doctorService.findAllDoctor();
  }

  @ApiParam({ name: 'doctorId', required: true })
  @Get(':doctorId')
  async findOne(
    @Req() req: any,
    @Res() res: any,
    @Param('doctorId') doctorId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.doctorService.findOneDoctor(doctorId));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './public', filename: editFileName }),
      fileFilter: imageFileFilter,
    }),
  )
  async createDoctor(
    @Req() req: any,
    @Body() body: CreateDoctorDto,
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      body.avatar = `public/${file.filename}`;
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.doctorService.createDoctor(body));
  }

  @ApiParam({ name: 'doctorId', required: true })
  @Patch(':doctorId')
  async updateDoctor(
    @Req() req: any,
    @Res() res: any,
    @Param('doctorId') doctorId: string,
  ) {}
  //   @Body() updateDoctorDto: UpdateDoctorDto,
  // ) {
  //   return res
  //     .status(HttpStatus.OK)
  //     .json(await this.doctorService.updateDoctor(doctorId, updateDoctorDto));
  // }

  @Delete(':doctorId')
  deleteDoctor(@Param('doctorId') doctorId: string) {
    return this.doctorService.deleteDoctor(+doctorId);
  }

  @Post('/patients/:doctorId')
  async addNewPatient(
    @Req() req: any,
    @Res() res: any,
    @Body() body: CreatePatientDto,
    @Param('doctorId') doctorId: string,
  ) {
    const doctor = await this.doctorService.findOneDoctor(doctorId);
    if (!doctor) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Doctor with id: ${doctorId} not fount` });
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.patientService.createPatient(body, doctorId));
  }
}
