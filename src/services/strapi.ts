// src/services/strapi.ts
import i18n from 'i18next';
import type { AboutUs } from '../types/aboutUs';
import type { Feature } from '../types/centralizeManagement';
import type { Facility } from '../types/dataCenter';
import type { Service } from '../types/dataManagement';
import type { Transformation } from '../types/digitalTransformation';
import type { MultimediaService } from '../types/multimedia';
import type { NetworkSolution } from '../types/networkSolution';
import type { CompanyInfo } from '../types/contact';
import type { BlogPost } from "../types/blogPost";

const API_URL = import.meta.env.VITE_API_URL;

export async function callStrapi<T>(
  endpoint: string,
  params?: Record<string,string|number>
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
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Strapi ${endpoint} error ${res.status}`);
  }
  return (await res.json()) as T;
}

// สร้างฟังก์ชันดึง AboutUs แบบ typed
export function getAboutUs() {
  return callStrapi<{ data: AboutUs }>('/api/about-us', { populate: '*' });
}

export function getCentralizeManagement() {
  return callStrapi<{ data: Feature}>(
    '/api/centralize-management',
    { populate: '*' }
  );
}

export function getDataCenter() {
  return callStrapi<{ data: Facility}>(
    '/api/data-center',
    { populate: '*' }
  );
}

export function getDataManagement() {
  return callStrapi<{ data: Service}>(
    '/api/data-management',
    { populate: '*' }
  );
}

export function getDataTransformation() {
  return callStrapi<{ data: Transformation}>(
    '/api/digital-transformation',
    { populate: '*' }
  );
}

export function getMultimedia() {
  return callStrapi<{ data: MultimediaService}>(
    '/api/multimedia-solution',
    { populate: '*' }
  );
}

export function getNetworkSolution() {
  return callStrapi<{ data: NetworkSolution}>(
    '/api/network-solution',
    { populate: '*' }
  );
}

export function getCompanyInfo() {
  return callStrapi<{ data: CompanyInfo}>('/api/company-information', { populate: '*' });
}

export function getBlogPosts() {
  return callStrapi<{ data: BlogPost[] }>("/api/blog-posts", { populate: "*" });
}

export async function getCompanyVideoUrl(): Promise<string | null> {
  const res = await callStrapi<{ data: any }>(
    '/api/company-information',
    { populate: '*' }
  );
  console.log("Company video URL response:", res?.data?.videoknowledge?.url ?? null);
  return res?.data?.videoknowledge?.url ?? null;
}

export function getLatestPostByCategory(category: string) {
  // callStrapi รองรับ params อยู่แล้ว
  return callStrapi<{ data: BlogPost[] }>(
    "/api/blog-posts",
    {
      "filters[category][name][$eq]": category,
      sort: "updatedAt:desc",
      "pagination[pageSize]": 1,
      populate: "*",
    }
  );
}