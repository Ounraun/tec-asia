export interface Transformation {
    id: number;
    documentId: string;
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: TransformationContent[]; // อาร์เรย์ของ TransformationContent
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
export  interface TransformationContent {
    id: number;
    title: string; // ชื่อของ Transformation Item
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: string | null; // เนื้อหา (อาจเป็น null)
  }