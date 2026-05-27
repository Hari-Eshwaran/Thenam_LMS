import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, HeartHandshake, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Card, PageHeader, SectionTitle, StatCard, Badge, ProgressBar, SecondaryButton } from "@/components/app/ui-bits";

export const Route = createFileRoute("/parent/")({
  head: () => ({ meta: [{ title: "Parent Dashboard — AetherLMS" }] }),
  component: ParentDashboardPage,
});

function ParentDashboardPage() {
  const notes = [
    { title: "Parent-teacher meeting", detail: "Scheduled for Thursday at 4:15 PM." },
    { title: "Science project progress", detail: "Your child has completed 80% of the required work." },
    { title: "Attendance note", detail: "One late arrival was recorded this week." },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Family portal"
        title="Parent Dashboard"
        subtitle="A reassuring view of attendance, communication, and academic progress designed to feel calm and easy to trust."
        actions={<SecondaryButton>Message teacher</SecondaryButton>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance" value="96%" delta="Stable" icon={ShieldCheck} sparkline={[93, 94, 95, 95, 96, 96, 96]} caption="Attendance is strong and consistent." />
        <StatCard label="Unread messages" value="5" delta="2 urgent" deltaTone="negative" icon={MessageSquare} sparkline={[6, 6, 5, 5, 5, 5, 5]} caption="Two messages need your attention today." />
        <StatCard label="Average grade" value="87%" delta="+3.5%" icon={Sparkles} sparkline={[80, 81, 83, 84, 85, 86, 87]} caption="Academic performance is improving steadily." />
        <StatCard label="Upcoming meetings" value="2" delta="This week" icon={CalendarDays} sparkline={[1, 1, 1, 2, 2, 2, 2]} caption="Parent conversations are scheduled and visible." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Child overview</Badge>} description="A concise snapshot of school life without information overload.">
            Child progress
          </SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Attendance</span>
                <span className="text-muted-foreground">96%</span>
              </div>
              <ProgressBar value={96} tone="success" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">Homework completion</span>
                <span className="text-muted-foreground">88%</span>
              </div>
              <ProgressBar value={88} />
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
              <p className="text-sm font-semibold text-foreground">Teacher note</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Your child is participating well in class and benefits from a short revision routine after dinner.</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="warning">Needs review</Badge>}>Notifications</SectionTitle>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.title} className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{note.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{note.detail}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="success">Calm</Badge>}>Parent guidance</SectionTitle>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Recommended next step</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Encourage a 20-minute study block before dinner and review the latest teacher message together this evening.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}