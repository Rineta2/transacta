import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

// Definisikan tipe untuk PayPal webhook event
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status: string;
    amount: {
      value: string;
      currency_code: string;
    };
  };
}

const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

const WEBHOOK_ID = "4NW76321NM562583F";

const paypalAxios = axios.create({
  baseURL: PAYPAL_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`,
    "PayPal-Auth-Algo": "SHA256withRSA",
    "PayPal-Cert-Url":
      "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-360caa42-fca2a594-1d93a270",
    "PayPal-Transmission-Id": WEBHOOK_ID,
  },
});

// Tambahkan GET handler
export async function GET() {
  return NextResponse.json(
    {
      message: "PayPal webhook endpoint is working",
      webhookId: WEBHOOK_ID,
      mode: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? "live" : "sandbox",
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const headersList = new Headers(req.headers);

    // Verifikasi webhook headers
    const webhookHeaders = {
      signature: headersList.get("paypal-transmission-sig") || "",
      certUrl: headersList.get("paypal-cert-url") || "",
      transmissionId: headersList.get("paypal-transmission-id") || "",
      transmissionTime: headersList.get("paypal-transmission-time") || "",
      webhookId: WEBHOOK_ID,
    };

    // Validasi headers dan webhook ID
    if (
      !webhookHeaders.signature ||
      webhookHeaders.transmissionId !== WEBHOOK_ID
    ) {
      console.error("Invalid webhook headers or ID mismatch");
      return NextResponse.json(
        { error: "Invalid webhook configuration" },
        { status: 400 }
      );
    }

    // Baca data webhook
    const event: PayPalWebhookEvent = await req.json();
    console.log("Received webhook event:", event.event_type);

    // Verifikasi order dengan PayPal API
    try {
      const { data: orderDetails } = await paypalAxios.get(
        `/v2/checkout/orders/${event.resource.id}`
      );

      console.log("Order verified:", orderDetails.status);

      if (orderDetails.status !== event.resource.status) {
        throw new Error("Order status mismatch");
      }
    } catch (error) {
      console.error("PayPal API Error:", error);
      return NextResponse.json(
        { error: "Failed to verify order with PayPal" },
        { status: 400 }
      );
    }

    // Handle berbagai tipe event
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentSuccess(event);
        console.log("Payment success handled");
        break;

      case "PAYMENT.CAPTURE.DENIED":
        await handlePaymentDenied(event);
        console.log("Payment denial handled");
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        await handlePaymentRefunded(event);
        console.log("Payment refund handled");
        break;

      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return NextResponse.json({
      status: "success",
      event: event.event_type,
      orderId: event.resource.id,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(event: PayPalWebhookEvent) {
  const { resource } = event;
  const orderId = resource.id;

  try {
    // Update payment status di Firebase
    const paymentRef = doc(db, "payments", orderId);
    await updateDoc(paymentRef, {
      status: "completed",
      paidAmount: parseFloat(resource.amount.value),
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Tambahkan ke collection transactions untuk history
    const transactionRef = doc(db, "transactions", orderId);
    await setDoc(transactionRef, {
      orderId,
      status: "completed",
      amount: parseFloat(resource.amount.value),
      currency: resource.amount.currency_code,
      processedAt: serverTimestamp(),
      paymentMethod: "paypal",
    });

    // Kirim notifikasi ke PayPal untuk konfirmasi
    try {
      await paypalAxios.post(`/v2/checkout/orders/${orderId}/capture`);
    } catch (error) {
      console.error("Failed to capture payment:", error);
    }

    // Log untuk monitoring
    console.log(`Payment successful for order ${orderId}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}

async function handlePaymentDenied(event: PayPalWebhookEvent) {
  const { resource } = event;
  const orderId = resource.id;

  try {
    const paymentRef = doc(db, "payments", orderId);
    await updateDoc(paymentRef, {
      status: "failed",
      updatedAt: serverTimestamp(),
      errorMessage: "Payment was denied by PayPal",
    });

    // Notify PayPal about acknowledgment
    try {
      await paypalAxios.post(`/v2/checkout/orders/${orderId}/deny`);
    } catch (error) {
      console.error("Failed to acknowledge denial:", error);
    }

    console.log(`Payment denied for order ${orderId}`);
  } catch (error) {
    console.error("Error handling payment denied:", error);
    throw error;
  }
}

async function handlePaymentRefunded(event: PayPalWebhookEvent) {
  const { resource } = event;
  const orderId = resource.id;

  try {
    // Update payment status
    const paymentRef = doc(db, "payments", orderId);
    await updateDoc(paymentRef, {
      status: "refunded",
      refundedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add refund record
    const refundRef = doc(db, "refunds", orderId);
    await setDoc(refundRef, {
      orderId,
      amount: parseFloat(resource.amount.value),
      processedAt: serverTimestamp(),
      status: "completed",
    });

    console.log(`Payment refunded for order ${orderId}`);
  } catch (error) {
    console.error("Error handling payment refunded:", error);
    throw error;
  }
}
