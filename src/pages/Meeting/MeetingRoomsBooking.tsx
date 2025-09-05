import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import styles from "./MeetingRoomsBooking.module.css";
import ParticlesComponent from "../../components/Particles/Particles";

type NavState = {
  name: string;
  description: string;
  min: number;
  max: number;
};
type EmailNode =
  | { id?: number; email?: string; attributes?: { email?: string } }
  | undefined;

interface Booking {
  id: number;
  documentId: string;
  date: string;
  start_time: string;
  end_time: string;
  subject: string;
  description: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  meeting_room?: { documentId: string };
  email?: EmailNode[] | { data: EmailNode[] };
}

interface RoomDetails {
  name: string;
  description: string;
  min: number;
  max: number;
}

interface BookingFormData {
  subject: string;
  description: string;
  contact_email: string;
  contact_name: string;
  contact_phone?: string;
  participants: string[];
  date: string;
  start_time: string;
  end_time: string;
  meeting_room: string;
}

const DEBUG = false;
const dbg = (...args: any[]) => DEBUG && console.log("[MRB]", ...args);
const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
const genRid = () =>
  `fe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const LOCALE = "en";

const toMinutes = (val: string): number => {
  if (!val) return 0;
  if (val.includes("T")) {
    const d = new Date(val);
    return d.getHours() * 60 + d.getMinutes();
  }
  const [h, m] = val.split(":");
  return (parseInt(h || "0", 10) || 0) * 60 + (parseInt(m || "0", 10) || 0);
};

const rangesOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
) => aStart < bEnd && bStart < aEnd;

const getWeekDates = (date?: Date) => {
  const today = date || new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(today.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
};

const thDate = (d: Date) =>
  d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const ymdd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseLocalYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

const generateTimeOptions = () => {
  const t: string[] = [];
  for (let h = 7; h <= 20; h++) t.push(`${String(h).padStart(2, "0")}:00`);
  return t;
};

const validateTimeSelection = (start: string, end: string): boolean => {
  const s = toMinutes(start);
  const e = toMinutes(end);
  return s >= 7 * 60 && e <= 20 * 60 && s < e;
};

const extractParticipants = (b: Booking): string[] => {
  const raw: any = b?.email;
  const arr: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : [];
  const seen = new Set<string>();
  return arr
    .map((e: any) =>
      (e?.email ?? e?.attributes?.email ?? "").trim().toLowerCase()
    )
    .filter((s: string) => {
      if (!s || seen.has(s)) return false;
      seen.add(s);
      return true;
    });
};

const MeetingRoomsBooking: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // documentId ของห้อง
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state as NavState | undefined) ?? undefined;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // numeric id ของ room (ใช้เพื่อ enable ปุ่ม/validation)
  const [roomEntryId, setRoomEntryId] = useState<number | null>(null);

  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekDates, setWeekDates] = useState(getWeekDates());
  const [currentDisplayedWeek, setCurrentDisplayedWeek] = useState(
    getWeekDates()
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeError, setTimeError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    subject: "",
    description: "",
    contact_email: "",
    contact_name: "",
    contact_phone: "",
    participants: [""],
    date: "",
    start_time: "",
    end_time: "",
    meeting_room: roomId || "",
  });

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookingDocId, setEditingBookingDocId] = useState<string | null>(
    null
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  const validateRequiredFields = () => {
    if (!roomEntryId) {
      setFormError("ไม่พบห้องประชุม หรือระบบยังโหลดข้อมูลห้องไม่เสร็จ");
      return false;
    }
    if (
      !formData.subject ||
      !formData.description ||
      !formData.contact_email ||
      !formData.contact_name
    ) {
      setFormError("กรุณากรอกข้อมูลให้ครบ");
      return false;
    }
    if (!selectedDate || !startTime || !endTime) {
      setFormError("กรุณาเลือกวันที่และเวลาให้ครบ");
      return false;
    }
    return true;
  };

  // โหลด "ชื่อห้อง + numeric id" จาก Strapi ด้วย roomId (documentId)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!roomId) return;

        // 1) ใช้ state จาก Nav ถ้ามี เพื่อให้หัวข้อแสดงเร็วขึ้น
        if (navState) {
          setRoomDetails({
            name: navState.name ?? "",
            description: navState.description ?? "",
            min: Number(navState.min ?? 1),
            max: Number(navState.max ?? 999),
          });
        }

        // 2) ดึงจาก Strapi เพื่อความแน่นอน + เอา numeric id
        const qs = new URLSearchParams({
          "filters[documentId][$eq]": roomId,
          "filters[locale][$eq]": LOCALE,
          "fields[0]": "name",
          "fields[1]": "description",
          "fields[2]": "min",
          "fields[3]": "max",
          "pagination[page]": "1",
          "pagination[pageSize]": "1",
        });
        const res = await fetch(`${apiUrl}/api/meeting-rooms?${qs.toString()}`);
        if (!res.ok) throw new Error("โหลดข้อมูลห้องไม่สำเร็จ");
        const json = await res.json();

        const row = json?.data?.[0];
        const id = row?.id ?? null;
        const attrs = row?.attributes ?? null;

        if (!alive) return;

        setRoomEntryId(id);
        setRoomDetails({
          name: attrs?.name ?? navState?.name ?? "",
          description: attrs?.description ?? navState?.description ?? "",
          min: Number(attrs?.min ?? navState?.min ?? 1),
          max: Number(attrs?.max ?? navState?.max ?? 999),
        });
      } catch (e: any) {
        if (!alive) return;
        // ยังแสดงหน้าต่อได้ แต่หัวข้ออาจเป็น fallback
        setRoomEntryId(null);
        if (!navState)
          setRoomDetails({ name: "", description: "", min: 1, max: 999 });
        dbg("LOAD_ROOM_FAILED", e?.message || e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, apiUrl]);

  const fetchBookings = async () => {
    if (!roomId) return;
    try {
      const startDate = ymdd(currentDisplayedWeek.monday);
      const endDate = ymdd(currentDisplayedWeek.sunday);
      const qs = new URLSearchParams({
        locale: LOCALE,
        "filters[date][$gte]": startDate,
        "filters[date][$lte]": endDate,
        "filters[meeting_room][documentId][$eq]": roomId,
        populate: "*",
      });
      const url = `${apiUrl}/api/bookings?${qs.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("โหลดข้อมูลการจองไม่สำเร็จ");
      const json = await res.json();
      setBookings(json?.data || []);
    } catch (err: any) {
      setFetchError(err?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    }
  };

  useEffect(() => {
    if (!roomId) return;
    setFetchError(null);
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    roomId,
    currentDisplayedWeek.monday.toISOString(),
    currentDisplayedWeek.sunday.toISOString(),
    apiUrl,
    refreshKey,
  ]);

  useEffect(() => {
    const onFocusOrVisible = () => {
      if (document.visibilityState === "visible") {
        fetchBookings();
      }
    };
    document.addEventListener("visibilitychange", onFocusOrVisible);
    window.addEventListener("focus", onFocusOrVisible);
    return () => {
      document.removeEventListener("visibilitychange", onFocusOrVisible);
      window.removeEventListener("focus", onFocusOrVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomBookingUrl = React.useMemo(() => {
    if (!roomId) return "/meeting-rooms";
    const qs = new URLSearchParams({
      name: roomDetails?.name ?? "",
      description: roomDetails?.description ?? "",
      min: String(roomDetails?.min ?? 0),
      max: String(roomDetails?.max ?? 0),
    });
    return `/meeting-rooms-booking/${roomId}?${qs.toString()}`;
  }, [
    roomId,
    roomDetails?.name,
    roomDetails?.description,
    roomDetails?.min,
    roomDetails?.max,
  ]);

  const handlePreviousWeek = () => {
    const newMon = new Date(currentDisplayedWeek.monday);
    newMon.setDate(newMon.getDate() - 7);
    newMon.setHours(0, 0, 0, 0);
    const newSun = new Date(newMon);
    newSun.setDate(newMon.getDate() + 6);
    newSun.setHours(23, 59, 59, 999);
    setCurrentDisplayedWeek({ monday: newMon, sunday: newSun });
    setWeekDates({ monday: newMon, sunday: newSun });
  };

  const handleNextWeek = () => {
    const newMon = new Date(currentDisplayedWeek.monday);
    newMon.setDate(newMon.getDate() + 7);
    newMon.setHours(0, 0, 0, 0);
    const newSun = new Date(newMon);
    newSun.setDate(newMon.getDate() + 6);
    newSun.setHours(23, 59, 59, 999);
    setCurrentDisplayedWeek({ monday: newMon, sunday: newSun });
    setWeekDates({ monday: newMon, sunday: newSun });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setStartTime(v);
    setTimeError(
      endTime && !validateTimeSelection(v, endTime)
        ? "กรุณาเลือกเวลา 07:00–20:00 และเวลาเริ่ม < เวลาสิ้นสุด"
        : null
    );
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setEndTime(v);
    setTimeError(
      startTime && !validateTimeSelection(startTime, v)
        ? "กรุณาเลือกเวลา 07:00–20:00 และเวลาเริ่ม < เวลาสิ้นสุด"
        : null
    );
  };

  const timeOptions = React.useMemo(generateTimeOptions, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (idx: number, value: string) => {
    const list = [...formData.participants];
    list[idx] = value;
    setFormData((prev) => ({ ...prev, participants: list }));
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateEmails = () => {
    if (!isEmail(formData.contact_email)) {
      setFormError("รูปแบบอีเมล์ผู้จองไม่ถูกต้อง");
      return false;
    }
    const invalid = formData.participants
      .filter((e) => e.trim() !== "")
      .filter((e) => !isEmail(e));
    if (invalid.length) {
      setFormError(`อีเมล์ผู้เข้าร่วมไม่ถูกต้อง: ${invalid.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateTime = () => {
    if (!validateTimeSelection(startTime, endTime)) {
      setFormError(
        "เวลาจองต้องอยู่ระหว่าง 07:00 - 20:00 และเวลาเริ่ม < เวลาสิ้นสุด"
      );
      return false;
    }
    return true;
  };

  const validateBookingOverlap = () => {
    const day = selectedDate ? ymdd(selectedDate) : "";
    const sReq = toMinutes(startTime);
    const eReq = toMinutes(endTime);
    const clash = bookings.find((b) => {
      if (b.documentId === editingBookingDocId) return false;
      if (b.date !== day) return false;
      const sB = toMinutes(b.start_time);
      const eB = toMinutes(b.end_time);
      return rangesOverlap(sReq, eReq, sB, eB);
    });
    if (clash) {
      setFormError("มีการจองในช่วงเวลานี้แล้ว");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    setFormError(null);
    return (
      validateRequiredFields() &&
      validateEmails() &&
      validateTime() &&
      validateBookingOverlap()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const rid = genRid();

    try {
      const participants = formData.participants.filter((e) => e.trim() !== "");
      const bookingDate = selectedDate ? ymdd(selectedDate) : "";

      const payload = {
        data: {
          locale: LOCALE,
          date: bookingDate,
          start_time: `${startTime}:00.000`,
          end_time: `${endTime}:00.000`,
          subject: formData.subject,
          description: formData.description,
          contact_email: formData.contact_email,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone || "",
          meeting_room: roomId
            ? { connect: { documentId: roomId } }
            : undefined,
          email: participants.map((email) => ({ email })),
        },
      };

      const url = `${apiUrl}/api/bookings?locale=${LOCALE}&rid=${encodeURIComponent(
        rid
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || "การจองไม่สำเร็จ");
      }

      navigate("/booking-confirm", { state: { redirectTo: roomBookingUrl } });
      setFormData({
        subject: "",
        description: "",
        contact_email: "",
        contact_name: "",
        contact_phone: "",
        participants: [""],
        date: "",
        start_time: "",
        end_time: "",
        meeting_room: roomId || "",
      });
      setSelectedDate(null);
      setStartTime("");
      setEndTime("");
      setShowBookingForm(false);
      setRefreshKey((x) => x + 1);
    } catch (err: any) {
      window.alert(err?.message || "เกิดข้อผิดพลาดในการจอง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm() || !editingBookingDocId) return;

    setIsSubmitting(true);
    const rid = genRid();

    try {
      const participants = formData.participants.filter((e) => e.trim() !== "");
      const bookingDate = selectedDate ? ymdd(selectedDate) : "";

      const payload = {
        data: {
          locale: LOCALE,
          date: bookingDate,
          start_time: `${startTime}:00.000`,
          end_time: `${endTime}:00.000`,
          subject: formData.subject,
          description: formData.description,
          contact_email: formData.contact_email,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone || "",
          meeting_room: roomId
            ? { connect: { documentId: roomId } }
            : undefined,
          email: participants.map((email) => ({ email })),
        },
      };

      const url = `${apiUrl}/api/bookings/${editingBookingDocId}?locale=${LOCALE}&rid=${encodeURIComponent(
        rid
      )}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || "การอัพเดทไม่สำเร็จ");
      }

      navigate("/booking-edit-confirm", {
        state: { redirectTo: roomBookingUrl },
      });
      setIsEditMode(false);
      setEditingBookingDocId(null);
      setShowBookingForm(false);
      setRefreshKey((x) => x + 1);
    } catch (err: any) {
      window.alert(err?.message || "เกิดข้อผิดพลาดในการอัพเดท");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!editingBookingDocId) return;

    const ok = window.confirm(
      "ยืนยันลบการจองนี้? การกระทำนี้ไม่สามารถยกเลิกได้"
    );
    if (!ok) return;

    setIsSubmitting(true);
    const rid = genRid();

    try {
      // 1) หา numeric id จาก documentId (locale en)
      const qs = new URLSearchParams({
        "filters[documentId][$eq]": editingBookingDocId,
        "filters[locale][$eq]": LOCALE,
        "fields[0]": "id",
        "pagination[page]": "1",
        "pagination[pageSize]": "1",
      });
      const resList = await fetch(`${apiUrl}/api/bookings?${qs.toString()}`);
      if (!resList.ok) throw new Error("ค้นหา booking ไม่สำเร็จ");

      const listJson = await resList.json();
      const numericId = listJson?.data?.[0]?.id;
      if (!numericId) throw new Error("ไม่พบ booking ที่จะลบ");

      // 2) ลบด้วย numeric id
      const url = `${apiUrl}/api/bookings/${numericId}?rid=${encodeURIComponent(
        rid
      )}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || "ลบการจองไม่สำเร็จ");
      }

      navigate("/booking-delete-confirm", {
        state: { redirectTo: roomBookingUrl },
      });
      setShowBookingForm(false);
      setRefreshKey((x) => x + 1);
    } catch (err: any) {
      window.alert(err?.message || "เกิดข้อผิดพลาดในการลบ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBooked = (date: Date, hour: number) => {
    const day = ymdd(date);
    const cellStart = hour * 60;
    const cellEnd = cellStart + 60;
    return bookings.some((b) => {
      if (b.date !== day) return false;
      const sB = toMinutes(b.start_time);
      const eB = toMinutes(b.end_time);
      return rangesOverlap(cellStart, cellEnd, sB, eB);
    });
  };

  const handleCellClick = (date: Date, hour: number, existing?: Booking) => {
    if (existing) {
      setEditingBookingDocId(existing.documentId);
      setIsViewMode(true);
      setIsEditMode(false);
      setSelectedDate(parseLocalYmd(existing.date));

      const s = toMinutes(existing.start_time);
      const e = toMinutes(existing.end_time);
      const pad = (n: number) => String(n).padStart(2, "0");
      const toHHmm = (min: number) =>
        `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
      const sHH = toHHmm(s);
      const eHH = toHHmm(e);

      setStartTime(sHH);
      setEndTime(eHH);

      const participants = extractParticipants(existing);

      setFormData({
        subject: existing.subject || "",
        description: existing.description || "",
        contact_email: existing.contact_email || "",
        contact_name: existing.contact_name || "",
        contact_phone: existing.contact_phone || "",
        participants,
        date: existing.date,
        start_time: sHH,
        end_time: eHH,
        meeting_room: roomId || "",
      });

      setShowBookingForm(true);
      setTimeout(
        () =>
          document
            .getElementById("bookingForm")
            ?.scrollIntoView({ behavior: "smooth" }),
        100
      );
      return;
    }

    if (isBooked(date, hour)) return;
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const start = `${pad(hour)}:00`;
    const end = `${pad(hour + 1)}:00`;
    setSelectedDate(new Date(d));
    setStartTime(start);
    setEndTime(end);
    setIsViewMode(false);
    setIsEditMode(false);
    setShowBookingForm(true);
    setFormData((prev) => ({
      ...prev,
      date: ymdd(d),
      start_time: start,
      end_time: end,
    }));
    setTimeout(() => {
      const el = document.getElementById("bookingForm");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedDate(null);
    setStartTime("");
    setEndTime("");
    setIsViewMode(false);
    setIsEditMode(false);
    setFormData({
      subject: "",
      description: "",
      contact_email: "",
      contact_name: "",
      contact_phone: "",
      participants: [""],
      date: "",
      start_time: "",
      end_time: "",
      meeting_room: roomId || "",
    });
    setFormError(null);
    setTimeError(null);
  };

  if (loading) {
    return (
      <div className={styles.meetingRoomsContainer}>
        <div className={styles.loading}>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={styles.meetingRoomsContainer}>
        <div className={styles.error}>{fetchError}</div>
      </div>
    );
  }

  const renderBookingTable = () => {
    const { monday, sunday } = weekDates;
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const isTimeOverlapForCell = (
      bookingStart: string,
      bookingEnd: string,
      cellHour: number
    ) => {
      const sB = toMinutes(bookingStart);
      const eB = toMinutes(bookingEnd);
      const cS = cellHour * 60;
      const cE = cS + 60;
      return rangesOverlap(cS, cE, sB, eB);
    };

    const formatDateToString = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    const bookingsByDate = bookings.reduce(
      (acc: Record<string, Booking[]>, b) => {
        (acc[b.date] ||= []).push(b);
        return acc;
      },
      {}
    );

    const isPastDate = (d: Date) => {
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      return d < t;
    };

    const hhmm = (val: string) => {
      const m = toMinutes(val);
      const h = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      return `${h}:${mm}`;
    };

    return (
      <div className={styles.bookingTableContainer}>
        <ParticlesComponent className={styles.particlesBackground} />
        <div className={styles.bookingTable}>
          <div className={styles.weekNavigation}>
            <button onClick={handlePreviousWeek} className={styles.navButton}>
              &lt; สัปดาห์ก่อนหน้า
            </button>
            <span className={styles.weekRange}>
              {thDate(monday)} - {thDate(sunday)}
            </span>
            <button onClick={handleNextWeek} className={styles.navButton}>
              สัปดาห์ถัดไป &gt;
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>เวลา</th>
                {days.map((day, idx) => {
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + idx);
                  return (
                    <th key={day}>
                      {day}
                      <br />
                      {thDate(d)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 13 }, (_, i) => {
                const startHour = 7 + i;
                const endHour = startHour + 1;
                const timeSlot = `${String(startHour).padStart(
                  2,
                  "0"
                )}:00 - ${String(endHour).padStart(2, "0")}:00`;

                return (
                  <tr key={timeSlot}>
                    <td>{timeSlot}</td>
                    {days.map((day, idx) => {
                      const d = new Date(monday);
                      d.setDate(monday.getDate() + idx);
                      const dateStr = formatDateToString(d);
                      const list = bookingsByDate[dateStr] || [];
                      const booking = list.find((b) =>
                        isTimeOverlapForCell(
                          b.start_time,
                          b.end_time,
                          startHour
                        )
                      );
                      const past = isPastDate(d);

                      return (
                        <td
                          key={`${day}-${dateStr}-${startHour}`}
                          className={`${
                            booking ? styles.booked : styles.available
                          } ${
                            !past && !booking
                              ? styles.clickable
                              : booking
                              ? styles.clickableBooked
                              : ""
                          }`}
                          onClick={() => {
                            if (past) return;
                            if (booking) {
                              handleCellClick(d, startHour, booking);
                            } else {
                              handleCellClick(d, startHour);
                            }
                          }}
                          style={{
                            cursor: past ? "not-allowed" : "pointer",
                            opacity: past ? 0.5 : 1,
                          }}
                          title={
                            booking
                              ? `${booking.subject} (${hhmm(
                                  booking.start_time
                                )}-${hhmm(booking.end_time)})`
                              : past
                              ? "ไม่สามารถจองวันในอดีตได้"
                              : "คลิกเพื่อจอง"
                          }
                        >
                          {booking ? (
                            <div className={styles.bookingInfo}>
                              <div>{booking.subject}</div>
                              <div>{booking.description}</div>
                            </div>
                          ) : (
                            <div className={styles.available} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.meetingRoomsContainer}>
      <h1 className={styles.pageTitle}>
        จองห้องประชุม: {roomDetails?.name || "ไม่ระบุชื่อห้อง"}
      </h1>

      {renderBookingTable()}

      {!showBookingForm && (
        <div className={styles.selectTimePrompt}>
          กรุณาเลือกช่วงเวลาที่ต้องการจองจากตารางด้านบน
        </div>
      )}

      {showBookingForm && (
        <div id="bookingForm" className={styles.bookingForm}>
          <div className={styles.formHeader}>
            <h2>
              {isViewMode
                ? "ข้อมูลการจอง"
                : isEditMode
                ? "แก้ไขการจอง"
                : "จองห้องประชุม"}
            </h2>
            <div className={styles.formActions}>
              {isViewMode && (
                <button
                  className={`${styles.btn} ${styles.btnGhost}`}
                  onClick={() => (setIsViewMode(false), setIsEditMode(true))}
                >
                  แก้ไข
                </button>
              )}
              <button className={styles.closeButton} onClick={handleCloseForm}>
                ×
              </button>
            </div>
          </div>

          <form onSubmit={isEditMode ? handleUpdateBooking : handleSubmit}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.formGroup}>
                <label>วันที่จอง</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(d) => !isViewMode && setSelectedDate(d)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="เลือกวันที่"
                  className={styles.datePicker}
                  required
                  disabled={isViewMode}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.timeGroup}`}>
                <label>เวลาที่จอง</label>
                <div className={styles.timeInputs}>
                  <select
                    value={startTime}
                    onChange={handleStartTimeChange}
                    required
                    disabled={isViewMode}
                  >
                    <option value="">เลือกเวลาเริ่มต้น</option>
                    {generateTimeOptions().map((t) => (
                      <option key={`start-${t}`} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className={styles.timeSeparator}>ถึง</span>
                  <select
                    value={endTime}
                    onChange={handleEndTimeChange}
                    required
                    disabled={isViewMode}
                  >
                    <option value="">เลือกเวลาสิ้นสุด</option>
                    {generateTimeOptions().map((t) => (
                      <option
                        key={`end-${t}`}
                        value={t}
                        disabled={!!startTime && t <= startTime}
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                {timeError && <div className={styles.error}>{timeError}</div>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>หัวข้อการประชุม</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="หัวข้อ"
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>รายละเอียด</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="รายละเอียดการประชุม"
                className={styles.detailsInput}
                rows={4}
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>อีเมล์</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="กรอกอีเมล์"
                className={styles.emailInput}
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>ชื่อผู้จอง</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                placeholder="กรอกชื่อ-นามสกุล"
                required
                readOnly={isViewMode}
              />
            </div>

            <div className={styles.formGroup}>
              <label>อีเมล์ผู้เข้าร่วม</label>

              {isViewMode ? (
                formData.participants?.length ? (
                  <div className={styles.participantsList}>
                    <div className={styles.participantsHeader}>
                      <span>รายชื่อผู้เข้าร่วมทั้งหมด</span>
                      <span className={styles.participantsCount}>
                        {formData.participants.length} คน
                      </span>
                    </div>
                    {formData.participants.map((email, idx) => (
                      <div key={idx} className={styles.participantEmail}>
                        {email}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noParticipants}>
                    ไม่มีผู้เข้าร่วมการประชุม
                  </div>
                )
              ) : (
                <>
                  <div className={styles.participantInputs}>
                    {formData.participants.map((email, idx) => (
                      <div key={idx} className={styles.participantRow}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            handleParticipantChange(idx, e.target.value)
                          }
                          placeholder="กรอกอีเมล์"
                          className={styles.emailInput}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnGhost} ${styles.addParticipant}`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        participants: [...prev.participants, ""],
                      }))
                    }
                  >
                    <span className={styles.plusIcon}>＋</span>
                    เพิ่มผู้เข้าร่วม
                  </button>
                </>
              )}
            </div>

            <div style={{ width: "100%", textAlign: "center" }}>
              {formError && <div className={styles.error}>{formError}</div>}

              {isViewMode ? (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={handleDeleteBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "กำลังลบ..." : "ลบการจอง"}
                  </button>
                </div>
              ) : (
                <div style={{ width: "100%", textAlign: "center" }}>
                  {formError && <div className={styles.error}>{formError}</div>}
                  <button
                    type="submit"
                    className={styles.confirmBooking}
                    disabled={isSubmitting || !roomEntryId}
                  >
                    {isSubmitting
                      ? isEditMode
                        ? "กำลังบันทึก..."
                        : "กำลังจอง..."
                      : isEditMode
                      ? "บันทึกการเปลี่ยนแปลง"
                      : "ยืนยันการจอง"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomsBooking;
