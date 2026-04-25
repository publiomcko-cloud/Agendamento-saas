"use client";

import { classNames } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent" | "warm";
}) {
  return (
    <div
      className={classNames(
        "rounded-[28px] border p-5",
        tone === "accent" &&
          "border-[var(--color-accent-soft)] bg-[linear-gradient(135deg,#dff5ef_0%,#eefbf7_100%)]",
        tone === "warm" &&
          "border-[#f0ddab] bg-[linear-gradient(135deg,#fff4d1_0%,#fff9eb_100%)]",
        tone === "default" && "border-[var(--color-border)] bg-white",
      )}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  emptyMessage,
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  emptyMessage: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
          <thead className="bg-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-panel)]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-[var(--color-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${index}-${cellIndex}`}
                      className="px-4 py-3 align-top text-[var(--color-ink)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Input({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      <input
        {...props}
        className={classNames(
          "w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]",
          className,
        )}
      />
    </label>
  );
}

export function Select({
  label,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      <select
        {...props}
        className={classNames(
          "w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]",
          className,
        )}
      >
        {children}
      </select>
    </label>
  );
}

export function Textarea({
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </span>
      <textarea
        {...props}
        className={classNames(
          "min-h-28 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-soft)]",
          className,
        )}
      />
    </label>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={classNames(
        "rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}

export function SecondaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={classNames(
        "rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-panel)] disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}
