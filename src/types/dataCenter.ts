export interface Facility {
    id: number;
    documentId: string;
    subTitle: string | null; // subTitle อาจเป็น null ได้
    content: FacilityContent[]; // content เป็นอาร์เรย์ของ FacilityContent
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export  interface FacilityContent {
    id: number;
    title: string;
    subTitle: string | null; // subTitle อาจเป็น null ได้
    content: string;
  }