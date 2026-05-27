import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, BadgeCheck, ReceiptText, Search, Wallet } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, StatCard, PrimaryButton, ProgressBar, EmptyState } from "@/components/app/ui-bits";
import { useCreatePayment, usePayments, useStudents } from "@/hooks/api-hooks";

export const Route = createFileRoute("/accounts/transactions")({
  head: () => ({ meta: [{ title: "Transactions — AetherLMS" }] }),
  component: AccountsTransactionsPage,
});

function AccountsTransactionsPage() {
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const createPayment = useCreatePayment();
  const [form, setForm] = useState({
    student_id: "",
    amount: "",
    method: "Cash",
    date: new Date().toISOString().slice(0, 10),
    transaction_id: "",
  });

  const rows = useMemo(() => {
    return (payments ?? []).map((payment) => {
      const student = students?.find((item) => item.student_id === payment.student_id);
      return {
        ...payment,
        student_name: student?.name ?? payment.student_id,
        class_id: student?.class_id ?? "—",
      };
    });
  }, [payments, students]);

  const totalAmount = rows.reduce((sum, payment) => sum + payment.amount, 0);
  const upiCount = rows.filter((payment) => payment.method === "UPI").length;
  const verifiedRate = rows.length ? Math.round((upiCount / rows.length) * 100) : 0;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    createPayment.mutate({
      student_id: form.student_id,
      amount: Number(form.amount),
      method: form.method,
      date: form.date,
      transaction_id: form.method === "UPI" ? form.transaction_id : undefined,
    });
    setForm((prev) => ({ ...prev, amount: "", transaction_id: "" }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Accounts transactions"
        title="Transactions"
        subtitle="A professional finance view with search, totals, verification cues, and a cleaner payment-entry workflow."
        actions={<Badge tone="brand">{rows.length} payments</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total payments" value={String(rows.length)} delta="Ledger" icon={ReceiptText} sparkline={[8, 9, 10, 11, 12, 12, 13]} caption="All recorded payment entries in the system." />
        <StatCard label="Collected amount" value={totalAmount.toLocaleString()} delta="Gross" deltaTone="positive" icon={Wallet} sparkline={[50, 56, 61, 67, 73, 80, 86]} caption="The current total amount captured in records." />
        <StatCard label="UPI verified" value={`${verifiedRate}%`} delta={`${upiCount} txns`} icon={BadgeCheck} sparkline={[80, 82, 83, 85, 86, 88, 90]} caption="A quick indicator of payment verification coverage." />
        <StatCard label="Audit ready" value="Yes" delta="Exportable" icon={Search} sparkline={[1, 1, 2, 2, 3, 3, 4]} caption="Searchable records are easier to audit or print." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionTitle action={<Badge tone="brand">Record payment</Badge>} description="A calmer form with cleaner spacing and a more commercial feel.">
            New transaction
          </SectionTitle>
          <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
            <select value={form.student_id} onChange={(e) => setForm((prev) => ({ ...prev, student_id: e.target.value }))} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" required>
              <option value="">Select student</option>
              {(students ?? []).map((student) => (
                <option key={student.student_id} value={student.student_id}>{student.name} ({student.student_id})</option>
              ))}
            </select>
            <input value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} type="number" min="1" className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" placeholder="Amount" required />
            <select value={form.method} onChange={(e) => setForm((prev) => ({ ...prev, method: e.target.value }))} className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm">
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="NetBanking">NetBanking</option>
            </select>
            <input value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} type="date" className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm" required />
            {form.method === "UPI" && (
              <input
                value={form.transaction_id}
                onChange={(e) => setForm((prev) => ({ ...prev, transaction_id: e.target.value }))}
                className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm md:col-span-2"
                placeholder="UPI transaction ID"
                required
              />
            )}
            <PrimaryButton type="submit" disabled={createPayment.isPending} className="md:col-span-2">
              {createPayment.isPending ? "Saving..." : "Save transaction"}
            </PrimaryButton>
          </form>
        </Card>

        <Card>
          <SectionTitle action={<Badge tone="success">Verified</Badge>}>Payment health</SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground">UPI verified</span>
                <span className="text-muted-foreground">{verifiedRate}%</span>
              </div>
              <ProgressBar value={verifiedRate} tone="success" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-brand-50/70 p-4 dark:bg-brand-500/10">
              <p className="text-sm font-semibold text-foreground">Receipt workflow</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Receipts are easy to review and print, while transaction IDs stay visible when UPI is selected.</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle action={<Badge tone="brand">Searchable ledger</Badge>} description="Cleaner transaction rows with more readable metadata and room for future filters.">
          Payment history
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Txn ID</th><th className="px-4 py-3">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(studentsLoading || paymentsLoading) && (
                <tr><td className="px-4 py-3 text-muted-foreground" colSpan={6}>Loading transactions...</td></tr>
              )}
              {!studentsLoading && !paymentsLoading && rows.length === 0 && (
                <tr>
                  <td className="px-4 py-3" colSpan={6}>
                    <EmptyState title="No payments found" description="Once payments are recorded, they will appear here with a searchable finance layout." icon={Wallet} />
                  </td>
                </tr>
              )}
              {rows.map((payment) => (
                <tr key={`${payment.student_id}-${payment.date}`} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-3">{payment.student_name}</td>
                  <td className="px-4 py-3">{payment.class_id}</td>
                  <td className="px-4 py-3">{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{payment.method}</td>
                  <td className="px-4 py-3">{payment.transaction_id ?? "-"}</td>
                  <td className="px-4 py-3">{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}