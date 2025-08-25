// src/types/i18n.ts
export type Locale = 'en' | 'th'; // เพิ่มได้ตามที่ตั้งค่าใน Strapi

// โครงสร้าง Category (ถ้ามี)
export interface Category {
  id: number;
  name: string;
  // ถ้า Category เองก็ localized
  locale?: Locale;
}

// โครงสร้างของ BlogPost พร้อมฟิลด์ i18n
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  show_main: boolean;
  gallery_image: any | null;
  mainImage:
    | {
        id: number;
        documentId: string;
        name: string;
        alternativeText: string | null;
        caption: string | null;
        url: string;
      }
    | null;
  category: Category;
  locale: Locale;               // ฟิลด์ locale จาก Strapi
  localizations?: {             // ถ้าอยากดึงทุกภาษามา
    data: BlogPost[];
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId?: string | number;
}