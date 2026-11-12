import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}