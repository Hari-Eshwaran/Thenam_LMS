import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Wallet,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Bell,
  Sparkles,
  ChevronsLeft,
  ShieldCheck,
  Gauge,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "./ui-bits";
import { useRole, type Role } from "./role-context";

type Item = { to: string; label: string; icon: LucideIcon; note?: string };

const NAV: Record<Role, { section: string; items: Item[] }[]> = {
  admin: [
    {
      section: "Institution",
      items: [
        { to: "/admin", label: "Overview", icon: LayoutDashboard, note: "KPIs" },
        { to: "/admin/staff", label: "Academic Staff", icon: Users, note: "Faculty" },
        { to: "/admin/students", label: "Student Directory", icon: GraduationCap, note: "Search" },
        { to: "/admin/timetable", label: "Timetable", icon: CalendarDays, note: "Schedule" },
        { to: "/accounts", label: "Finance", icon: Wallet, note: "Ledger" },
      ],
    },
    {
      section: "Intelligence",
      items: [{ to: "/assistant", label: "Aether AI Assistant", icon: Sparkles, note: "Tutor" }],
    },
  ],
  teacher: [
    {
      section: "Classroom",
      items: [
        { to: "/teacher", label: "Today", icon: LayoutDashboard, note: "Focus" },
        { to: "/teacher/assignments", label: "Assignments", icon: ClipboardCheck, note: "Grading" },
        { to: "/teacher/attendance", label: "Attendance", icon: Users, note: "Mark" },
        { to: "/teacher/insights", label: "Class Insights", icon: BookOpen, note: "Trends" },
      ],
    },
    {
      section: "Intelligence",
      items: [{ to: "/assistant", label: "Aether AI Assistant", icon: Sparkles, note: "Tutor" }],
    },
  ],
  student: [
    {
      section: "Learning",
      items: [
        { to: "/student", label: "Dashboard", icon: LayoutDashboard, note: "Track" },
        { to: "/student/subjects", label: "Subjects", icon: BookOpen, note: "Progress" },
        { to: "/student/assignments", label: "Assignments", icon: ClipboardCheck, note: "Tasks" },
        { to: "/student/attendance", label: "Attendance", icon: CalendarDays, note: "Record" },
      ],
    },
    {
      section: "Intelligence",
      items: [{ to: "/assistant", label: "Learning Assistant", icon: Sparkles, note: "AI" }],
    },
  ],
  parent: [
    {
      section: "My Child",
      items: [
        { to: "/parent", label: "Overview", icon: LayoutDashboard, note: "Summary" },
        { to: "/parent/attendance", label: "Attendance", icon: CalendarDays, note: "Insights" },
        { to: "/parent/notifications", label: "Notifications", icon: Bell, note: "Alerts" },
      ],
    },
  ],
  accounts: [
    {
      section: "Finance",
      items: [
        { to: "/accounts", label: "Fee Ledger", icon: Wallet, note: "Revenue" },
        { to: "/accounts/transactions", label: "Transactions", icon: ClipboardList, note: "Audit" },
      ],
    },
  ],
};

function SidebarContent({
  collapsed,
  onToggle,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const { role, current } = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = NAV[role];

  const content = (
    <div className={cn("flex h-full min-h-0 flex-col", mobile && "bg-sidebar")}> 
      <div className="flex items-center justify-between gap-3 p-5 pb-4">
        <Link to="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-brand-foreground shadow-[0_16px_32px_-16px_rgba(79,70,229,0.7)]">
            <span className="text-sm font-bold">A</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground">AetherLMS</p>
              <p className="text-xs text-muted-foreground">Premium school operating system</p>
            </div>
          )}
        </Link>

        {!mobile && (
          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-full border border-border/70 bg-card p-2 text-muted-foreground transition hover:border-brand-300 hover:text-foreground"
          >
            <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="mx-5 mb-4 rounded-3xl border border-border/70 bg-gradient-to-br from-brand-50 via-card to-card p-4 shadow-sm dark:from-brand-500/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">Active Role</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{current.person}</p>
              <p className="text-xs text-muted-foreground">{current.subtitle}</p>
            </div>
            <Badge tone="brand">{role}</Badge>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" />
            Secure session and role-aware navigation
          </div>
        </div>
      )}

      <nav className={cn("flex-1 space-y-6 overflow-y-auto px-3 pb-4 scrollbar-none", collapsed && "px-2")}>
        {groups.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <div className="mb-2 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                {group.section}
                <span className="h-px flex-1 bg-border/70" />
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      active
                        ? "border border-brand-200/70 bg-brand-50 text-brand-800 shadow-sm dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-200"
                        : "border border-transparent text-muted-foreground hover:border-border/70 hover:bg-secondary/60 hover:text-foreground",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-brand-600" />
                    )}
                    <Icon className={cn("size-4 shrink-0", active && "text-brand-600")} />
                    {!collapsed && (
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.note && <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.note}</span>}
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm", collapsed && "justify-center")}> 
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-brand-foreground shadow-[0_16px_32px_-18px_rgba(79,70,229,0.8)]">
            {current.person
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{current.person}</p>
                <Badge tone="success">Online</Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{current.subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (mobile) {
    return content;
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 88 : 292 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl md:flex"
    >
      {content}
    </motion.aside>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return <SidebarContent collapsed={collapsed} onToggle={onToggle} />;
}

export { SidebarContent };
