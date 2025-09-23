export interface ImageFormat {
  url: string; // URL ของรูปภาพในขนาดต่าง ๆ
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number; // ขนาดไฟล์ (KB)
}

export interface MainImage {
  id: number;
  url: string; // URL ของรูปภาพหลัก
  alternativeText: string | null; // ข้อความอธิบายรูปภาพ (อาจเป็น null)
  caption: string | null; // คำบรรยายรูปภาพ (อาจเป็น null)
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  }; // รูปภาพในขนาดต่าง ๆ
  ext: string; // นามสกุลไฟล์
  mime: string; // ประเภท MIME
  size: number; // ขนาดไฟล์ (KB)
  createdAt: string; // วันที่สร้าง
  updatedAt: string; // วันที่อัปเดต
}
export interface NetworkSolution {
  id: number;
  documentId: string;
  subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
  subTitle2: string | null; // คำบรรยายเพิ่มเติม (อาจเป็น null)
  mainImage: MainImage; // URL ของรูปภาพหลัก
  content: NetworkContent[]; // อาร์เรย์ของ NetworkContent
  createdAt: string; // วันที่สร้าง
  updatedAt: string; // วันที่อัปเดต
  publishedAt: string; // วันที่เผยแพร่
}

export interface NetworkContent {
    id: number;
    title: string; // ชื่อของหัวข้อ
    subTitle: string | null; // คำบรรยายย่อย (อาจเป็น null)
    content: string; // เนื้อหา (ข้อความ)
  }