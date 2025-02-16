import { Metadata } from "next";

import { db } from "@/utils/firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

export interface Payment {
  title: string;
  slug: string;
  price: number;
  date: string;
  isPublished: boolean;
}

async function getPayment(slug: string): Promise<Payment | null> {
  try {
    const paymentsRef = collection(
      db,

      process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string
    );
    const q = query(paymentsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const paymentData = querySnapshot.docs[0].data() as Payment;
    return paymentData;
  } catch (error) {
    console.error("Error fetching payment:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const payment = await getPayment(params.slug);

  if (!payment) {
    return {
      title: "Payment Not Found",
      description: "The requested payment could not be found.",
    };
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(payment.price / 100);

  return {
    title: payment.title,
    description: `${payment.title} - Available for ${formattedPrice}`,
    openGraph: {
      title: payment.title,
      description: `${payment.title} - Available for ${formattedPrice}`,
      type: "website",
    },
  };
}
