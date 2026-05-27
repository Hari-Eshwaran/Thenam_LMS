import { z } from "zod";

const idString = z.string().trim().min(1, "This field is required.");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
  q: z.string().trim().min(1).optional(),
  class_id: z.string().trim().min(1).optional(),
});

export const studentIdParamsSchema = z.object({
  id: idString.optional(),
  studentId: idString.optional(),
});

export const classIdParamsSchema = z.object({
  classId: idString,
});

export const studentAnalyticsParamsSchema = z.object({
  studentId: idString,
});

export const teacherAnalyticsParamsSchema = z.object({
  teacherId: idString,
});

export const studentCreateSchema = z.object({
  student_id: idString,
  class_id: idString,
  name: z.string().trim().min(2, "Student name must be at least 2 characters."),
});

export const attendanceCreateSchema = z.object({
  student_id: idString,
  class_id: idString,
  date: z.union([z.string().trim().min(1), z.date()]),
  status: z.enum(["present", "absent", "late", "excused"]),
});

export const assignmentCreateSchema = z.object({
  class_id: idString,
  subject: z.string().trim().min(1),
  title: z.string().trim().min(1),
  assignment_id: z.string().trim().min(1).optional(),
});

export const marksCreateSchema = z.object({
  student_id: idString,
  subject: z.string().trim().min(1),
  exam: z.string().trim().min(1),
  marks: z.coerce.number().nonnegative(),
  max_marks: z.coerce.number().positive(),
});

export const paymentCreateSchema = z.object({
  student_id: idString,
  amount: z.coerce.number().positive(),
  method: z.string().trim().min(1),
  date: z.union([z.string().trim().min(1), z.date()]),
  transaction_id: z.string().trim().min(1).optional(),
});

export const timetableCreateSchema = z.object({
  day: z.string().trim().min(1),
  period: z.coerce.number().int().positive(),
  start_time: z.string().trim().min(1),
  end_time: z.string().trim().min(1),
  class_id: idString,
  subject: z.string().trim().min(1),
  teacher_id: idString,
  teacher_name: z.string().trim().min(1),
  room: z.string().trim().min(1),
  grade: z.coerce.number().int().positive().nullable().optional(),
  section: z.string().trim().min(1).nullable().optional(),
  timetable_id: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
});

export const aiChatSchema = z.object({
  student_id: idString,
  subject: z.string().trim().min(1),
  question: z.string().trim().min(1),
});
