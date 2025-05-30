export interface Feature {
    id: number;
    documentId: string;
    mainSubTitle: string; // mainSubTitle เป็นสตริง
    content: ContentItem[]; // content เป็นอาร์เรย์ของ ContentItem
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }

export  interface ContentItem {
    id: number;
    title: string;
    subtitle: string | null; // subtitle อาจเป็น null ได้
    content: string;
  }
