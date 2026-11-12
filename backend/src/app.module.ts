import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { StudentsModule } from './students/students.module.js';

@Module({
  imports: [PrismaModule, StudentsModule],
})
export class AppModule {}
