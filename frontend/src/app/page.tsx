"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  X,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { studentService } from "@/services/student.service";
import type { Student, CreateStudentDto } from "@/types/student";

const emptyForm: CreateStudentDto = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  const [form, setForm] = useState<CreateStudentDto>(emptyForm);

  // READ: Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search students
  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return students;

    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.phone?.toLowerCase().includes(keyword) ||
        student.id.toLowerCase().includes(keyword)
      );
    });
  }, [students, search]);

  // Open create modal
  const openCreateModal = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (student: Student) => {
    setEditingStudent(student);

    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
      address: student.address || "",
    });

    setModalOpen(true);
  };

  // Form input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CREATE / UPDATE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload: CreateStudentDto = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address?.trim() || undefined,
      };

      if (editingStudent) {
        await studentService.update(editingStudent.id, payload);
      } else {
        await studentService.create(payload);
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingStudent(null);

      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteStudent) return;

    try {
      setSaving(true);
      setError("");

      await studentService.delete(deleteStudent.id);

      setDeleteStudent(null);
      await fetchStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete student.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = (student: Student) =>
    `${student.firstName[0] || ""}${student.lastName[0] || ""}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">StudentHub</h1>
              <p className="text-xs text-slate-500">
                Student Registration System
              </p>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">Student Management</p>
            <p className="text-xs text-slate-500">CRUD Operations</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              MANAGEMENT
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Students
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create, view, update and manage student records.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            Add Student
          </button>
        </div>

        {/* Summary */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Students</p>

              <p className="text-2xl font-bold text-slate-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button onClick={() => setError("")} className="shrink-0">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Student table card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Student Records</h3>

              <p className="mt-1 text-xs text-slate-500">
                {filteredStudents.length} records found
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <button
                onClick={fetchStudents}
                disabled={loading}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Date of Birth</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <LoaderCircle
                        className="mx-auto animate-spin text-indigo-600"
                        size={30}
                      />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading students...
                      </p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Users size={35} className="mx-auto text-slate-300" />

                      <p className="mt-3 font-semibold text-slate-700">
                        No students found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Add a student or try another search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                            {initials(student)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {student.firstName} {student.lastName}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Mail size={12} />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                          {student.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          {student.phone || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(student.dateOfBirth)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-slate-400" />
                          {formatDate(student.createdAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(student)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit student"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteStudent(student)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Delete student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!loading && (
            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          )}
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {editingStudent
                    ? "Update the student's information."
                    : "Enter the student's information below."}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First Name *
                  </label>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter first name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last Name *
                  </label>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter last name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    value={form.phone || ""}
                    onChange={handleChange}
                    placeholder="09xxxxxxxxx"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter residential address"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}

                  {editingStudent ? "Update Student" : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={23} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Delete Student?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteStudent.firstName} {deleteStudent.lastName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteStudent(null)}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving && <LoaderCircle size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
