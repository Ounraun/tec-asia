export interface CompanyInfo {
    id: number;
    documentId: string;
    name: string;
    phone: string;
    location: string;
    address: string;
    email: string;
    facebook: string | null;
    videoknowledge?: {
      url?: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }