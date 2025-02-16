import { useState, useEffect } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { Home, HomeData } from "@/utils/section/payment/schema/interface";

export const useFetchPayments = () => {
  const [payments, setPayments] = useState<Home>({
    status: 200,
    message: "Loading...",
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const paymentsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string
    );

    // Only fetch published payments
    const q = query(paymentsRef, where("isPublished", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const dataArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            priceIdr: data.priceIdr,
            priceUsd: data.priceUsd,
            thumbnail: data.thumbnail,
            expiryDays: data.expiryDays,
            date: data.date,
            slug: data.slug,
            isPublished: data.isPublished,
          };
        });

        setPayments({
          status: 200,
          message: "Data fetched successfully",
          data: dataArray as HomeData[],
        });
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching payments:", error);
        setPayments({
          status: 500,
          message: "Error fetching payments",
          data: [],
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { payments, loading };
};
