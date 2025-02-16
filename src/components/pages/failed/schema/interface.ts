export interface TransactionData {
  orderId?: string;
  productTitle: string;
  amountIDR: number;
  status: string;
  createdAt: {
    toDate: () => Date;
  };
}
