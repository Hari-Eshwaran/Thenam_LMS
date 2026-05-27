import { getCache, setCache } from "../server/cache/memoryCache.js";
import { Attendance } from "../models/Attendance.js";
import { Assignment } from "../models/Assignment.js";
import { Class } from "../models/Class.js";
import { Mapping } from "../models/Mapping.js";
import { Marks } from "../models/Marks.js";
import { Fees } from "../models/Fees.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Timetable } from "../models/Timetable.js";
import { getStudentAttendanceSummary } from "./attendanceService.js";
import { getAssignmentsForStudent } from "./assignmentService.js";
import { getFeesByStudent, listPayments } from "./paymentService.js";

export async function getClassAnalytics(classId) {
  const cacheKey = `analytics:class:${classId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const [students, attendance, marks, assignments, mappings] = await Promise.all([
    Student.find({ class_id: classId }, { _id: 0 }).lean(),
    Attendance.find({ class_id: classId }, { _id: 0 }).lean(),
    Marks.aggregate([
      { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student" } },
      { $unwind: "$student" },
      { $match: { "student.class_id": classId } },
      { $group: { _id: "$subject", totalMarks: { $sum: "$marks" }, totalMax: { $sum: "$max_marks" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Assignment.find({ class_id: classId }, { _id: 0 }).lean(),
    Mapping.find({ class_id: classId }, { _id: 0 }).lean(),
  ]);

  const attendanceRate = attendance.length
    ? Math.round((attendance.filter((entry) => entry.status === "present").length / attendance.length) * 100)
    : 0;

  const subjectScores = marks.map((item) => ({
    subject: item._id,
    averageScore: item.totalMax ? Math.round((item.totalMarks / item.totalMax) * 100) : 0,
    entries: item.count,
  }));

  const averageScore = subjectScores.length
    ? Math.round(subjectScores.reduce((sum, item) => sum + item.averageScore, 0) / subjectScores.length)
    : 0;

  return {
    class_id: classId,
    student_count: students.length,
    attendance_rate: attendanceRate,
    average_score: averageScore,
    assignments_count: assignments.length,
    teacher_assignments: mappings.length,
    subject_scores: subjectScores,
  };
}

export async function getOverviewAnalytics() {
  const cacheKey = "analytics:overview";
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const [students, teachers, classes, attendance, assignments, payments, fees] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Class.countDocuments(),
    Attendance.find({}, { status: 1 }).lean(),
    Assignment.countDocuments(),
    listPayments(),
    Fees.find({}, { total_fee: 1, paid: 1, balance: 1 }).lean(),
  ]);

  const presentCount = attendance.filter((entry) => entry.status === "present").length;
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
  const revenueCollected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalFeeValue = fees.reduce((sum, fee) => sum + Number(fee.total_fee || 0), 0);
  const totalOutstanding = fees.reduce((sum, fee) => sum + Number(fee.balance || 0), 0);

  return setCache(
    cacheKey,
    {
      student_count: students,
      teacher_count: teachers,
      class_count: classes,
      assignment_count: assignments,
      attendance_rate: attendanceRate,
      revenue_collected: revenueCollected,
      total_fee_value: totalFeeValue,
      total_outstanding_balance: totalOutstanding,
    },
    5 * 60 * 1000,
  );
}

export async function getStudentAnalytics(studentId) {
  const [student, attendanceSummary, assignments, fees, marks] = await Promise.all([
    Student.findOne({ student_id: studentId }, { _id: 0 }).lean(),
    getStudentAttendanceSummary(studentId),
    getAssignmentsForStudent(studentId),
    getFeesByStudent(studentId),
    Marks.find({ student_id: studentId }, { _id: 0 }).lean(),
  ]);

  if (!student) {
    return null;
  }

  const marksTotal = marks.reduce((sum, item) => sum + Number(item.marks || 0), 0);
  const marksMax = marks.reduce((sum, item) => sum + Number(item.max_marks || 0), 0);
  const marksAverage = marksMax ? Math.round((marksTotal / marksMax) * 100) : 0;

  return {
    student,
    attendance: attendanceSummary,
    assignments: {
      total: assignments.length,
      submitted: assignments.filter((item) => item.status === "submitted").length,
      pending: assignments.filter((item) => item.status === "pending").length,
      items: assignments,
    },
    marks: {
      count: marks.length,
      average_percent: marksAverage,
      items: marks,
    },
    finance: fees ? { ...fees, outstanding_balance: fees.balance } : null,
  };
}

export async function getTeacherAnalytics(teacherId) {
  const teacher = await Teacher.findOne({ teacher_id: teacherId }, { _id: 0 }).lean();
  if (!teacher) {
    return null;
  }

  const [mappings, timetable, assignments] = await Promise.all([
    Mapping.find({ teacher_id: teacherId }, { _id: 0 }).lean(),
    Timetable.find({ teacher_id: teacherId }, { _id: 0 }).lean(),
    Assignment.find({ subject: teacher.subject }, { _id: 0 }).lean(),
  ]);

  return {
    teacher,
    class_assignments: mappings.length,
    timetable_entries: timetable.length,
    assignments_count: assignments.length,
    classes: mappings.map((entry) => entry.class_id),
  };
}

export async function getAttendanceAnalytics() {
  const attendance = await Attendance.find({}, { _id: 0 }).lean();
  const byClass = new Map();

  for (const entry of attendance) {
    const bucket = byClass.get(entry.class_id) || { total: 0, present: 0 };
    bucket.total += 1;
    if (entry.status === "present") {
      bucket.present += 1;
    }
    byClass.set(entry.class_id, bucket);
  }

  return {
    total_records: attendance.length,
    by_class: Array.from(byClass.entries()).map(([class_id, bucket]) => ({
      class_id,
      attendance_rate: bucket.total ? Math.round((bucket.present / bucket.total) * 100) : 0,
      total_records: bucket.total,
    })),
  };
}

export async function getAssignmentsAnalytics() {
  const [assignments, submissions] = await Promise.all([
    Assignment.find({}, { _id: 0 }).lean(),
    // submission count is already derived through aggregation where needed
    Assignment.aggregate([
      { $lookup: { from: "submissions", localField: "assignment_id", foreignField: "assignment_id", as: "submission_rows" } },
      { $project: { assignment_id: 1, class_id: 1, submission_count: { $size: "$submission_rows" } } },
    ]),
  ]);

  return {
    total_assignments: assignments.length,
    submission_rollup: submissions,
  };
}

export async function getFinanceAnalytics() {
  const [payments, fees] = await Promise.all([
    listPayments(),
    Fees.find({}, { _id: 0 }).lean(),
  ]);

  const revenueCollected = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = fees.reduce((sum, fee) => sum + Number(fee.balance || 0), 0);

  return {
    payment_count: payments.length,
    revenue_collected: revenueCollected,
    outstanding_balance: outstanding,
    fee_records: fees.length,
  };
}
