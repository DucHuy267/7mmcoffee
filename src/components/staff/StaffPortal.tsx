"use client";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  KeyRound,
  LoaderCircle,
  UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDays, weekDates, weekStartFor } from "@/lib/staff-dates";
import type {
  PublicDeepCleanTask,
  PublicStaff,
  PublicWorkSchedule,
} from "@/types/content";

type PortalData = {
  staff: PublicStaff;
  schedules: PublicWorkSchedule[];
  tasks: PublicDeepCleanTask[];
};
type ApiResponse<T> = { success: boolean; data: T; message?: string };

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok)
    throw new Error(payload.message || "Unable to load the schedule.");
  return payload.data;
}

function formatStaffDate(dateString: string, locale: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = date.getUTCDay();

  if (locale === "vi") {
    const weekdays = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    return `${weekdays[weekday]}, ${day} thg ${month}`;
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${weekdays[weekday]}, ${months[month - 1]} ${day}`;
}

export function StaffPortal({
  staff,
  initialSchedules,
  initialTasks,
  initialWeek,
}: {
  staff: PublicStaff[];
  initialSchedules: PublicWorkSchedule[];
  initialTasks: PublicDeepCleanTask[];
  initialWeek: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Staff");
  const [weekStart, setWeekStart] = useState(initialWeek);
  const [activeTab, setActiveTab] = useState<"schedule" | "deepClean">(
    "schedule",
  );
  const [selectedId, setSelectedId] = useState("all");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [personal, setPersonal] = useState<PortalData | null>(null);
  const [checking, setChecking] = useState(false);
  const dates = useMemo(() => weekDates(weekStart), [weekStart]);
  const suffix = selectedId !== "all" ? `&staffId=${selectedId}` : "";
  const schedulesResult = useSWR<PublicWorkSchedule[]>(
    `/api/work-schedules?weekStart=${weekStart}${suffix}`,
    fetchData,
    {
      fallbackData:
        weekStart === initialWeek && selectedId === "all"
          ? initialSchedules
          : undefined,
    },
  );
  const tasksResult = useSWR<PublicDeepCleanTask[]>(
    `/api/deep-clean-tasks?weekStart=${weekStart}${suffix}`,
    fetchData,
    {
      fallbackData:
        weekStart === initialWeek && selectedId === "all"
          ? initialTasks
          : undefined,
    },
  );
  const schedules = personal
    ? personal.schedules
    : (schedulesResult.data ?? []);
  const tasks = personal ? personal.tasks : (tasksResult.data ?? []);
  const dateFormat = (
    <p className="mt-1 font-display text-2xl text-espresso">
      {formatStaffDate(weekStart, locale)} —{" "}
      {formatStaffDate(addDays(weekStart, 6), locale)}
    </p>
  );
  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setCodeError(null);
    try {
      const response = await fetch(`/api/staff-portal?weekStart=${weekStart}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as ApiResponse<PortalData>;
      if (!response.ok)
        throw new Error(payload.message || "Invalid staff code.");
      setPersonal(payload.data);
      setSelectedId(payload.data.staff.id);
    } catch (reason) {
      setPersonal(null);
      setCodeError(
        reason instanceof Error ? reason.message : "Không thể kiểm tra mã.",
      );
    } finally {
      setChecking(false);
    }
  }
  function changeWeek(next: string) {
    setWeekStart(next);
    setPersonal(null);
    setCodeError(null);
  }
  function chooseStaff(id: string) {
    setSelectedId(id);
    setPersonal(null);
    setCodeError(null);
  }
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-espresso px-5 pb-14 pt-32 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-cream/65">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] sm:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-cream/75">
            {t("subtitle")}
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-5xl px-5 py-8 pb-20 lg:px-8 lg:py-12">
        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-coffee">
                {t("week")}
              </p>
              <p className="mt-1 font-display text-2xl text-espresso">
                {formatStaffDate(weekStart, locale)} —{" "}
                {formatStaffDate(addDays(weekStart, 6), locale)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                aria-label={t("previous")}
                onClick={() => changeWeek(addDays(weekStart, -7))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeWeek(weekStartFor())}
              >
                {t("current")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-label={t("next")}
                onClick={() => changeWeek(addDays(weekStart, 7))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-[1fr_20rem]">
            <label className="block text-sm font-medium text-espresso">
              <span className="mb-2 flex items-center gap-2">
                <UsersRound size={16} className="text-coffee" />
                {t("chooseStaff")}
              </span>
              <select
                value={selectedId}
                onChange={(event) => chooseStaff(event.target.value)}
                className="h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none focus:border-coffee"
              >
                <option value="all">{t("allStaff")}</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} · {member.role}
                  </option>
                ))}
              </select>
            </label>
            <form onSubmit={verifyCode}>
              <label className="block text-sm font-medium text-espresso">
                <span className="mb-2 flex items-center gap-2">
                  <KeyRound size={16} className="text-coffee" />
                  {t("accessCode")}
                </span>
                <div className="flex gap-2">
                  <Input
                    value={code}
                    placeholder={t("accessPlaceholder")}
                    onChange={(event) =>
                      setCode(event.target.value.toUpperCase())
                    }
                  />
                  <Button type="submit" size="sm" disabled={checking}>
                    {checking ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : null}
                    {t("checkCode")}
                  </Button>
                </div>
              </label>
            </form>
          </div>
          {codeError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {codeError}
            </p>
          ) : null}
          {personal ? (
            <p className="mt-4 rounded-xl bg-coffee/10 px-4 py-3 text-sm font-medium text-coffee">
              {t("personalFor", { name: personal.staff.name })}
            </p>
          ) : null}
        </section>
        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border bg-card p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            aria-pressed={activeTab === "schedule"}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
              activeTab === "schedule"
                ? "bg-espresso text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <CalendarMark />
            <span>{t("schedule")}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "schedule"
                  ? "bg-white/15 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {schedules.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("deepClean")}
            aria-pressed={activeTab === "deepClean"}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
              activeTab === "deepClean"
                ? "bg-espresso text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <ClipboardCheck size={18} />
            <span>{t("deepClean")}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "deepClean"
                  ? "bg-white/15 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tasks.length}
            </span>
          </button>
        </div>

        {activeTab === "schedule" ? (
          <section className="mt-6" aria-label={t("schedule")}>
            <Heading icon={<CalendarMark />} title={t("schedule")} />
            {schedulesResult.error ? (
              <ErrorText>{schedulesResult.error.message}</ErrorText>
            ) : null}
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {dates.map((date) => (
                <DaySchedule
                  key={date}
                  date={date}
                  schedules={schedules.filter(
                    (schedule) => schedule.workDate === date,
                  )}
                  locale={locale}
                  t={t}
                />
              ))}
            </div>
            {schedules.length === 0 ? <Empty>{t("noSchedules")}</Empty> : null}
          </section>
        ) : (
          <section className="mt-6" aria-label={t("deepClean")}>
            <Heading
              icon={<ClipboardCheck className="text-coffee" size={21} />}
              title={t("deepClean")}
            />
            {tasksResult.error ? (
              <ErrorText>{tasksResult.error.message}</ErrorText>
            ) : null}
            <div className="mt-5 grid gap-3">
              {tasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[.14em] text-coffee">
                        {formatStaffDate(task.dueDate, locale)}
                      </p>
                      <h3 className="mt-1 font-display text-xl text-espresso">
                        {task.taskName}
                      </h3>
                    </div>
                    <TaskState status={task.status} t={t} />
                  </div>
                  {task.detail ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {task.detail}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {task.assignedToName}
                  </p>
                </article>
              ))}
            </div>
            {tasks.length === 0 ? <Empty>{t("noTasks")}</Empty> : null}
          </section>
        )}
      </main>
    </div>
  );
}

function Heading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-full bg-coffee/10 text-coffee">
        {icon}
      </span>
      <h2 className="font-display text-3xl text-espresso">{title}</h2>
    </div>
  );
}
function CalendarMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function formatWorkDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} phút`;
  if (remainingMinutes === 0) return `${hours} giờ`;

  return `${hours} giờ ${remainingMinutes} phút`;
}

function getSegmentDuration(startTime: string, endTime: string) {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return toMinutes(endTime) - toMinutes(startTime);
}

function DaySchedule({
  date,
  schedules,
  locale,
  t,
}: {
  date: string;
  schedules: PublicWorkSchedule[];
  locale: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <article className="rounded-2xl border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
        {formatStaffDate(date, locale)}
      </p>

      {schedules.length ? (
        <div className="mt-3 grid gap-3">
          {schedules.map((schedule) => {
            const segments = schedule.segments ?? [];

            const totalMinutes = segments.reduce((total, segment) => {
              const duration = getSegmentDuration(
                segment.startTime,
                segment.endTime,
              );

              return duration > 0 ? total + duration : total;
            }, 0);

            return (
              <div
                key={schedule.id}
                className={`rounded-xl px-3 py-3 ${
                  schedule.status === "off"
                    ? "bg-muted text-muted-foreground"
                    : "bg-coffee/10 text-espresso"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{schedule.shiftName}</p>

                  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-65">
                    {schedule.status === "assigned"
                      ? t("assigned")
                      : schedule.status === "swapped"
                        ? t("swapped")
                        : t("off")}
                  </span>
                </div>

                <p className="mt-1 text-xs opacity-75">
                  {schedule.staffName} · {schedule.staffRole}
                </p>

                {schedule.status !== "off" && (
                  <div className="mt-3 rounded-lg bg-white/70 p-3">
                    <p className="mb-2 text-xs font-semibold text-coffee">
                      Thời gian làm việc
                    </p>

                    {segments.length > 0 ? (
                      <div className="space-y-2">
                        {segments.map((segment, index) => (
                          <div
                            key={`${segment.startTime}-${segment.endTime}-${index}`}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-coffee" />
                              <span className="text-sm font-semibold text-espresso">
                                {segment.startTime} – {segment.endTime}
                              </span>
                            </div>

                            <span className="text-xs text-muted-foreground">
                              {formatWorkDuration(
                                Math.max(
                                  0,
                                  getSegmentDuration(
                                    segment.startTime,
                                    segment.endTime,
                                  ),
                                ),
                              )}
                            </span>
                          </div>
                        ))}

                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Tổng thời gian
                          </span>
                          <span className="text-sm font-bold text-coffee">
                            {formatWorkDuration(totalMinutes)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700">
                        Chưa có giờ chi tiết. Vui lòng liên hệ quản lý.
                      </p>
                    )}
                  </div>
                )}

                {schedule.note ? (
                  <p className="mt-2 text-xs opacity-75">
                    Ghi chú: {schedule.note}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">—</p>
      )}
    </article>
  );
}

function TaskState({
  status,
  t,
}: {
  status: PublicDeepCleanTask["status"];
  t: ReturnType<typeof useTranslations>;
}) {
  const labels = {
    pending: t("pending"),
    in_progress: t("inProgress"),
    completed: t("completed"),
  };
  const styles = {
    pending: "bg-amber-50 text-amber-800",
    in_progress: "bg-sky-50 text-sky-800",
    completed: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {children}
    </p>
  );
}
