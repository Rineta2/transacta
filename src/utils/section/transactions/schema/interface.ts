export interface Transactions {
  status: number;
  message: string;
  data: TransactionsData[];
}

export interface TransactionsData {
  id: string;
  amountUSD: string;
  createdAt: string;
  payerEmail: string;
  status: string;
  amountIDR: string;
  orderId: string;
  payerId: string;
  paymentMethod: string;
  productSlug: string;
  productTitle: string;
}
