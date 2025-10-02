// src/services/strapi.ts
import i18n from "i18next";
import type { AboutUs } from "../types/aboutUs";
import type { Feature } from "../types/centralizeManagement";
import type { Facility } from "../types/dataCenter";
import type { Service } from "../types/dataManagement";
import type { Transformation } from "../types/digitalTransformation";
import type { MultimediaService } from "../types/multimedia";
import type { NetworkSolution } from "../types/networkSecurity";
import type { CompanyInfo } from "../types/contact";
import type { BlogPost, Category } from "../types/blogPost";
import {
  StrapiCollection,
  StrapiResponse,
  BookingAttrs,
  BookingFlat,
  normalizeBooking,
} from "../types/booking";

const API_URL = import.meta.env.VITE_API_URL;
const FORCE_LOCALE = "en";
const IS_DEV = import.meta.env.DEV;

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export async function callStrapi<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  // เริ่มต้น queryString ด้วย locale
  const qs = new URLSearchParams({ locale: i18n.language });

  // รวม params อื่น ๆ
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      qs.append(key, String(value));
    });
  }

  const url = `${API_URL}${endpoint}?${qs.toString()}`;
  if (IS_DEV) {
    console.debug("[Strapi] request", { endpoint, language: i18n.language, params, url });
  }
  
  const res = await fetch(url);
  if (IS_DEV) {
    console.debug("[Strapi] response", { endpoint, status: res.status, statusText: res.statusText });
  }
  
  if (!res.ok) {
    console.error(`Strapi ${endpoint} error ${res.status}`);
    throw new Error(`Strapi ${endpoint} error ${res.status}`);
  }
  
  const data = (await res.json()) as T;
  if (IS_DEV) {
    console.debug("[Strapi] data", data);
  }
  return data;
}

export function getAboutUs() {
  return callStrapi<{ data: AboutUs }>("/api/about-us", { populate: "*" });
}

export function getCentralizeManagement() {
  return callStrapi<{ data: Feature }>("/api/centralize-management", {
    populate: "*",
  });
}

export function getDataCenter() {
  return callStrapi<{ data: Facility }>("/api/data-center", { populate: "*" });
}

export function getDataManagement() {
  return callStrapi<{ data: Service }>("/api/data-management", {
    populate: "*",
  });
}

export function getDataTransformation() {
  return callStrapi<{ data: Transformation }>("/api/digital-transformation", {
    populate: "*",
  });
}

export function getMultimedia() {
  return callStrapi<{ data: MultimediaService }>("/api/multimedia-solution", {
    populate: "*",
  });
}

export function getNetworkSolution() {
  return callStrapi<{ data: NetworkSolution }>("/api/network-and-security", {
    populate: "*",
  });
}

export function getCompanyInfo() {
  return callStrapi<{ data: CompanyInfo }>("/api/company-information", {
    populate: "*",
  });
}

export function getBlogPosts() {
  return callStrapi<{ data: BlogPost[] }>("/api/blog-posts", { populate: "*" });
}

export function getBlogPostsByCategory(category: string) {
  return callStrapi<{ data: BlogPost[] }>("/api/blog-posts", {
    "filters[category][name][$eq]": category,
    populate: "*",
  });
}

export function getCategoryByName(name: string) {
  return callStrapi<{ data: Category[] }>("/api/categories", {
    "filters[name][$eq]": name,
  });
}

export async function getCompanyVideoUrl(): Promise<string | null> {
  const res = await callStrapi<{ data: CompanyInfo }>("/api/company-information", {
    populate: "*",
  });
  return res?.data?.videoknowledge?.url ?? null;
}

export function getLatestPostByCategory(category: string) {
  // callStrapi รองรับ params อยู่แล้ว
  return callStrapi<{ data: BlogPost[] }>("/api/blog-posts", {
    "filters[category][name][$eq]": category,
    sort: "updatedAt:desc",
    "pagination[pageSize]": 1,
    populate: "*",
  });
}

export const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(
  /\/$/,
  ""
);

export function getStrapiImageUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url; // ได้ลิงก์เต็มอยู่แล้ว
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function getBookingsByWeek(
  roomDocumentId: string,
  monday: Date,
  sunday: Date
): Promise<BookingFlat[]> {
  const start = toYMD(monday);
  const end = toYMD(sunday);
  const encodedRoomId = roomDocumentId ? encodeURIComponent(roomDocumentId) : "";

  const url =
    `${API_URL}/api/bookings` +
    `?locale=${FORCE_LOCALE}` +
    `&filters[date][$gte]=${start}` +
    `&filters[date][$lte]=${end}` +
    (roomDocumentId
      ? `&filters[meeting_room][documentId][$eq]=${encodedRoomId}`
      : "") +
    `&populate=*`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  const json = (await res.json()) as StrapiCollection<BookingAttrs>;
  return (json.data || []).map(normalizeBooking);
}

export type CreateBookingPayload = {
  subject: string;
  description: string;
  contact_email: string;
  contact_name: string;
  contact_phone?: string;
  date: string; // 'YYYY-MM-DD'
  start_time: string; // 'HH:mm:ss.SSS'
  end_time: string; // ''
  participants: string[];
  meeting_roomDocumentId: string;
};

export async function createBooking(
  p: CreateBookingPayload
): Promise<BookingFlat> {
  const rid = `fe_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const url = `${API_URL}/api/bookings?locale=${FORCE_LOCALE}&rid=${encodeURIComponent(
    rid
  )}`;
  const body = {
    data: {
      locale: FORCE_LOCALE,
      subject: p.subject,
      description: p.description,
      contact_email: p.contact_email,
      contact_name: p.contact_name,
      contact_phone: p.contact_phone ?? "",
      date: p.date,
      start_time: p.start_time,
      end_time: p.end_time,
      meeting_room: { connect: { documentId: p.meeting_roomDocumentId } },
      email: p.participants.map((e) => ({ email: e })),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || "Create booking failed");
  }
  const json = (await res.json()) as StrapiResponse<BookingAttrs>;
  return normalizeBooking(json.data);
}

export async function updateBooking(
  docId: string,
  payload: {
    subject: string;
    description: string;
    contact_email: string;
    contact_name: string;
    contact_phone?: string;
    date: string;
    start_time: string;
    end_time: string;
    participants?: string[];
    meeting_roomDocumentId?: string;
  },
  opts?: { requestId?: string }
) {
  const rid =
    opts?.requestId ||
    `fe_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const body = {
    data: {
      locale: "en",
      subject: payload.subject,
      description: payload.description,
      contact_email: payload.contact_email,
      contact_name: payload.contact_name,
      contact_phone: payload.contact_phone || "",
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      meeting_room: payload.meeting_roomDocumentId
        ? { connect: { documentId: payload.meeting_roomDocumentId } }
        : undefined,
      email: (payload.participants || []).map((e) => ({ email: e })),
    },
  };
  const url = `${API_URL}/api/bookings/${docId}?locale=${FORCE_LOCALE}&rid=${encodeURIComponent(
    rid
  )}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "การอัพเดทไม่สำเร็จ");
  }
}

export async function getBookingByDocId(
  documentId: string
): Promise<BookingFlat> {
  const url = `${API_URL}/api/bookings/${documentId}?locale=${FORCE_LOCALE}&populate=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch booking");
  const json = (await res.json()) as StrapiResponse<BookingAttrs>;
  return normalizeBooking(json.data);
}
