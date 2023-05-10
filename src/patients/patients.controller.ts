import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/patients.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../core/file-upload/file.upload';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}

  @Get()
  async findAll() {
    return this.patientService.findAllPatient();
  }

  @ApiParam({ name: 'patientId', required: true })
  @Get(':patientId')
  async findOne(
    @Req() req: any,
    @Res() res: any,
    @Param('patientId') patientId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.patientService.findOnePatient(patientId));
  }

  //
  // @Post('/patients/:doctorId')
  // async createPatient(
  //   @Req() req: any,
  //   @Res() res: any,
  //   @Body() body: CreatePatientDto,
  // ) {
  //   return res
  //     .status(HttpStatus.CREATED)
  //     .json(await this.patientService.createPatient(body));
  // }
  //
  // //     @Param("doctorId") doctorId: string, createPatientDto: CreatePatientDto,
  // // ) {
  // //     const doctor = await this.doctorService.findOneDoctor(doctorId);
  // //     if (!doctor) {
  // //       return res
  // //         .status(HttpStatus.NOT_FOUND)
  // //         .json({ message: `Doctor with id: ${doctorId} not fount` });
  // //     }
  // //     return res
  // //       .status(HttpStatus.OK)
  // //       .json(await this.patientService.createPatient(createPatientDto: CreatePatientDto));
  // //   }
  //
  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
      storage: diskStorage({
        destination: './public/patient.image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updatePatient(
    @Req() req: any,
    @Res() res: any,
    // @Param('patientId') patientId: string,
    @Body() body: UpdatePatientDto,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ) {
    if (files?.image) {
      body.image = `/public/patient.image/${files.image[0].filename}`;
    }
    return res
      .status(HttpStatus.OK)
      .json(await this.patientService.updatePatient(body));
  }

  @Delete(':patientId')
  deletePatient(@Param('patientId') patientId: string) {
    return this.patientService.deletePatient(+patientId);
  }
}
