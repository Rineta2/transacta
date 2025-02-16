export interface PayPalName {
  given_name?: string;
  surname?: string;
  full_name?: string;
}

export interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_1?: string;
  admin_area_2?: string;
  country_code: string;
  postal_code?: string;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalCapture {
  amount: PayPalAmount;
  create_time: string;
  final_capture: boolean;
  id: string;
  seller_protection?: {
    status: string;
    dispute_categories: string[];
  };
  status: string;
  update_time: string;
}

export interface PayPalPurchaseUnit {
  amount: PayPalAmount;
  description?: string;
  payee?: {
    email_address: string;
    merchant_id: string;
  };
  payments?: {
    captures: PayPalCapture[];
  };
  reference_id?: string;
  shipping?: {
    address: PayPalAddress;
    name: {
      full_name: string;
    };
  };
  soft_descriptor?: string;
}

export interface PayPalDetails {
  id: string;
  intent: string;
  create_time: string;
  update_time: string;
  status: string;
  payer: {
    name?: PayPalName;
    email_address?: string;
    payer_id: string;
    address?: {
      country_code: string;
    };
  };
  purchase_units: PayPalPurchaseUnit[];
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface Transaction {
  orderId: string;
  status: "COMPLETED" | "cancelled";
  amountUSD: string;
  amountIDR: number;
  createdAt: Date;
  paymentMethod: string;
  productTitle: string;
  productSlug: string;
  // Optional fields that may only exist in completed transactions
  payerEmail?: string;
  payerId?: string;
  paymentDetails?: PayPalDetails;
  successUrl?: string;
  cancelUrl?: string;
}
