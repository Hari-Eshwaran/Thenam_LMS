import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function sparklinePoints(values: number[]) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 28 - ((value - min) / range) * 20;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl space-y-3">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700 shadow-sm">
            {eyebrow}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-all duration-300",
        hoverable && "hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.28)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-60 dark:from-white/5" />
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "positive",
  progress,
  progressTone = "brand",
  icon: Icon,
  sparkline,
  caption,
  className,
  index = 0,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "neutral" | "negative";
  progress?: number;
  progressTone?: "brand" | "success" | "warning" | "danger";
  icon?: LucideIcon;
  sparkline?: number[];
  caption?: string;
  className?: string;
  index?: number;
}) {
  const tone = {
    positive: "text-success",
    neutral: "text-muted-foreground",
    negative: "text-danger",
  }[deltaTone];
  const bar = {
    brand: "bg-brand-500",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[progressTone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Card hoverable className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
              {delta && <span className={cn("text-xs font-semibold", tone)}>{delta}</span>}
            </div>
          </div>
          {Icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10 dark:bg-white/5 dark:text-brand-300">
              <Icon className="size-5" />
            </div>
          )}
        </div>
        {caption && <p className="mt-3 text-sm leading-6 text-muted-foreground">{caption}</p>}
        {sparkline && sparkline.length > 1 && (
          <div className="mt-5 h-10">
            <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="sparkline-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints(sparkline)}
                className="text-brand-600 dark:text-brand-400"
              />
              <polyline
                fill="url(#sparkline-fill)"
                stroke="none"
                points={`0,30 ${sparklinePoints(sparkline)} 100,30`}
                className="text-brand-600/10"
              />
            </svg>
          </div>
        )}
        {typeof progress === "number" && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary/80">
            <motion.div
              className={cn("h-full rounded-full", bar)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + index * 0.05 }}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "success" | "warning" | "danger" | "brand" | "neutral";
  className?: string;
  children: ReactNode;
}) {
  const map = {
    success: "border border-success/15 bg-success/10 text-success",
    warning: "border border-warning/20 bg-warning/15 text-warning",
    danger: "border border-danger/15 bg-danger/10 text-danger",
    brand: "border border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-300",
    neutral: "border border-border/70 bg-secondary/80 text-muted-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm",
        map[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  action,
  description,
}: {
  children: ReactNode;
  action?: ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground md:text-xl">{children}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-brand-foreground shadow-lg shadow-brand-600/20 transition hover:bg-brand-700",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary",
        className,
      )}
    >
      {children}
    </button>
  );
}

  export function EmptyState({
    title,
    description,
    action,
    icon: Icon,
  }: {
    title: string;
    description: string;
    action?: ReactNode;
    icon?: LucideIcon;
  }) {
    return (
      <Card className="flex flex-col items-center justify-center py-14 text-center">
        {Icon && (
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            <Icon className="size-6" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
      </Card>
    );
  }

  export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" | "warning" | "danger" }) {
    const bar = {
      brand: "bg-brand-600",
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-danger",
    }[tone];

    return (
      <div className="h-2 overflow-hidden rounded-full bg-secondary/80">
        <motion.div
          className={cn("h-full rounded-full", bar)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    );
  }

  export function TrendLine({ values }: { values: number[] }) {
    return (
      <svg viewBox="0 0 100 28" className="h-8 w-full overflow-visible">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={sparklinePoints(values)}
          className="text-brand-600 dark:text-brand-400"
        />
      </svg>
    );
  }
