import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      payerId,
      payerEmail,
      productTitle,
      productSlug,
      amountUSD,
      amountIDR,
      status,
      paymentMethod,
      paymentDetails,
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_URL as string;
    const successUrl = `${baseUrl}/payment/success/${orderId}`;
    const failureUrl = `${baseUrl}/payment/failed/${orderId}`;

    const transactionData = {
      orderId,
      payerId,
      payerEmail,
      productTitle,
      productSlug,
      amountUSD,
      amountIDR,
      status,
      paymentMethod,
      createdAt: serverTimestamp(),
      paymentDetails,
      ...(status === "COMPLETED" ? { successUrl } : { failureUrl }),
    };

    const docRef = await addDoc(
      collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTIONS as string
      ),
      transactionData
    );

    return NextResponse.json({
      success: true,
      message: "Transaction saved successfully",
      data: {
        transactionId: docRef.id,
        redirectUrl: status === "COMPLETED" ? successUrl : failureUrl,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
