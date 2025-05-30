export interface Service {
    id: number;
    documentId: string;
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: ServiceContent[]; // อาร์เรย์ของ ServiceContent
    serviceContent1: string;
    serviceContent2: string;
    subTitle1: string;
    subTitle2: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
export  interface ServiceContent {
    id: number;
    title: string;
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: string | null; // เนื้อหา (อาจเป็น null)
  }