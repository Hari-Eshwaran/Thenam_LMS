import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Users, ShieldCheck } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, PrimaryButton } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAttendance, useCreateAttendance, useStudentsByClass } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/attendance")({
  head: () => ({ meta: [{ title: "Teacher Attendance — AetherLMS" }] }),
  component: TeacherAttendancePage,
});

function TeacherAttendancePage() {
  const classId = resolveTeacherClassId();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusMap, setStatusMap] = useState<Record<string, "present" | "absent">>({});
  const { data: attendance, isLoading } = useClassAttendance(classId);
  const { data: students } = useStudentsByClass(classId);
  const markMutation = useCreateAttendance();

  const todaysRows = useMemo(() => {
    return (students ?? []).map((student) => ({
      student_id: student.student_id,
      name: student.name,
      status: statusMap[student.student_id] ?? "present",
    }));
  }, [statusMap, students]);

  const presentCount = todaysRows.filter((row) => row.status === "present").length;
  const absentCount = todaysRows.filter((row) => row.status === "absent").length;

  const submitAttendance = () => {
    todaysRows.forEach((row) => {
      markMutation.mutate({ student_id: row.student_id, class_id: classId, date, status: row.status });
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher attendance"
        title="Class Attendance"
        subtitle={`Live class log for ${classId} with faster marking, clearer summaries, and cleaner visual grouping.`}
        actions={<Badge tone="brand">Mark attendance</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Class size" value={String(todaysRows.length)} delta="Today" icon={Users} sparkline={[18, 18, 19, 19, 20, 20, 21]} caption="The class roster for the selected session." />
        <StatCard label="Present" value={String(presentCount)} delta="Selected" deltaTone="positive" icon={CheckCircle2} sparkline={[13, 14, 15, 16, 17, 18, 18]} caption="Most students are currently marked present." />
        <StatCard label="Absent" value={String(absentCount)} delta="Selected" deltaTone="negative" icon={Clock3} sparkline={[4, 4, 4, 3, 3, 3, 3]} caption="Follow-up can be sent after the session." />
        <StatCard label="Attendance rate" value={`${todaysRows.length ? Math.round((presentCount / todaysRows.length) * 100) : 0}%`} icon={ShieldCheck} sparkline={[86, 87, 88, 90, 91, 92, 93]} caption="A quick live view for leadership and records." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Mark attendance</Badge>} description="A smoother attendance grid with clearer selectors and a stronger save affordance.">
            Today
          </SectionTitle>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
            <PrimaryButton type="button" onClick={submitAttendance} disabled={markMutation.isPending}>
              {markMutation.isPending ? "Saving..." : "Save attendance"}
            </PrimaryButton>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {todaysRows.map((row) => (
              <div key={row.student_id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/20 p-4 text-sm">
                <span className="font-medium text-foreground">{row.name}</span>
                <select
                  value={row.status}
                  onChange={(e) => setStatusMap((prev) => ({ ...prev, [row.student_id]: e.target.value as "present" | "absent" }))}
                  className="rounded-xl border border-border/70 bg-card px-3 py-2"
                >
                  <option value="present">present</option>
                  <option value="absent">absent</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Stable</Badge>}>Session summary</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Present</span>
                <span className="text-muted-foreground">{presentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (presentCount / todaysRows.length) * 100 : 0} tone="success" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Absent</span>
                <span className="text-muted-foreground">{absentCount}</span>
              </div>
              <ProgressBar value={todaysRows.length ? (absentCount / todaysRows.length) * 100 : 0} tone="warning" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Workflow tip</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Mark the whole row in one pass, then save once. This keeps the workflow fast while preserving a clean audit trail.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{attendance?.length ?? 0} records</Badge>} description="A cleaner history table with a more polished visual hierarchy.">
          Attendance log
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                    Loading attendance...
                  </td>
                </tr>
              )}
              {!isLoading && (attendance ?? []).length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-muted-foreground" colSpan={3}>
                    No attendance records found.
                  </td>
                </tr>
              )}
              {(attendance ?? []).map((record) => (
                <tr key={`${record.student_id}-${record.date}`} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-3">{record.student_id}</td>
                  <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}