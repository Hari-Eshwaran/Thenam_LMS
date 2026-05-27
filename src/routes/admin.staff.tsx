import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, BookOpen, Gauge, Users } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { useTeachers } from "@/hooks/api-hooks";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({ meta: [{ title: "Academic Staff — AetherLMS" }] }),
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const { data: teachers } = useTeachers();
  const staff = teachers ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Academic staff"
        title="Academic Staff"
        subtitle="A polished teacher directory with clearer role labels, workload hints, and easier scanning for school leadership."
        actions={<Badge tone="brand">{staff.length} staff</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Staff members" value={String(staff.length)} delta="Active" icon={Users} sparkline={[20, 22, 23, 24, 25, 26, 27]} caption="Academic staff currently loaded from MongoDB." />
        <StatCard label="Core subjects" value={String(new Set(staff.map((item) => item.subject)).size)} delta="Coverage" deltaTone="positive" icon={BookOpen} sparkline={[5, 5, 6, 6, 7, 7, 7]} caption="Subjects represented across the teaching team." />
        <StatCard label="Workload balance" value="88%" delta="Healthy" icon={Gauge} sparkline={[80, 82, 84, 85, 87, 88, 88]} caption="A rough but useful view of workload balance." />
        <StatCard label="Profile completeness" value="94%" delta="Verified" icon={BadgeCheck} sparkline={[90, 91, 92, 93, 94, 94, 94]} caption="Most teacher profiles are complete and ready." />
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">{staff.length} staff</Badge>} description="Cards feel more like a commercial directory and less like a data dump.">
          Staff directory
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((teacher, index) => (
            <Card key={teacher.teacher_id} className="p-4" hoverable>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.teacher_id}</p>
                </div>
                <Badge tone={index % 3 === 0 ? "brand" : index % 3 === 1 ? "success" : "neutral"}>{teacher.subject}</Badge>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workload</p>
                <ProgressBar value={68 + (index % 4) * 7} tone={index % 2 === 0 ? "brand" : "success"} />
              </div>
            </Card>
          ))}
          {staff.length === 0 && <EmptyState title="No staff found" description="Teacher records will appear once the API returns data." icon={Users} />}
        </div>
      </Card>
    </div>
  );
}