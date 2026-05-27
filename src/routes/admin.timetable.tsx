import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Clock3, Layers3, Sparkles } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar } from "@/components/app/ui-bits";
import { useCreateTimetable, useTimetable } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/timetable")({
  head: () => ({ meta: [{ title: "Timetable — AetherLMS" }] }),
  component: AdminTimetablePage,
});

function AdminTimetablePage() {
  const { data: timetable, isLoading } = useTimetable();
  const createMutation = useCreateTimetable();
  const rows = timetable ?? [];
  const [form, setForm] = useState({
    timetable_id: "",
    class_id: "",
    day: "Monday",
    period: "1",
    start_time: "09:00",
    end_time: "09:45",
    subject: "",
    teacher_id: "",
    teacher_name: "",
    room: "",
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate({
      ...form,
      period: Number(form.period),
      grade: null,
      section: null,
      status: "scheduled",
    });
  };

  const dayGroups = useMemo(() => {
    return rows.reduce<Record<string, number>>((acc, slot) => {
      acc[slot.day] = (acc[slot.day] ?? 0) + 1;
      return acc;
    }, {});
  }, [rows]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School timetable"
        title="Timetable"
        subtitle="A modern schedule workspace with a simple creation form, day summaries, and a more readable timetable view."
        actions={<Badge tone="brand">{rows.length} slots</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Scheduled slots" value={String(rows.length)} delta="Loaded" icon={CalendarDays} sparkline={[18, 20, 22, 22, 24, 25, 26]} caption="Current timetable entries from the database." />
        <StatCard label="Unique days" value={String(Object.keys(dayGroups).length)} delta="Week view" icon={Layers3} sparkline={[4, 4, 4, 5, 5, 5, 5]} caption="How many days currently have entries." />
        <StatCard label="Peak load" value={String(Math.max(0, ...Object.values(dayGroups)))} delta="Most dense" icon={Clock3} sparkline={[2, 3, 4, 4, 5, 5, 6]} caption="The busiest day in the current schedule." />
        <StatCard label="Template ready" value="Yes" delta="AI friendly" icon={Sparkles} sparkline={[1, 1, 2, 2, 3, 3, 4]} caption="The form is simple enough for quick slot creation." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Create slot</Badge>} description="An improved form layout with less visual noise and clearer input spacing.">
            Add timetable slot
          </SectionTitle>
          <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={key}
                className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm"
                required
              />
            ))}
            <button type="submit" disabled={createMutation.isPending} className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-medium text-brand-foreground md:col-span-2">
              {createMutation.isPending ? "Saving..." : "Save slot"}
            </button>
          </form>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Balanced</Badge>}>Schedule summary</SectionTitle>
          <div className="space-y-4">
            {Object.entries(dayGroups).map(([day, count]) => (
              <div key={day}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">{day}</span>
                  <span className="text-muted-foreground">{count} slots</span>
                </div>
                <ProgressBar value={Math.min(100, count * 18)} />
              </div>
            ))}
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Timetable insight</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">A simple overview helps identify peak load days quickly before making schedule changes.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{rows.length} slots</Badge>} description="A more polished table presentation for the school schedule.">
          School timetable
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>Loading timetable...</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>No timetable entries found.</td></tr>
              )}
              {rows.map((slot) => (
                <tr key={slot.timetable_id} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-3">{slot.day}</td>
                  <td className="px-4 py-3">{slot.start_time} - {slot.end_time}</td>
                  <td className="px-4 py-3">{slot.class_id}</td>
                  <td className="px-4 py-3">{slot.subject}</td>
                  <td className="px-4 py-3">{slot.teacher_name}</td>
                  <td className="px-4 py-3">{slot.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}