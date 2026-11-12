"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addDays, weekDates, weekStartFor } from "@/lib/staff-dates";
import type {
  PublicDeepCleanTask,
  PublicStaff,
  PublicWorkSchedule,
} from "@/types/content";

type AdminStaff = PublicStaff & {
  _id: string;
  phone: string;
  accessCode: string;
  active: boolean;
};
type ApiPayload<T> = { success: boolean; data: T; message?: string };
type ScheduleStatus = PublicWorkSchedule["status"];
type TaskStatus = PublicDeepCleanTask["status"];
type ScheduleSelection = {
  staff: AdminStaff;
  date: string;
  schedule?: PublicWorkSchedule;
};

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = (await response.json()) as ApiPayload<T>;
  if (!response.ok)
    throw new Error(payload.message || "Không thể tải dữ liệu.");
  return payload.data;
}

async function send<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = (await response.json()) as ApiPayload<T>;
  if (!response.ok)
    throw new Error(payload.message || "Không thể lưu thay đổi.");
  return payload.data;
}

export function StaffManagement() {
  const [tab, setTab] = useState<"staff" | "schedule" | "clean">("staff");
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-coffee">
            Team operations
          </p>
          <h1 className="mt-3 font-display text-4xl text-espresso sm:text-5xl">
            Quản lý nhân viên
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Nhân sự, xếp ca và việc Deep Clean được quản lý trong cùng một nơi.
          </p>
        </div>
      </div>
      <div className="mb-7 flex gap-2 overflow-x-auto border-b pb-3">
        <Tab
          active={tab === "staff"}
          onClick={() => setTab("staff")}
          icon={<UsersRound size={16} />}
        >
          Nhân viên
        </Tab>
        <Tab
          active={tab === "schedule"}
          onClick={() => setTab("schedule")}
          icon={<CalendarDays size={16} />}
        >
          Xếp lịch làm việc
        </Tab>
        <Tab
          active={tab === "clean"}
          onClick={() => setTab("clean")}
          icon={<ClipboardCheck size={16} />}
        >
          Lịch Deep Clean
        </Tab>
      </div>
      {tab === "staff" ? <StaffDirectory /> : null}
      {tab === "schedule" ? <ScheduleMatrix /> : null}
      {tab === "clean" ? <DeepCleanBoard /> : null}
    </div>
  );
}

function Tab({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${active ? "bg-espresso text-white" : "text-muted-foreground hover:bg-muted hover:text-espresso"}`}
    >
      {icon}
      {children}
    </button>
  );
}

function StaffDirectory() {
  const {
    data: staff,
    error,
    isLoading,
    mutate,
  } = useSWR<AdminStaff[]>("/api/staff?admin=true", fetchData);
  const [editing, setEditing] = useState<AdminStaff | null | undefined>(
    undefined,
  );
  const [notice, setNotice] = useState<string | null>(null);
  async function remove(member: AdminStaff) {
    if (
      !window.confirm(
        `Xóa ${member.name}? Nhân viên đã có lịch sử sẽ không thể xóa.`,
      )
    )
      return;
    try {
      await send(`/api/staff/${member._id}`, "DELETE");
      setNotice("Đã xóa nhân viên.");
      mutate();
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Không thể xóa.");
    }
  }
  return (
    <section>
      <div className="mb-5 flex justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-espresso">
            Danh sách nhân viên
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mỗi người có mã riêng để xem lịch cá nhân.
          </p>
        </div>
        <Button onClick={() => setEditing(null)}>
          <Plus size={17} />
          Thêm nhân viên
        </Button>
      </div>
      {notice ? <Notice>{notice}</Notice> : null}
      {isLoading ? <LoadingRows /> : null}
      {error ? <ErrorText>{error.message}</ErrorText> : null}
      {staff ? (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="border-b bg-muted/35 text-xs uppercase tracking-[.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Nhân viên</th>
                <th className="px-5 py-4">Điện thoại</th>
                <th className="px-5 py-4">Mã truy cập</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member._id} className="border-b last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium text-espresso">{member.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {member.phone}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="rounded-md bg-muted px-2 py-1 text-xs text-espresso">
                        {member.accessCode}
                      </code>
                      <button
                        className="rounded p-1 text-coffee hover:bg-coffee/10"
                        aria-label="Copy access code"
                        onClick={() =>
                          void navigator.clipboard.writeText(member.accessCode)
                        }
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill active={member.active} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <IconButton
                        label="Chỉnh sửa"
                        onClick={() => setEditing(member)}
                      >
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        label="Xóa"
                        danger
                        onClick={() => void remove(member)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staff.length === 0 ? (
            <EmptyTable>
              Chưa có nhân viên. Hãy thêm người đầu tiên vào đội ngũ.
            </EmptyTable>
          ) : null}
        </div>
      ) : null}
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
      >
        <DialogContent>
          <DialogTitle>
            {editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
          </DialogTitle>
          {editing !== undefined ? (
            <StaffForm
              key={editing?._id ?? "new"}
              staff={editing}
              onDone={(message) => {
                setNotice(message);
                setEditing(undefined);
                mutate();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StaffForm({
  staff,
  onDone,
}: {
  staff: AdminStaff | null;
  onDone: (message: string) => void;
}) {
  const [form, setForm] = useState({
    name: staff?.name ?? "",
    phone: staff?.phone ?? "",
    role: staff?.role ?? "Barista",
    accessCode: staff?.accessCode ?? "",
    active: staff?.active ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await send(
        staff ? `/api/staff/${staff._id}` : "/api/staff",
        staff ? "PATCH" : "POST",
        form,
      );
      onDone(
        staff
          ? "Đã cập nhật nhân viên."
          : "Đã thêm nhân viên. Hãy gửi mã truy cập cho họ.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
      <Field label="Họ tên">
        <Input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </Field>
      <Field label="Chức danh">
        <Input
          required
          value={form.role}
          placeholder="Barista, BS, BC, Quản lý"
          onChange={(event) => setForm({ ...form, role: event.target.value })}
        />
      </Field>
      <Field label="Số điện thoại">
        <Input
          required
          type="tel"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
      </Field>
      <Field label="Mã truy cập">
        <Input
          value={form.accessCode}
          placeholder="Tự tạo nếu để trống"
          onChange={(event) =>
            setForm({ ...form, accessCode: event.target.value.toUpperCase() })
          }
        />
      </Field>
      <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-espresso">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) =>
            setForm({ ...form, active: event.target.checked })
          }
          className="size-4 accent-coffee"
        />
        Đang hoạt động
      </label>
      {error ? (
        <div className="sm:col-span-2">
          <ErrorText>{error}</ErrorText>
        </div>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" size={16} /> : null}
          {busy ? "Đang lưu..." : "Lưu nhân viên"}
        </Button>
      </div>
    </form>
  );
}

function ScheduleMatrix() {
  const [weekStart, setWeekStart] = useState(weekStartFor());
  const dates = useMemo(() => weekDates(weekStart), [weekStart]);

  const { data: staff, error: staffError } = useSWR<AdminStaff[]>(
    "/api/staff?admin=true",
    fetchData,
  );

  const {
    data: schedules,
    error,
    isLoading,
    mutate,
  } = useSWR<PublicWorkSchedule[]>(
    `/api/work-schedules?admin=true&weekStart=${weekStart}`,
    fetchData,
  );

  const [selection, setSelection] = useState<ScheduleSelection | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const activeStaff = staff?.filter((member) => member.active) ?? [];
  const allSchedules = schedules ?? [];

  const scheduleAt = (staffId: string, date: string) =>
    allSchedules.find(
      (schedule) => schedule.staffId === staffId && schedule.workDate === date,
    );

  const staffWeeklyTotal = (staffId: string) => {
    const rows = allSchedules.filter(
      (schedule) => schedule.staffId === staffId,
    );

    return getSchedulesTotal(rows);
  };

  const dailyTotal = (date: string) => {
    const rows = allSchedules.filter((schedule) => schedule.workDate === date);

    return getSchedulesTotal(rows);
  };

  const weeklyTotal = getSchedulesTotal(allSchedules);

  return (
    <section>
      <WeekHeader weekStart={weekStart} onChange={setWeekStart} />

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Bấm vào một ô để phân ca hoặc điều chỉnh lịch. Mỗi nhân viên có thể có
          nhiều khung giờ trong cùng một ngày.
        </p>

        <Button
          size="sm"
          onClick={() =>
            activeStaff[0] &&
            setSelection({ staff: activeStaff[0], date: weekStart })
          }
        >
          <Plus size={15} />
          Phân ca
        </Button>
      </div>

      {notice ? <Notice>{notice}</Notice> : null}

      {staffError || error ? (
        <ErrorText>
          {staffError?.message || error?.message || "Không thể tải lịch."}
        </ErrorText>
      ) : null}

      {isLoading ? (
        <LoadingRows />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="min-w-[1120px] w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 min-w-44 border-b bg-card px-5 py-4 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">
                  Nhân viên
                </th>

                {dates.map((date) => (
                  <th
                    key={date}
                    className="min-w-32 border-b px-3 py-3 text-center"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                      {format(new Date(`${date}T00:00:00Z`), "EEE", {
                        locale: vi,
                      })}
                    </p>

                    <p className="mt-1 font-display text-xl text-espresso">
                      {format(new Date(`${date}T00:00:00Z`), "dd/MM")}
                    </p>
                  </th>
                ))}

                <th className="min-w-36 border-b bg-muted/30 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tổng tuần
                </th>
              </tr>
            </thead>

            <tbody>
              {activeStaff.map((member) => {
                const weekly = staffWeeklyTotal(member._id);

                return (
                  <tr key={member._id} className="border-b last:border-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-card px-5 py-4"
                    >
                      <p className="text-sm font-medium text-espresso">
                        {member.name}
                      </p>

                      <p className="mt-1 text-xs font-normal text-muted-foreground">
                        {member.role}
                      </p>
                    </th>

                    {dates.map((date) => {
                      const schedule = scheduleAt(member._id, date);
                      const minutes = getScheduleMinutes(schedule);

                      return (
                        <td key={date} className="border-l p-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelection({
                                staff: member,
                                date,
                                schedule,
                              })
                            }
                            className={`min-h-20 w-full rounded-xl p-2 text-left text-xs transition ${
                              schedule
                                ? schedule.status === "off"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-coffee/12 text-espresso hover:bg-coffee/18"
                                : "border border-dashed border-espresso/15 text-muted-foreground hover:border-coffee hover:bg-coffee/5"
                            }`}
                          >
                            {schedule ? (
                              <>
                                <span className="block font-semibold">
                                  {schedule.status === "off"
                                    ? "Nghỉ"
                                    : schedule.shiftName}
                                </span>

                                {schedule.segments?.length ? (
                                  <span className="mt-1 block leading-relaxed">
                                    {schedule.segments.map((segment, index) => (
                                      <span
                                        key={`${segment.startTime}-${segment.endTime}-${index}`}
                                        className="block"
                                      >
                                        {segment.startTime}–{segment.endTime}
                                      </span>
                                    ))}
                                  </span>
                                ) : schedule.status !== "off" ? (
                                  <span className="mt-1 block text-[10px] text-amber-700">
                                    Chưa có giờ chi tiết
                                  </span>
                                ) : null}

                                {schedule.status !== "off" && (
                                  <span className="mt-1 block font-semibold">
                                    {minutes === null
                                      ? "Chưa tính được giờ"
                                      : formatMinutes(minutes)}
                                  </span>
                                )}

                                <span className="mt-1 block text-[10px] uppercase tracking-wide opacity-60">
                                  {schedule.status === "swapped"
                                    ? "Đổi ca"
                                    : schedule.status === "off"
                                      ? "Nghỉ"
                                      : "Đã phân"}
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Plus size={13} />
                                Phân ca
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="border-l bg-muted/20 px-4 py-3 text-center">
                      <p className="font-semibold text-espresso">
                        {weekly.unknown > 0
                          ? "Chưa đủ dữ liệu"
                          : formatMinutes(weekly.total)}
                      </p>

                      {weekly.unknown > 0 && (
                        <p className="mt-1 text-[10px] text-amber-700">
                          {weekly.unknown} lịch cũ thiếu giờ
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {activeStaff.length > 0 && (
              <tfoot>
                <tr className="border-t-2 bg-muted/30">
                  <th className="sticky left-0 z-10 bg-muted/30 px-5 py-4 text-sm font-semibold text-espresso">
                    Tổng theo ngày
                  </th>

                  {dates.map((date) => {
                    const daily = dailyTotal(date);

                    return (
                      <td key={date} className="border-l px-3 py-4 text-center">
                        <p className="text-sm font-semibold text-espresso">
                          {daily.unknown > 0
                            ? "Chưa đủ dữ liệu"
                            : formatMinutes(daily.total)}
                        </p>

                        {daily.unknown > 0 && (
                          <p className="mt-1 text-[10px] text-amber-700">
                            {daily.unknown} lịch thiếu giờ
                          </p>
                        )}
                      </td>
                    );
                  })}

                  <td className="border-l px-4 py-4 text-center">
                    <p className="font-semibold text-espresso">
                      {weeklyTotal.unknown > 0
                        ? "Chưa đủ dữ liệu"
                        : formatMinutes(weeklyTotal.total)}
                    </p>

                    {weeklyTotal.unknown > 0 && (
                      <p className="mt-1 text-[10px] text-amber-700">
                        {weeklyTotal.unknown} lịch thiếu giờ
                      </p>
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          {activeStaff.length === 0 ? (
            <EmptyTable>
              Thêm nhân viên đang hoạt động trước khi xếp lịch.
            </EmptyTable>
          ) : null}
        </div>
      )}

      <Dialog
        open={Boolean(selection)}
        onOpenChange={(open) => !open && setSelection(null)}
      >
        <DialogContent>
          {selection ? (
            <>
              <DialogTitle>
                {selection.schedule ? "Cập nhật ca làm" : "Phân ca"}
              </DialogTitle>

              <ScheduleForm
                key={
                  selection.schedule?.id ??
                  `${selection.staff._id}-${selection.date}`
                }
                selection={selection}
                onDone={(message) => {
                  setNotice(message);
                  setSelection(null);
                  mutate();
                }}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

type WorkSegment = {
  startTime: string;
  endTime: string;
};

function getSegmentMinutes(segments: WorkSegment[] = []) {
  return segments.reduce((total, segment) => {
    const [startHour, startMinute] = segment.startTime.split(":").map(Number);
    const [endHour, endMinute] = segment.endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return total;
    }

    return total + end - start;
  }, 0);
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes
    ? `${hours} giờ ${remainingMinutes} phút`
    : `${hours} giờ`;
}

function getScheduleMinutes(schedule?: PublicWorkSchedule) {
  if (!schedule) return 0;
  if (schedule.status === "off") return 0;

  // Lịch cũ chưa có giờ cụ thể: không được tự tính thành 0 giờ.
  if (!schedule.segments?.length) return null;

  return getSegmentMinutes(schedule.segments);
}

function getSchedulesTotal(schedules: PublicWorkSchedule[]) {
  let total = 0;
  let unknown = 0;

  for (const schedule of schedules) {
    const minutes = getScheduleMinutes(schedule);

    if (minutes === null) {
      unknown++;
    } else {
      total += minutes;
    }
  }

  return { total, unknown };
}

function WeekHeader({
  weekStart,
  onChange,
}: {
  weekStart: string;
  onChange: (value: string) => void;
}) {
  const end = addDays(weekStart, 6);
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-coffee">
          Tuần làm việc
        </p>
        <p className="mt-1 font-display text-2xl text-espresso">
          {format(new Date(`${weekStart}T00:00:00Z`), "dd MMM", { locale: vi })}{" "}
          —{" "}
          {format(new Date(`${end}T00:00:00Z`), "dd MMM yyyy", { locale: vi })}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-label="Tuần trước"
          onClick={() => onChange(addDays(weekStart, -7))}
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(weekStartFor())}
        >
          Tuần này
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="Tuần sau"
          onClick={() => onChange(addDays(weekStart, 7))}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function ScheduleForm({
  selection,
  onDone,
}: {
  selection: ScheduleSelection;
  onDone: (message: string) => void;
}) {
  const current = selection.schedule;

  const [form, setForm] = useState({
    shiftType: current?.shiftType ?? ("part_time" as "full_time" | "part_time"),
    segments: (current?.segments ?? []).map((segment) => ({
      startTime: segment.startTime,
      endTime: segment.endTime,
    })),
    status: current?.status ?? ("assigned" as ScheduleStatus),
    note: current?.note ?? "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalMinutes = getSegmentMinutes(form.segments);

  function changeShiftType(value: "full_time" | "part_time") {
    setForm((previous) => ({
      ...previous,
      shiftType: value,
      segments:
        value === "full_time"
          ? [{ startTime: "07:00", endTime: "15:00" }]
          : [{ startTime: "07:00", endTime: "11:00" }],
    }));
  }

  function updateSegment(
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      segments: previous.segments.map((segment, i) =>
        i === index ? { ...segment, [field]: value } : segment,
      ),
    }));
  }

  function addSegment() {
    setForm((previous) => ({
      ...previous,
      segments: [
        ...previous.segments,
        { startTime: "14:00", endTime: "18:00" },
      ],
    }));
  }

  function removeSegment(index: number) {
    setForm((previous) => ({
      ...previous,
      segments: previous.segments.filter((_, i) => i !== index),
    }));
  }

  function changeStatus(value: ScheduleStatus) {
    setForm((previous) => ({
      ...previous,
      status: value,
      segments:
        value === "off"
          ? []
          : previous.segments.length > 0
            ? previous.segments
            : [
                previous.shiftType === "full_time"
                  ? { startTime: "07:00", endTime: "15:00" }
                  : { startTime: "07:00", endTime: "11:00" },
              ],
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const shiftName =
      form.status === "off"
        ? "Nghỉ"
        : form.shiftType === "full_time"
          ? "Full-time"
          : "Part-time";

    try {
      await send(
        current ? `/api/work-schedules/${current.id}` : "/api/work-schedules",
        current ? "PATCH" : "POST",
        {
          ...form,
          shiftName,
          segments: form.status === "off" ? [] : form.segments,
          staff: selection.staff._id,
          workDate: selection.date,
        },
      );

      onDone(current ? "Đã cập nhật ca làm." : "Đã phân ca.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!current || !window.confirm("Xóa ca làm này?")) return;

    setBusy(true);
    setError(null);

    try {
      await send(`/api/work-schedules/${current.id}`, "DELETE");
      onDone("Đã xóa ca làm.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể xóa.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <div className="rounded-xl bg-muted/60 px-4 py-3 text-sm">
        <span className="font-semibold text-espresso">
          {selection.staff.name}
        </span>

        <span className="mx-2 text-muted-foreground">·</span>

        {format(new Date(`${selection.date}T00:00:00Z`), "EEEE, dd/MM", {
          locale: vi,
        })}
      </div>

      <Field label="Loại ca làm">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => changeShiftType("full_time")}
            className={`rounded-xl border p-3 text-left transition ${
              form.shiftType === "full_time"
                ? "border-coffee bg-coffee/10 text-espresso"
                : "border-border bg-white/60 text-muted-foreground"
            }`}
          >
            <span className="block text-sm font-semibold">Full-time</span>
            <span className="mt-1 block text-xs opacity-70">
              Mặc định 07:00–15:00
            </span>
          </button>

          <button
            type="button"
            onClick={() => changeShiftType("part_time")}
            className={`rounded-xl border p-3 text-left transition ${
              form.shiftType === "part_time"
                ? "border-coffee bg-coffee/10 text-espresso"
                : "border-border bg-white/60 text-muted-foreground"
            }`}
          >
            <span className="block text-sm font-semibold">Part-time</span>
            <span className="mt-1 block text-xs opacity-70">
              Giờ làm linh hoạt
            </span>
          </button>
        </div>
      </Field>

      <Field label="Trạng thái">
        <select
          value={form.status}
          onChange={(event) =>
            changeStatus(event.target.value as ScheduleStatus)
          }
          className="h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none focus:border-coffee"
        >
          <option value="assigned">Đã phân công</option>
          <option value="swapped">Đã đổi ca</option>
          <option value="off">Nghỉ</option>
        </select>
      </Field>

      {form.status !== "off" && (
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-espresso">
                Khung giờ làm việc
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Có thể thêm nhiều khung giờ trong cùng một ngày.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={form.segments.length >= 8}
              onClick={addSegment}
            >
              <Plus size={14} />
              Thêm ca
            </Button>
          </div>

          {current && !current.segments?.length && current.status !== "off" && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
              Lịch này được tạo từ phiên bản cũ và chưa có giờ bắt đầu, kết
              thúc. Vui lòng nhập giờ làm thực tế trước khi lưu để hệ thống tính
              được tổng giờ.
            </div>
          )}

          {form.segments.map((segment, index) => (
            <div key={index} className="rounded-xl border bg-white/50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-espresso">
                  Khung giờ {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeSegment(index)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 size={13} />
                  Xóa
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Bắt đầu">
                  <input
                    type="time"
                    required
                    value={segment.startTime}
                    onChange={(event) =>
                      updateSegment(index, "startTime", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-coffee"
                  />
                </Field>

                <Field label="Kết thúc">
                  <input
                    type="time"
                    required
                    value={segment.endTime}
                    onChange={(event) =>
                      updateSegment(index, "endTime", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-coffee"
                  />
                </Field>
              </div>
            </div>
          ))}

          {form.segments.length === 0 && (
            <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
              Chưa có khung giờ. Nhấn nút Thêm ca để tạo khung giờ làm việc.
            </p>
          )}

          <div className="flex items-center justify-between rounded-xl bg-coffee/10 px-4 py-3">
            <span className="text-sm font-medium text-espresso">
              Tổng thời gian làm việc
            </span>

            <span className="text-base font-bold text-espresso">
              {formatMinutes(totalMinutes)}
            </span>
          </div>
        </div>
      )}

      <Field label="Ghi chú">
        <Textarea
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
          className="min-h-20"
        />
      </Field>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="animate-spin" size={16} /> : null}
          Lưu ca
        </Button>

        {current ? (
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => void remove()}
          >
            <Trash2 size={16} />
            Xóa ca
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function DeepCleanBoard() {
  const [weekStart, setWeekStart] = useState(weekStartFor());
  const { data: staff } = useSWR<AdminStaff[]>(
    "/api/staff?admin=true",
    fetchData,
  );
  const {
    data: tasks,
    error,
    isLoading,
    mutate,
  } = useSWR<PublicDeepCleanTask[]>(
    `/api/deep-clean-tasks?admin=true&weekStart=${weekStart}`,
    fetchData,
  );
  const [editing, setEditing] = useState<
    PublicDeepCleanTask | null | undefined
  >(undefined);
  const [notice, setNotice] = useState<string | null>(null);
  async function remove(task: PublicDeepCleanTask) {
    if (!window.confirm(`Xóa “${task.taskName}”?`)) return;
    try {
      await send(`/api/deep-clean-tasks/${task.id}`, "DELETE");
      setNotice("Đã xóa công việc.");
      mutate();
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Không thể xóa.");
    }
  }
  return (
    <section>
      <WeekHeader weekStart={weekStart} onChange={setWeekStart} />
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl text-espresso">
            Lịch Deep Clean
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tạo một việc thủ công hoặc lặp lại hàng tuần trong tối đa 12 tuần.
          </p>
        </div>
        <Button onClick={() => setEditing(null)}>
          <Plus size={17} />
          Tạo công việc
        </Button>
      </div>
      {notice ? <Notice>{notice}</Notice> : null}
      {error ? <ErrorText>{error.message}</ErrorText> : null}
      {isLoading ? (
        <LoadingRows />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks?.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.16em] text-coffee">
                    Hạn{" "}
                    {format(
                      new Date(`${task.dueDate}T00:00:00Z`),
                      "EEE, dd/MM",
                      { locale: vi },
                    )}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-espresso">
                    {task.taskName}
                  </h3>
                </div>
                <TaskStatusPill status={task.status} />
              </div>
              {task.detail ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {task.detail}
                </p>
              ) : null}
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Phụ trách{" "}
                  <span className="font-medium text-espresso">
                    {task.assignedToName}
                  </span>
                </p>
                <div className="flex gap-1">
                  <IconButton
                    label="Chỉnh sửa"
                    onClick={() => setEditing(task)}
                  >
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    label="Xóa"
                    danger
                    onClick={() => void remove(task)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
            </article>
          ))}
          {tasks?.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyTable>Chưa có việc Deep Clean trong tuần này.</EmptyTable>
            </div>
          ) : null}
        </div>
      )}
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
      >
        <DialogContent>
          {editing !== undefined ? (
            <>
              <DialogTitle>
                {editing ? "Cập nhật việc Deep Clean" : "Tạo việc Deep Clean"}
              </DialogTitle>
              <DeepCleanForm
                key={editing?.id ?? "new"}
                staff={staff?.filter((member) => member.active) ?? []}
                task={editing}
                defaultDate={weekStart}
                onDone={(message) => {
                  setNotice(message);
                  setEditing(undefined);
                  mutate();
                }}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function DeepCleanForm({
  staff,
  task,
  defaultDate,
  onDone,
}: {
  staff: AdminStaff[];
  task: PublicDeepCleanTask | null;
  defaultDate: string;
  onDone: (message: string) => void;
}) {
  const [form, setForm] = useState({
    taskName: task?.taskName ?? "",
    detail: task?.detail ?? "",
    assignedTo: task?.assignedToId ?? staff[0]?._id ?? "",
    dueDate: task?.dueDate ?? defaultDate,
    status: task?.status ?? ("pending" as TaskStatus),
    repeatWeeks: 1,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await send(
        task ? `/api/deep-clean-tasks/${task.id}` : "/api/deep-clean-tasks",
        task ? "PATCH" : "POST",
        form,
      );
      onDone(
        task
          ? "Đã cập nhật việc Deep Clean."
          : form.repeatWeeks > 1
            ? `Đã tạo chuỗi công việc trong ${form.repeatWeeks} tuần.`
            : "Đã tạo công việc Deep Clean.",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="mt-6 grid gap-4" onSubmit={submit}>
      <Field label="Công việc">
        <Input
          required
          value={form.taskName}
          placeholder="Vệ sinh máy pha cà phê"
          onChange={(event) =>
            setForm({ ...form, taskName: event.target.value })
          }
        />
      </Field>
      <Field label="Phân công">
        <select
          required
          value={form.assignedTo}
          onChange={(event) =>
            setForm({ ...form, assignedTo: event.target.value })
          }
          className="h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none focus:border-coffee"
        >
          <option value="">Chọn nhân viên…</option>
          {staff.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} · {member.role}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Hạn hoàn thành">
          <Input
            required
            type="date"
            value={form.dueDate}
            onChange={(event) =>
              setForm({ ...form, dueDate: event.target.value })
            }
          />
        </Field>
        <Field label="Trạng thái">
          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as TaskStatus })
            }
            className="h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none focus:border-coffee"
          >
            <option value="pending">Chưa làm</option>
            <option value="in_progress">Đang làm</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </Field>
      </div>
      {!task ? (
        <Field label="Lặp lại mỗi tuần">
          <select
            value={form.repeatWeeks}
            onChange={(event) =>
              setForm({ ...form, repeatWeeks: Number(event.target.value) })
            }
            className="h-11 w-full rounded-xl border bg-white/70 px-3 text-sm outline-none focus:border-coffee"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index === 0
                  ? "Không lặp lại"
                  : `Lặp lại trong ${index + 1} tuần`}
              </option>
            ))}
          </select>
        </Field>
      ) : null}
      <Field label="Hướng dẫn / ghi chú">
        <Textarea
          value={form.detail}
          onChange={(event) => setForm({ ...form, detail: event.target.value })}
          className="min-h-24"
        />
      </Field>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button type="submit" disabled={busy || !staff.length}>
        {busy ? <LoaderCircle className="animate-spin" size={16} /> : null}
        {task ? "Lưu thay đổi" : "Tạo công việc"}
      </Button>
      {!staff.length ? (
        <p className="text-xs text-red-700">
          Hãy tạo nhân viên đang hoạt động trước khi phân công.
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-espresso">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
function IconButton({
  label,
  children,
  danger = false,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${danger ? "text-red-700 hover:bg-red-50" : "text-coffee hover:bg-coffee/10"}`}
    >
      {children}
    </button>
  );
}
function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}
    >
      {active ? "Đang hoạt động" : "Ngừng hoạt động"}
    </span>
  );
}
function TaskStatusPill({ status }: { status: TaskStatus }) {
  const labels: Record<TaskStatus, string> = {
    pending: "Chưa làm",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
  };
  const colors: Record<TaskStatus, string> = {
    pending: "bg-amber-50 text-amber-800",
    in_progress: "bg-sky-50 text-sky-800",
    completed: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="mb-4 rounded-xl bg-coffee/10 px-4 py-3 text-sm text-coffee"
    >
      {children}
    </p>
  );
}
function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {children}
    </p>
  );
}
function EmptyTable({ children }: { children: React.ReactNode }) {
  return (
    <p className="p-8 text-center text-sm text-muted-foreground">{children}</p>
  );
}
function LoadingRows() {
  return (
    <div className="grid gap-3">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
