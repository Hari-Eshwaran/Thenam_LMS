import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Clock3, ReceiptText, Sparkles, Wallet } from "lucide-react";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, SectionTitle, StatCard, Badge, PrimaryButton, SecondaryButton, ProgressBar } from "@/components/app/ui-bits";

export const Route = createFileRoute("/accounts/")({
  head: () => ({ meta: [{ title: "Accounts Dashboard — AetherLMS" }] }),
  component: AccountsDashboardPage,
});

function AccountsDashboardPage() {
  const revenue = [
    { month: "Jan", value: 78 },
    { month: "Feb", value: 80 },
    { month: "Mar", value: 82 },
    { month: "Apr", value: 84 },
    { month: "May", value: 88 },
    { month: "Jun", value: 91 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Finance command center"
        title="Financial Ledger"
        subtitle="A calmer finance module with transaction analytics, payment status, revenue trends, and verification-friendly workflows."
        actions={
          <>
            <Badge tone="success"><BadgeCheck className="mr-1 inline size-3" />UPI verified</Badge>
            <PrimaryButton>Record payment</PrimaryButton>
            <SecondaryButton>Export ledger</SecondaryButton>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue collected" value="$128k" delta="+12%" icon={Wallet} sparkline={[76, 78, 81, 83, 85, 88, 91]} caption="Revenue has accelerated in the current cycle." />
        <StatCard label="Pending fees" value="$14k" delta="-8%" deltaTone="positive" icon={Clock3} sparkline={[20, 19, 18, 17, 16, 15, 14]} caption="Overdue balance is gradually shrinking." />
        <StatCard label="Verified payments" value="94%" delta="+3" icon={BadgeCheck} sparkline={[86, 87, 88, 90, 91, 93, 94]} caption="Most transactions now pass instant validation." />
        <StatCard label="Receipts issued" value="248" delta="Today" icon={ReceiptText} sparkline={[150, 165, 180, 195, 210, 225, 248]} caption="Printable receipts are moving fast this week." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Revenue trend</Badge>} description="A clean month-over-month trend line for leadership and finance teams.">
            Revenue overview
          </SectionTitle>
          <div className="h-[320px]">
            <ResponsiveContainer>
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Area type="monotone" dataKey="value" stroke="var(--success)" fill="url(#revenueFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle action={<Badge tone="warning">Overdue</Badge>}>Payment health</SectionTitle>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Current term collection</span>
                  <span className="text-muted-foreground">94%</span>
                </div>
                <ProgressBar value={94} tone="success" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">Overdue recovery</span>
                  <span className="text-muted-foreground">71%</span>
                </div>
                <ProgressBar value={71} tone="warning" />
              </div>
              <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
                <p className="text-sm font-semibold text-foreground">Finance note</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">UPI verification is active across most transactions, reducing manual review and speeding up reconciliation.</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle action={<Badge tone="brand">Quick actions</Badge>}>Finance tools</SectionTitle>
            <div className="space-y-3">
              {[
                "Print receipt batch",
                "Export transaction audit",
                "Verify UPI payments",
                "Send overdue reminders",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}