export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;