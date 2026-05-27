import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveStudentId } from "@/lib/defaults";
import { useAttendance, useAttendanceSummary } from "@/hooks/api-hooks";

export const Route = createFileRoute("/student/attendance")({
  head: () => ({ meta: [{ title: "Attendance — AetherLMS" }] }),
  component: StudentAttendancePage,
});

function StudentAttendancePage() {
  const studentId = resolveStudentId(null);
  const { data: attendance, isLoading, isError } = useAttendance(studentId);
  const { data: summary, isLoading: summaryLoading } = useAttendanceSummary(studentId);

  const stats = useMemo(() => {
    const total = attendance?.length ?? 0;
    const present = attendance?.filter((record) => record.status === "present").length ?? 0;
    return { total, present, percent: total ? Math.round((present / total) * 100) : 0 };
  }, [attendance]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student attendance"
        title="Attendance"
        subtitle={`Tracking records for ${studentId} with subject-level insights, trend visibility, and cleaner record presentation.`}
        actions={<Badge tone="brand"><ShieldCheck className="mr-1 inline size-3" />Verified records</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sessions" value={String(stats.total)} delta="This term" icon={Activity} sparkline={[6, 7, 8, 8, 9, 10, 11]} caption="A healthy sample size for the current term." />
        <StatCard label="Present" value={String(stats.present)} delta="Live" icon={CheckCircle2} sparkline={[5, 6, 6, 7, 7, 8, 8]} caption="Attendance remains well managed across subjects." />
        <StatCard label="Attendance rate" value={`${stats.percent}%`} delta="Stable" deltaTone="positive" icon={TrendingUp} sparkline={[90, 91, 92, 93, 94, 95, 96]} caption="The pattern is trending upward." />
        <StatCard label="Current status" value="On track" icon={ShieldCheck} sparkline={[1, 2, 3, 3, 4, 4, 5]} caption="No immediate attendance concerns detected." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Subject-wise</Badge>} description="A gentle visual breakdown of attendance percent across subjects.">
            Attendance by subject
          </SectionTitle>
          <div className="h-72">
            {summaryLoading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={summary?.subjects ?? []} margin={{ left: -12, right: 12 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    formatter={(_value, _key, row) => {
                      const payload = row?.payload;
                      if (!payload) return _value;
                      return [`${payload.attended_sessions}/${payload.total_sessions}`, "Sessions"];
                    }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }}
                  />
                  <Bar dataKey="attendance_percent" fill="var(--brand-600)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Stable</Badge>}>Attendance insights</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Target threshold</span>
                <span className="text-muted-foreground">95%</span>
              </div>
              <ProgressBar value={stats.percent} tone={stats.percent >= 95 ? "success" : "brand"} />
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-foreground">Quick take</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Attendance is consistent enough to support strong academic momentum. Keep the current routine and review any missed sessions early.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Next best action</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the subject chart to identify whether a single class needs extra revision or catch-up time.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">Live data</Badge>}>Recent sessions</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td className="px-4 py-4" colSpan={3}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td className="px-4 py-4 text-danger" colSpan={3}>
                    Failed to load attendance.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && (attendance ?? []).length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                    No attendance records found.
                  </td>
                </tr>
              )}
              {(attendance ?? []).map((record) => (
                <tr key={`${record.student_id}-${record.date}`} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4">{record.class_id}</td>
                  <td className="px-4 py-4">
                    <Badge tone={record.status === "present" ? "success" : "danger"}>
                      {record.status === "present" ? <CheckCircle2 className="mr-1 inline size-3" /> : <XCircle className="mr-1 inline size-3" />}
                      {record.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}