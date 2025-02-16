export interface PayPalOrderData {
  id: string;
  status: string;
  payer: {
    email_address?: string;
    payer_id?: string;
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
  create_time?: string;
  update_time?: string;
  payment_source?: {
    card?: {
      last_digits: string;
      brand: string;
    };
    paypal?: {
      email_address: string;
    };
  };
}

export interface Payment {
  date: string;
  expiryDays: number;
  title: string;
  slug: string;
  priceIdr: number;
  priceUsd: number;
  thumbnail: string;
  isPublished: boolean;
}
