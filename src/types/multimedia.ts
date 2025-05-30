export interface MultimediaService {
    id: number;
    documentId: string;
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: ServiceContent[]; // อาร์เรย์ของ ServiceContent
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
export  interface ServiceContent {
    id: number;
    title: string; // ชื่อของบริการ
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: string; // เนื้อหา
  }