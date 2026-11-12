import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateStudentDto) {
    try {
      return await this.prisma.student.create({
        data: {
          ...dto,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists.');
      }

      throw error;
    }
  }

  // GET ALL
  async findAll() {
    return this.prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // GET ONE
  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    return student;
  }

  // UPDATE
  async update(id: string, dto: UpdateStudentDto) {
    await this.findOne(id);

    try {
      return await this.prisma.student.update({
        where: { id },
        data: {
          ...dto,
          ...(dto.dateOfBirth !== undefined && {
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError  &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists.');
      }

      throw error;
    }
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.student.delete({
      where: { id },
    });

    return {
      message: 'Student deleted successfully.',
    };
  }
}
