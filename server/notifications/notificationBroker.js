import { Parent } from "../../models/Parent.js";
import { Student } from "../../models/Student.js";
import { createNotification } from "../../services/notificationService.js";
import { domainEvents } from "../events/domainEvents.js";

function buildNotificationId(prefix, studentId, marker) {
  return `${prefix}-${studentId}-${String(marker).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

async function notifyStudentAndParents(studentId, notificationData) {
  const [student, parents] = await Promise.all([
    Student.findOne({ student_id: studentId }, { _id: 0 }).lean(),
    Parent.find({ student_id: studentId }, { _id: 0 }).lean(),
  ]);

  if (!student) {
    return;
  }

  await createNotification({
    notification_id: notificationData.notification_id,
    student_id: studentId,
    class_id: student.class_id,
    type: notificationData.type,
    title: notificationData.title,
    message: notificationData.message,
    severity: notificationData.severity,
    metadata: notificationData.metadata,
  });

  await Promise.all(
    parents.map((parent) =>
      createNotification({
        notification_id: `${notificationData.notification_id}-parent-${parent.parent_id}`,
        student_id: studentId,
        class_id: student.class_id,
        parent_id: parent.parent_id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        severity: notificationData.severity,
        metadata: notificationData.metadata,
      }),
    ),
  );
}

export function initializeNotificationBroker() {
  domainEvents.on("attendance.upserted", async ({ student_id, attendance }) => {
    if (attendance?.status !== "absent") {
      return;
    }

    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("attendance", student_id, attendance.date),
      type: "attendance",
      title: "Absent record logged",
      message: `Attendance recorded as absent on ${new Date(attendance.date).toLocaleDateString()}`,
      severity: "warning",
      metadata: { attendance },
    });
  });

  domainEvents.on("attendance.reminder", async ({ student_id, attendance }) => {
    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("attendance-reminder", student_id, attendance.date),
      type: "attendance",
      title: "Attendance reminder",
      message: `Your attendance is marked absent for ${new Date(attendance.date).toLocaleDateString()}`,
      severity: "warning",
      metadata: { attendance },
    });
  });

  domainEvents.on("assignment.created", async ({ assignment }) => {
    if (!assignment?.class_id) {
      return;
    }

    const students = await Student.find({ class_id: assignment.class_id }, { _id: 0 }).lean();
    await Promise.all(
      students.map((student) =>
        notifyStudentAndParents(student.student_id, {
          notification_id: buildNotificationId("assignment", student.student_id, assignment.assignment_id),
          type: "assignment",
          title: "New assignment assigned",
          message: `${assignment.title} for ${assignment.subject}`,
          severity: "brand",
          metadata: { assignment },
        }),
      ),
    );
  });

  domainEvents.on("payment.created", async ({ student_id, payment, fees }) => {
    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("payment", student_id, payment?.transaction_id || payment?.date),
      type: "fees",
      title: "Payment received",
      message: `A payment of ${Number(payment.amount || 0).toLocaleString()} has been recorded.`,
      severity: fees?.balance > 0 ? "warning" : "success",
      metadata: { payment, fees },
    });
  });

  domainEvents.on("fees.reminder", async ({ student_id, fees }) => {
    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("fees-reminder", student_id, fees?.student_id || fees?.balance),
      type: "fees",
      title: "Fee reminder",
      message: `Outstanding balance is ${Number(fees.balance || 0).toLocaleString()}`,
      severity: "danger",
      metadata: { fees },
    });
  });

  domainEvents.on("marks.created", async ({ student_id, marks }) => {
    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("marks", student_id, `${marks.subject}-${marks.exam}`),
      type: "result",
      title: `${marks.subject} result available`,
      message: `${marks.exam}: ${marks.marks}/${marks.max_marks}`,
      severity: "success",
      metadata: { marks },
    });
  });

  domainEvents.on("ai.chat.completed", async ({ student_id, subject }) => {
    await notifyStudentAndParents(student_id, {
      notification_id: buildNotificationId("ai", student_id, subject),
      type: "ai",
      title: "AI tutoring completed",
      message: `A learning session was completed for ${subject}.`,
      severity: "brand",
      metadata: { subject },
    });
  });

  domainEvents.on("timetable.created", async ({ timetable }) => {
    if (!timetable?.class_id) {
      return;
    }

    const students = await Student.find({ class_id: timetable.class_id }, { _id: 0 }).lean();
    await Promise.all(
      students.map((student) =>
        notifyStudentAndParents(student.student_id, {
          notification_id: buildNotificationId("timetable", student.student_id, timetable.timetable_id),
          type: "timetable",
          title: "Timetable updated",
          message: `${timetable.subject} added to ${timetable.day}`,
          severity: "brand",
          metadata: { timetable },
        }),
      ),
    );
  });

  return { initialized: true };
}
