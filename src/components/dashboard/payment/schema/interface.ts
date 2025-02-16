export interface SystemConfig {
  lastExpiryUpdate: string;
  id?: string;
}

export interface Payment {
  id: string;
  title: string;
  priceIdr: number;
  priceUsd: number;
  isPublished: boolean;
  date: string;
  slug: string;
  expiryDays: number;
  createdAt: string;
  author: {
    displayName: string;
    role: string;
    photoURL?: string;
  };
  thumbnail: string;
  description?: string;
}
