import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, BookOpen, ShieldAlert, TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useClassAnalytics } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/teacher/insights")({
  head: () => ({ meta: [{ title: "Class Insights — AetherLMS" }] }),
  component: TeacherInsightsPage,
});

function TeacherInsightsPage() {
  const classId = resolveTeacherClassId();
  const { data: analytics, isLoading, isError } = useClassAnalytics(classId);
  const subjectScores = analytics?.subject_scores ?? [];
  const topSubject = subjectScores.slice().sort((a, b) => b.averageScore - a.averageScore)[0];
  const weakSubject = subjectScores.slice().sort((a, b) => a.averageScore - b.averageScore)[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher analytics"
        title="Class Insights"
        subtitle={`Analytics for ${classId} with a more polished breakdown of attendance, scores, and subject trends.`}
        actions={<Badge tone="brand">Insights live</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(analytics?.student_count ?? 0)} delta="Active" icon={BookOpen} sparkline={[18, 18, 19, 19, 20, 20, 21]} caption="Roster size for the current class." />
        <StatCard label="Attendance" value={`${analytics?.attendance_rate ?? 0}%`} delta="Tracked" icon={TrendingUp} sparkline={[86, 87, 88, 89, 90, 91, 92]} caption="The class attendance trend remains stable." />
        <StatCard label="Avg score" value={`${analytics?.average_score ?? 0}%`} delta="Across exams" icon={BarChart3} sparkline={[72, 74, 75, 77, 79, 80, 82]} caption="Average performance across assessments." />
        <StatCard label="Assignments" value={String(analytics?.assignments_count ?? 0)} delta="Total" icon={ShieldAlert} sparkline={[2, 2, 3, 3, 3, 4, 4]} caption="Assignment workload across the term." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Subjects</Badge>} description="A bar chart plus score cards gives the class an at-a-glance teaching story.">
            Subject performance
          </SectionTitle>
          <div className="h-72">
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <ResponsiveContainer>
                <BarChart data={subjectScores} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="subject" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                  <Bar dataKey="averageScore" radius={[10, 10, 0, 0]} fill="var(--brand-600)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Stable</Badge>}>Teaching summary</SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Top subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{topSubject ? `${topSubject.subject} (${topSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Focus subject</p>
              <p className="mt-1 text-sm text-muted-foreground">{weakSubject ? `${weakSubject.subject} (${weakSubject.averageScore}%)` : "No data yet"}</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Attendance band</span>
                <span className="text-muted-foreground">{analytics?.attendance_rate ?? 0}%</span>
              </div>
              <ProgressBar value={analytics?.attendance_rate ?? 0} tone="success" />
            </div>
            {isError && <p className="text-sm text-danger">Failed to load class analytics.</p>}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{subjectScores.length} subjects</Badge>} description="Score cards with more spacing and a more refined state when data is missing.">
          Subject score overview
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {subjectScores.map((item) => (
            <div key={item.subject} className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.entries} assessment(s)</p>
                </div>
                <span className="text-lg font-bold text-foreground">{item.averageScore}%</span>
              </div>
              <div className="mt-4">
                <ProgressBar value={item.averageScore} tone={item.averageScore >= 80 ? "success" : item.averageScore >= 65 ? "brand" : "warning"} />
              </div>
            </div>
          ))}
          {!isLoading && !isError && subjectScores.length === 0 && (
            <EmptyState title="No subject insights available" description="Once enough marks are recorded, the class score overview will appear here." icon={BarChart3} />
          )}
        </div>
      </Card>
    </div>
  );
}