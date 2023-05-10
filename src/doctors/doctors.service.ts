import { Injectable } from '@nestjs/common';
import { Doctor } from '@prisma/client';

import { PrismaService } from '../core/orm/prisma.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorDto } from './dto/doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDoctor(doctorData: CreateDoctorDto): Promise<Doctor> {
    return this.prismaService.doctor.create({
      data: {
        email: doctorData.email,
        lastName: doctorData.lastName,
        firstName: doctorData.firstName,
        age: doctorData.age,
        phoneNumber: doctorData.phoneNumber,
        status: doctorData.status,
        gender: doctorData.gender,
        clinic: doctorData.clinic,
        earnings: doctorData.earnings,
        car: doctorData.car,
        avatar: doctorData.avatar,
      },
    });
  }

  async findAllDoctor() {
    return this.prismaService.doctor.findMany();
  }
  async findOneDoctor(doctorId: string) {
    return this.prismaService.doctor.findFirst({
      where: { id: Number(doctorId) },
      // include: {
      //   patients: true,
      // },
    });
  }

  async updateDoctor(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    return this.prismaService.doctor.update({
      where: { id: Number(doctorId) },
      data: updateDoctorDto,
    });
  }

  async deleteDoctor(doctorId: number) {
    return this.prismaService.doctor.delete({
      where: { id: Number(doctorId) },
    });
  }
}
