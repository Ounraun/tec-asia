// src/pages/Rebooking/Rebooking.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Rebooking.module.css";

import type { BookingFlat } from "../../types/booking";
import { getBookingByDocId, updateBooking } from "../../services/strapi";

type FormState = {
  subject: string;
  description: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  participants: string[];
  date: Date | null;
  start: string;
  end: string;
  meeting_roomDocumentId: string;
};

const TIME_STARTS = Array.from(
  { length: 13 },
  (_, i) => `${String(7 + i).padStart(2, "0")}:00`
);
const TIME_ENDS = Array.from(
  { length: 13 },
  (_, i) => `${String(8 + i).padStart(2, "0")}:00`
);

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const Rebooking: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orig, setOrig] = useState<BookingFlat | null>(null);

  const [form, setForm] = useState<FormState>({
    subject: "",
    description: "",
    contact_email: "",
    contact_name: "",
    contact_phone: "",
    participants: [""],
    date: null,
    start: "",
    end: "",
    meeting_roomDocumentId: "",
  });

  useEffect(() => {
    setError(null);
  }, [form]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!docId) throw new Error("Missing documentId");
        setLoading(true);

        const b = await getBookingByDocId(docId);
        if (!alive) return;

        setOrig(b);
        setForm({
          subject: b.subject || "",
          description: b.description || "",
          contact_email: b.contact_email || "",
          contact_name: b.contact_name || "",
          contact_phone: b.contact_phone || "",
          participants: b.participants?.length ? b.participants : [""],
          date: b.date ? new Date(b.date) : null,
          start: (b.start_time || "").substring(0, 5),
          end: (b.end_time || "").substring(0, 5),
          meeting_roomDocumentId: b.meeting_room?.documentId || "",
        });
      } catch (e: any) {
        setError(e?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [docId]);

  const timeError = useMemo(() => {
    if (!form.start || !form.end) return null;
    const [sh, sm] = form.start.split(":").map(Number);
    const [eh, em] = form.end.split(":").map(Number);
    const s = sh * 60 + sm;
    const e = eh * 60 + em;
    if (s < 7 * 60 || e > 20 * 60) return "เวลาต้องอยู่ระหว่าง 07:00–20:00";
    if (s >= e) return "เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด";
    return null;
  }, [form.start, form.end]);

  const emailError = useMemo(() => {
    if (!form.contact_email || !isEmail(form.contact_email))
      return "อีเมลผู้จองไม่ถูกต้อง";
    const filled = form.participants.filter((x) => x.trim() !== "");
    const bad = filled.filter((x) => !isEmail(x));
    if (bad.length) return `อีเมลผู้เข้าร่วมไม่ถูกต้อง: ${bad.join(", ")}`;
    return null;
  }, [form.contact_email, form.participants]);

  const canSave =
    !!form.subject &&
    !!form.description &&
    !!form.contact_email &&
    !!form.contact_name &&
    !!form.date &&
    !!form.start &&
    !!form.end &&
    !timeError &&
    !emailError;

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const onChangeParticipant = (idx: number, val: string) => {
    setForm((p) => {
      const arr = [...p.participants];
      arr[idx] = val;
      return { ...p, participants: arr };
    });
  };

  const onAddParticipant = () =>
    setForm((p) => ({ ...p, participants: [...p.participants, ""] }));

  const onSubmit = async () => {
    if (!docId) return;
    if (!canSave || !form.date) {
      setError(timeError || emailError || "กรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const rid = `fe_${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      await updateBooking(
        docId,
        {
          subject: form.subject.trim(),
          description: form.description.trim(),
          contact_email: form.contact_email.trim(),
          contact_name: form.contact_name.trim(),
          contact_phone: form.contact_phone?.trim() || "",
          date: toYMD(form.date),
          start_time: `${form.start}:00.000`,
          end_time: `${form.end}:00.000`,
          participants: form.participants.filter((e) => e.trim() !== ""),
          meeting_roomDocumentId:
            form.meeting_roomDocumentId || orig?.meeting_room?.documentId || "",
        },
        { requestId: rid }
      );

      navigate("/booking-confirm");
    } catch (e: any) {
      setError(e?.message || "อัปเดตไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.rebookingContainer}>
        <h1 className={styles.rebookingTitle}>Rebooking</h1>
        <div>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className={styles.rebookingContainer}>
      <h1 className={styles.rebookingTitle}>Rebooking</h1>

      <div className={styles.rebookingForm}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.formGroup}>
          <label>หัวข้อ</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setField("subject", e.target.value)}
            placeholder="หัวข้อการประชุม"
          />
        </div>

        <div className={styles.formGroup}>
          <label>รายละเอียด</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="รายละเอียดการประชุม"
            rows={4}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.twoCol}`}>
          <div>
            <label>อีเมลผู้จอง</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => setField("contact_email", e.target.value)}
              placeholder="id / email"
            />
          </div>
          <div>
            <label>ผู้จอง (ชื่อ-นามสกุล)</label>
            <input
              type="text"
              value={form.contact_name}
              onChange={(e) => setField("contact_name", e.target.value)}
              placeholder="ชื่อผู้จอง"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>เบอร์ติดต่อ</label>
          <input
            type="text"
            value={form.contact_phone}
            onChange={(e) => setField("contact_phone", e.target.value)}
            placeholder="เบอร์โทร"
          />
        </div>

        <div className={styles.formGroup}>
          <label>meeting date</label>
          <DatePicker
            selected={form.date}
            onChange={(d) => setField("date", d as Date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="เลือกวันที่"
          />
        </div>

        <div className={`${styles.formGroup} ${styles.timeGroup}`}>
          <div>
            <label>time : start</label>
            <div className={styles.timeInputs}>
              <select
                value={form.start}
                onChange={(e) => setField("start", e.target.value)}
              >
                <option value="">เลือกเวลา</option>
                {TIME_STARTS.map((t) => (
                  <option key={`s-${t}`} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>time : finish</label>
            <div className={styles.timeInputs}>
              <select
                value={form.end}
                onChange={(e) => setField("end", e.target.value)}
              >
                <option value="">เลือกเวลา</option>
                {TIME_ENDS.map((t) => (
                  <option
                    key={`e-${t}`}
                    value={t}
                    disabled={!!form.start && t <= form.start}
                  >
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {timeError && <div className={styles.warn}>{timeError}</div>}
        {emailError && <div className={styles.warn}>{emailError}</div>}

        <div className={styles.additionalEmails}>
          <label className="block mb-2">epm id / email (ผู้เข้าร่วม)</label>
          {form.participants.map((email, idx) => (
            <div className={styles.formGroup} key={idx}>
              <input
                type="email"
                placeholder="id / email"
                value={email}
                onChange={(e) => onChangeParticipant(idx, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost} ${styles.addMore}`}
          onClick={onAddParticipant}
          disabled={saving}
        >
          <span className={styles.plusIcon}>＋</span>
          เพิ่มผู้เข้าร่วม
        </button>

        <button
          className={styles.confirmBooking}
          onClick={onSubmit}
          disabled={!canSave || saving}
        >
          {saving ? "Saving..." : "Confirm booking"}
        </button>
      </div>
    </div>
  );
};

export default Rebooking;
