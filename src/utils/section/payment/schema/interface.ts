export interface Home {
  status: number;
  message: string;
  data: HomeData[];
}

export interface HomeData {
  id: string;
  date: string;
  isPublished: boolean;
  priceIdr: number;
  priceUsd: number;
  expiryDays: number;
  slug: string;
  title: string;
  thumbnail: string;
}
