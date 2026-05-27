import { createFileRoute } from "@tanstack/react-router";
import { Clock3, KanbanSquare, FileCheck2, Sparkles } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { resolveStudentId } from "@/lib/defaults";
import { useStudentAssignments } from "@/hooks/api-hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — AetherLMS" }] }),
  component: StudentAssignmentsPage,
});

function StudentAssignmentsPage() {
  const studentId = resolveStudentId(null);
  const { data: assignments, isLoading, isError } = useStudentAssignments(studentId);
  const pending = (assignments ?? []).filter((assignment) => assignment.status === "pending");
  const submitted = (assignments ?? []).filter((assignment) => assignment.status === "submitted");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student assignments"
        title="Assignments"
        subtitle={`Student ${studentId} with a cleaner Kanban-style overview, urgency cues, and submission progress.`}
        actions={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={String(assignments?.length ?? 0)} delta="This week" icon={KanbanSquare} sparkline={[1, 2, 3, 4, 5, 5, 6]} caption="All active assignments across your classes." />
        <StatCard label="Pending" value={String(pending.length)} delta="Focus now" deltaTone="warning" icon={Clock3} sparkline={[3, 3, 3, 2, 2, 2, 2]} caption="These need priority this week." />
        <StatCard label="Submitted" value={String(submitted.length)} delta="Done" deltaTone="positive" icon={FileCheck2} sparkline={[1, 2, 2, 3, 3, 4, 4]} caption="Completed work is moving steadily." />
        <StatCard label="AI study tip" value="Review" icon={Sparkles} sparkline={[1, 1, 2, 2, 3, 3, 4]} caption="Short revision sessions before each deadline are best." />
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>} description="A board-style layout with stronger urgency cues and more readable task cards.">
          Assignment board
        </SectionTitle>
        <div className="grid gap-4 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, index) => (
            <div key={`assignment-skeleton-${index}`} className="rounded-2xl border border-border/70 p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          ))}
          {isError && <p className="text-sm text-danger">Failed to load assignments.</p>}

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Pending</p>
              <Badge tone="warning">{pending.length}</Badge>
            </div>
            <div className="space-y-3">
              {pending.map((assignment) => (
                <div key={assignment.assignment_id} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                  <div className="mt-3">
                    <ProgressBar value={35} tone="warning" />
                  </div>
                </div>
              ))}
              {!isLoading && !isError && pending.length === 0 && <EmptyState title="All caught up" description="No pending tasks are waiting right now." />}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Submitted</p>
              <Badge tone="success">{submitted.length}</Badge>
            </div>
            <div className="space-y-3">
              {submitted.map((assignment) => (
                <div key={assignment.assignment_id} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • Marked {assignment.submission_marks ?? 0}/100</p>
                  <div className="mt-3">
                    <ProgressBar value={assignment.submission_marks ?? 86} tone="success" />
                  </div>
                </div>
              ))}
              {!isLoading && !isError && submitted.length === 0 && <EmptyState title="Nothing submitted yet" description="Submitted work will appear here with marks and progress." />}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Submission history</p>
              <Badge tone="brand">Latest</Badge>
            </div>
            <div className="space-y-3">
              {(assignments ?? []).slice(0, 4).map((assignment) => (
                <div key={`history-${assignment.assignment_id}`} className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{assignment.subject} • {assignment.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}