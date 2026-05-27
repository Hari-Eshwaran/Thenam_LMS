import { Attendance } from "../../models/Attendance.js";
import { Fees } from "../../models/Fees.js";
import { Student } from "../../models/Student.js";
import { getOverviewAnalytics } from "../../services/analyticsService.js";
import { publishDomainEvent } from "../events/domainEvents.js";

function createInterval(fn, intervalMs) {
  const timer = setInterval(() => {
    Promise.resolve(fn()).catch((error) => {
      console.error("[job:error]", error);
    });
  }, intervalMs);

  return timer;
}

async function refreshAnalyticsCache() {
  await getOverviewAnalytics();
}

async function emitFeeReminders() {
  const feeRecords = await Fees.find({ balance: { $gt: 0 } }, { _id: 0 }).lean();

  for (const fee of feeRecords) {
    const student = await Student.findOne({ student_id: fee.student_id }, { _id: 0 }).lean();
    if (!student) {
      continue;
    }

    publishDomainEvent("fees.reminder", {
      student_id: fee.student_id,
      class_id: student.class_id,
      fees: fee,
    });
  }
}

async function emitAbsentReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const absences = await Attendance.find(
    {
      status: "absent",
      date: { $gte: today, $lt: tomorrow },
    },
    { _id: 0 },
  ).lean();

  for (const attendance of absences) {
    publishDomainEvent("attendance.reminder", {
      student_id: attendance.student_id,
      class_id: attendance.class_id,
      attendance,
    });
  }
}

export function startBackgroundJobs() {
  const timers = [
    createInterval(refreshAnalyticsCache, 15 * 60 * 1000),
    createInterval(emitFeeReminders, 60 * 60 * 1000),
    createInterval(emitAbsentReminders, 60 * 60 * 1000),
  ];

  Promise.all([refreshAnalyticsCache(), emitFeeReminders(), emitAbsentReminders()]).catch((error) => {
    console.error("[job:bootstrap:error]", error);
  });

  return () => {
    for (const timer of timers) {
      clearInterval(timer);
    }
  };
}
