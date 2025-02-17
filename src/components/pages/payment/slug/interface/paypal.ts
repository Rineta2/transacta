// PayPal Order Types
export interface PayPalOrderRequest {
  amount: string;
  orderId: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// PayPal Capture Types
export interface PayPalCaptureRequest {
  orderId: string;
  paymentId: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: "COMPLETED" | "FAILED";
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

// PayPal Button Types
export interface CreateOrderData {
  orderID: string;
}

export interface OnApproveData {
  orderID: string;
  payerID: string;
  subscriptionID?: string;
}

export interface PayPalButtonsComponentProps {
  createOrder: () => Promise<string>;
  onApprove: (data: OnApproveData) => Promise<void>;
}
