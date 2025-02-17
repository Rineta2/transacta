export interface PayPalOrderData {
  id: string;
  status: string;
  payer: {
    payer_id: string;
    email_address: string;
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
    reference_id?: string;
  }>;
  payment_source?: {
    card?: {
      last_digits?: string;
      brand?: string;
      name?: string;
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
