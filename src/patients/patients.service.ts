import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/patients.dto';
import { PrismaService } from '../core/orm/prisma.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '@prisma/client';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorService: DoctorsService,
  ) {}

  async findAllPatient() {
    return this.prismaService.patient.findMany();
  }

  async findOnePatient(patientId: string) {
    return this.prismaService.doctor.findFirst({
      where: { id: Number(patientId) },
    });
  }

  async createPatient(data: CreatePatientDto, doctorId: string) {
    const doctor = await this.doctorService.findOneDoctor(doctorId);
    if (!doctor) {
      throw new HttpException('no doctor', HttpStatus.NOT_FOUND);
    }
    return this.prismaService.patient.create({
      data: {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        age: data.age,
        phoneNumber: data.phoneNumber,
        // image: data.image,
        city: data.city,
        gender: data.gender,
        diseases: data.diseases,
        operations: data.operations,
      },
    });
  }

  async updatePatient(data: any): Promise<Patient> {
    return this.prismaService.patient.create({
      data: {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        age: data.age,
        phoneNumber: data.phoneNumber,
        city: data.city,
        gender: data.gender,
        diseases: data.diseases,
        operations: data.operations,
        attendingPhysicianId: data.attendingPhysicianId,
      },
    });
  }

  // async checkDoctor(doctorId: string) {
  //   const doctor = await this.doctorService.findOneDoctor(doctorId);
  //   if (!doctor) {
  //     return null;
  //   }
  //   return doctor;
  // }

  // async updatePatient(data: any) {
  //   // const doctor = await this.checkDoctor(doctorId);
  //   return this.prismaService.patient.create({
  //     data: {
  //       email: data.email,
  //       lastName: data.lastName,
  //       firstName: data.firstName,
  //       age: data.age,
  //       phoneNumber: data.phoneNumber,
  //       city: data.city,
  //       gender: data.gender,
  //       diseases: data.diseases,
  //       operations: data.operations,
  //       attendingPhysicianId: data.attendingPhysicianId,
  //     },
  //   });
  // }

  async deletePatient(patientId: number) {
    return this.prismaService.patient.delete({
      where: { id: Number(patientId) },
    });
  }
}
