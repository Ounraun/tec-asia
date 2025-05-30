// src/types/aboutUs.ts

export interface ISOImage {
    id: number;
    alternativeText: string | null;
    caption: string | null;
    createdAt: string;
    updatedAt: string;
    ext: string;
    formats: {
      thumbnail: {
        url: string;
        hash: string;
        ext: string;
        mime: string;
        width: number;
        height: number;
        size: number;
      };
      medium: {
        url: string;
        hash: string;
        ext: string;
        mime: string;
        width: number;
        height: number;
        size: number;
      };
      small: {
        url: string;
        hash: string;
        ext: string;
        mime: string;
        width: number;
        height: number;
        size: number;
      };
    };
    hash: string;
    height: number;
    mime: string;
    name: string;
    previewUrl: string | null;
    provider: string | null;
    provider_metadata: string | null;
    size: number;
    url: string;
    width: number;
  }
  
  export interface Localization {
    id: number;
    ISONumber: string;
    createdAt: string;
    updatedAt: string;
    heroContent: string;
    heroTitle: string;
    locale: string;
  }
  
  export interface AboutUs {
    id: number;
    documentId: string;
    heroTitle: string;
    heroContent: string;
    ISONumber: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    ISOImage: ISOImage[];
    localizations: Localization[];
  }
  