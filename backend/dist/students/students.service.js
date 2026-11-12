var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        try {
            return await this.prisma.student.create({
                data: {
                    ...dto,
                    dateOfBirth: dto.dateOfBirth
                        ? new Date(dto.dateOfBirth)
                        : null,
                },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('Email already exists.');
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.student.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new NotFoundException('Student not found.');
        }
        return student;
    }
    async update(id, dto) {
        await this.findOne(id);
        try {
            return await this.prisma.student.update({
                where: { id },
                data: {
                    ...dto,
                    ...(dto.dateOfBirth !== undefined && {
                        dateOfBirth: dto.dateOfBirth
                            ? new Date(dto.dateOfBirth)
                            : null,
                    }),
                },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('Email already exists.');
            }
            throw error;
        }
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.student.delete({
            where: { id },
        });
        return {
            message: 'Student deleted successfully.',
        };
    }
};
StudentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StudentsService);
export { StudentsService };
//# sourceMappingURL=students.service.js.map