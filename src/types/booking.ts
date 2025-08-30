// src/types/booking.ts

export type Locale = 'en' | 'th';

/** โครงสร้าง generic ของ Strapi ที่มักเจอ */
export type StrapiItem<T> = { id: number; documentId?: string; attributes: T };
export type StrapiResponse<T> = { data: StrapiItem<T> };
export type StrapiCollection<T> = { data: Array<StrapiItem<T>> };

/** component ที่เก็บอีเมลผู้เข้าร่วม */
export interface ParticipantEmail {
  email: string;
}

export interface MeetingRoomAttrs {
  name: string;
  locale?: Locale;
  documentId?: string;
}

/** booking attributes จาก Strapi */
export interface BookingAttrs {
  locale: Locale;

  // ฟิลด์ธุรกิจ
  subject: string;
  description: string;
  contact_email: string;
  contact_name: string;
  contact_phone?: string | null;

  // วันที่/เวลา (เก็บเป็น string)
  date: string;            // 'YYYY-MM-DD'
  start_time: string;      // 'HH:mm[:ss[.SSS]]'
  end_time: string;        // same

  // relation + component
  meeting_room?: {
    data: StrapiItem<MeetingRoomAttrs> | null;
  } | null;

  email?: {
    data: Array<StrapiItem<ParticipantEmail>>;
  } | null;

  // เมต้า
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  documentId?: string;
}

/** แบบที่แผ่ให้ใช้ในแอปง่ายขึ้น */
export interface BookingFlat {
  id: number;
  documentId: string;
  locale: Locale;

  subject: string;
  description: string;
  contact_email: string;
  contact_name: string;
  contact_phone?: string;

  date: string;
  start_time: string;
  end_time: string;

  meeting_room?: {
    name: string;
    documentId?: string;
  } | null;

  participants: string[];
}

/** helper: แปลงจาก item ของ Strapi ให้เป็น BookingFlat */
export function normalizeBooking(item: StrapiItem<BookingAttrs>): BookingFlat {
  const a = item.attributes;
  const mr = a.meeting_room?.data;

  return {
    id: item.id,
    documentId: item.documentId || a.documentId || '',
    locale: a.locale,

    subject: a.subject ?? '',
    description: a.description ?? '',
    contact_email: a.contact_email ?? '',
    contact_name: a.contact_name ?? '',
    contact_phone: a.contact_phone ?? undefined,

    date: a.date ?? '',
    start_time: (a.start_time ?? '').substring(0,5),
    end_time: (a.end_time ?? '').substring(0,5),

    meeting_room: mr
      ? { name: mr.attributes?.name ?? '', documentId: mr.documentId }
      : null,

    participants: (a.email?.data || []).map((p) => p.attributes.email).filter(Boolean),
  };
}
