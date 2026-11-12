import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
} from "@/types/student";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();

    const message = Array.isArray(error.message)
      ? error.message.join(", ")
      : error.message || "Something went wrong.";

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const studentService = {
  // GET ALL STUDENTS
  async getAll(): Promise<Student[]> {
    const response = await fetch(`${API_URL}/students`, {
      cache: "no-store",
    });

    return handleResponse<Student[]>(response);
  },

  // GET ONE STUDENT
  async getById(id: string): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      cache: "no-store",
    });

    return handleResponse<Student>(response);
  },

  // CREATE STUDENT
  async create(data: CreateStudentDto): Promise<Student> {
    const response = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Student>(response);
  },

  // UPDATE STUDENT
  async update(
    id: string,
    data: UpdateStudentDto,
  ): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Student>(response);
  },

  // DELETE STUDENT
  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
    });

    return handleResponse<{ message: string }>(response);
  },
};