import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, Activity, ShieldCheck } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { useClassAnalytics, useClassAttendance, useStudents } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Student Directory — AetherLMS" }] }),
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const { data: students, isLoading, isError } = useStudents();
  const { data: classInsights } = useClassAnalytics(selectedClass || undefined);
  const { data: classAttendance } = useClassAttendance(selectedClass || undefined);

  const classIds = useMemo(() => {
    return Array.from(new Set((students ?? []).map((student) => student.class_id))).sort();
  }, [students]);

  const filtered = (students ?? []).filter((student) =>
    [student.student_id, student.name, student.class_id].some((value) => value.toLowerCase().includes(q.toLowerCase())),
  );
  const attendanceRate = (classAttendance ?? []).length
    ? Math.round(((classAttendance ?? []).filter((entry) => entry.status === "present").length / (classAttendance ?? []).length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student directory"
        title="Student Directory"
        subtitle="Searchable, filterable student records with class-level insights and a more commercial, demo-ready presentation."
        actions={<Badge tone="brand">{filtered.length} records</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(students?.length ?? 0)} delta="All classes" icon={Users} sparkline={[12, 13, 14, 15, 16, 17, 18]} caption="Total student records currently available." />
        <StatCard label="Classes" value={String(classIds.length)} delta="Distinct" deltaTone="positive" icon={Activity} sparkline={[3, 4, 4, 5, 5, 6, 6]} caption="Available class groupings from the dataset." />
        <StatCard label="Selected class rate" value={`${attendanceRate}%`} delta="Attendance" icon={ShieldCheck} sparkline={[80, 82, 84, 86, 88, 90, 92]} caption="Selected class attendance snapshot." />
        <StatCard label="Focus records" value={String(filtered.length)} delta="Search results" icon={Search} sparkline={[5, 6, 7, 8, 8, 9, 10]} caption="The current search is narrowing the directory." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Class analytics</Badge>} description="Pick a class to reveal performance and attendance context.">
            Class explorer
          </SectionTitle>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {classIds.map((classId) => (
              <button
                key={classId}
                type="button"
                onClick={() => setSelectedClass(classId)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selectedClass === classId ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200" : "border-border/70 bg-card hover:bg-secondary"}`}
              >
                <p className="font-semibold">{classId}</p>
              </button>
            ))}
          </div>
          {selectedClass && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="text-xs uppercase text-muted-foreground">Performance</p>
                <p className="mt-2 text-sm text-foreground">Class: {classInsights?.class_id ?? selectedClass}</p>
                <p className="text-sm text-foreground">Avg marks: {classInsights?.class_average_marks ?? 0}%</p>
                <p className="text-sm text-foreground">Top subject: {classInsights?.top_subject ?? "-"}</p>
              </div>
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="text-xs uppercase text-muted-foreground">Attendance</p>
                <p className="mt-2 text-sm text-foreground">Records: {classAttendance?.length ?? 0}</p>
                <p className="text-sm text-foreground">Present: {(classAttendance ?? []).filter((entry) => entry.status === "present").length}</p>
                <p className="text-sm text-foreground">Absent: {(classAttendance ?? []).filter((entry) => entry.status !== "present").length}</p>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="brand">Search</Badge>} description="Find students quickly and preview a clean record card grid.">
            Student search
          </SectionTitle>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student..." className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isError && <p className="text-sm text-danger">Failed to load students.</p>}
            {isLoading && Array.from({ length: 6 }).map((_, index) => (
              <Card key={`student-skeleton-${index}`} className="p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </Card>
            ))}
            {filtered.map((student) => (
              <Card key={student.student_id} className="p-4" hoverable>
                <p className="text-sm font-semibold text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.student_id}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Class {student.class_id}</p>
              </Card>
            ))}
            {!isLoading && !isError && filtered.length === 0 && (
              <EmptyState title="No students found" description="Try a different search or select a class explorer chip." icon={Users} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}