import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  ChartSpline,
  ClipboardCheck,
  Sparkles,
  BellRing,
} from "lucide-react";
import { Card, PageHeader, SectionTitle, StatCard, Badge, PrimaryButton, SecondaryButton, ProgressBar } from "@/components/app/ui-bits";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Teacher Dashboard — AetherLMS" }] }),
  component: TeacherDashboardPage,
});

function TeacherDashboardPage() {
  const schedule = [
    { time: "08:30", className: "Grade 12 Physics", room: "Lab 2", status: "Today" },
    { time: "10:00", className: "Grade 11 Math", room: "Room 4", status: "Next" },
    { time: "13:15", className: "Grade 10 Revision", room: "Room 7", status: "Prep" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher workspace"
        title="Teacher Dashboard"
        subtitle="A focused teaching command center for class planning, attendance, grading, and fast interventions."
        actions={
          <>
            <Badge tone="brand"><Sparkles className="mr-1 inline size-3" />AI grading helper</Badge>
            <PrimaryButton>Mark attendance</PrimaryButton>
            <SecondaryButton>Create assignment</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today’s classes" value="4" delta="2 live now" icon={CalendarClock} sparkline={[2, 3, 3, 4, 4, 4, 4]} caption="Your schedule is stacked with three priority sessions." />
        <StatCard label="Pending grading" value="18" delta="-4" deltaTone="positive" icon={ClipboardCheck} sparkline={[21, 20, 19, 19, 18, 18, 18]} caption="Marked items are steadily moving down." />
        <StatCard label="Attendance alerts" value="3" delta="1 urgent" deltaTone="negative" icon={BellRing} sparkline={[5, 4, 4, 3, 3, 3, 3]} caption="A quick intervention can be sent today." />
        <StatCard label="Class engagement" value="92%" delta="+6.8%" icon={ChartSpline} sparkline={[74, 78, 80, 84, 86, 89, 92]} caption="Students are responding better to the revised pacing." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Today</Badge>} description="A clean schedule view with next actions and class context.">
            Teaching schedule
          </SectionTitle>
          <div className="space-y-3">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-secondary/25 px-4 py-4"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.time}</p>
                  <p className="mt-1 font-semibold text-foreground">{item.className}</p>
                  <p className="text-sm text-muted-foreground">{item.room}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={index === 0 ? "success" : index === 1 ? "brand" : "neutral"}>{item.status}</Badge>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="warning">4 focus items</Badge>}>Quick Actions</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Quick attendance",
                "Create assignment",
                "Student feedback",
                "AI question helper",
              ].map((item) => (
                <button key={item} className="rounded-2xl border border-border/70 bg-card px-4 py-4 text-left text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
                  <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick action</span>
                  <span className="mt-2 block">{item}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="success">Healthy</Badge>}>Class Readiness</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Lesson plan progress</span>
                  <span className="text-muted-foreground">88%</span>
                </div>
                <ProgressBar value={88} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Grading backlog</span>
                  <span className="text-muted-foreground">64%</span>
                </div>
                <ProgressBar value={64} tone="warning" />
              </div>
              <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
                <p className="text-sm font-semibold text-foreground">AI summary</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Students are most responsive in the first 15 minutes of the lesson. Consider a problem-first starter and a two-question exit ticket.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}