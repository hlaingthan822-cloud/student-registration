import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(dto: CreateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        dateOfBirth: Date | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
