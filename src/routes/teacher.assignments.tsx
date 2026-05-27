import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { FilePlus2, Sparkles, ClipboardList, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState, PrimaryButton } from "@/components/app/ui-bits";
import { resolveTeacherClassId } from "@/lib/defaults";
import { useAssignments, useCreateAssignment } from "@/hooks/api-hooks";

export const Route = createFileRoute("/teacher/assignments")({
  head: () => ({ meta: [{ title: "Teacher Assignments — AetherLMS" }] }),
  component: TeacherAssignmentsPage,
});

function TeacherAssignmentsPage() {
  const classId = resolveTeacherClassId();
  const { data: assignments, isLoading } = useAssignments(classId);
  const createMutation = useCreateAssignment();
  const [form, setForm] = useState({ class_id: classId, subject: "", title: "" });
  const submissionCount = (assignments ?? []).reduce((sum, assignment) => sum + Number((assignment as any).submission_count ?? 0), 0);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
    setForm((prev) => ({ ...prev, subject: "", title: "" }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher assignments"
        title="Assignments to Grade"
        subtitle={`Class ${classId} with assignment creation, progress analytics, and more readable cards.`}
        actions={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assignments" value={String(assignments?.length ?? 0)} delta="Live" icon={ClipboardList} sparkline={[2, 3, 4, 4, 5, 5, 6]} caption="All assignments currently attached to this class." />
        <StatCard label="Submission total" value={String(submissionCount)} delta="Across items" deltaTone="positive" icon={CheckCircle2} sparkline={[7, 8, 9, 10, 11, 12, 12]} caption="The class is steadily submitting work." />
        <StatCard label="Quick create" value="Fast" delta="Templates" icon={FilePlus2} sparkline={[1, 2, 2, 3, 3, 4, 4]} caption="Create a new task without extra friction." />
        <StatCard label="AI helper" value="Ready" icon={Sparkles} sparkline={[1, 1, 2, 2, 3, 3, 4]} caption="Get prompt suggestions for worksheets and quizzes." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Create</Badge>} description="A cleaner assignment composer with better spacing and a calmer call-to-action.">
            Create assignment
          </SectionTitle>
          <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
            <input value={form.class_id} onChange={(e) => setForm((prev) => ({ ...prev, class_id: e.target.value }))} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" placeholder="Class" required />
            <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" placeholder="Subject" required />
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm md:col-span-2" placeholder="Title" required />
            <PrimaryButton type="submit" disabled={createMutation.isPending} className="md:col-span-2">
              {createMutation.isPending ? "Saving..." : "Create assignment"}
            </PrimaryButton>
          </form>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Healthy</Badge>}>Grading progress</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Current completion</span>
                <span className="text-muted-foreground">72%</span>
              </div>
              <ProgressBar value={72} tone="success" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Teacher note</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the template-driven workflow to reduce repetitive task creation and keep grading feedback consistent.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{assignments?.length ?? 0} items</Badge>} description="A richer list of assignment cards with visible metadata and submission context.">
          Assignments
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading assignments...</p>}
          {!isLoading && (assignments ?? []).length === 0 && (
            <EmptyState
              title="No assignments found"
              description="Create a new assignment to start tracking submissions and grading progress."
              icon={FilePlus2}
            />
          )}
          {(assignments ?? []).map((assignment) => (
            <Card key={assignment.assignment_id} hoverable className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                </div>
                <Badge tone="brand">{(assignment as any).submission_count ?? 0} submissions</Badge>
              </div>
              <div className="mt-4 rounded-2xl border border-border/70 bg-secondary/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Submission progress</span>
                  <span className="text-muted-foreground">{Math.min(100, Number((assignment as any).submission_count ?? 0) * 10)}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={Math.min(100, Number((assignment as any).submission_count ?? 0) * 10)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}