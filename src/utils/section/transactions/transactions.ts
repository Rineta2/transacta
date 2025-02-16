import { useState, useEffect } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import {
  Transactions,
  TransactionsData,
} from "@/utils/section/transactions/schema/interface";

export const useFetchTransactions = () => {
  const [transactions, setTransactions] = useState<Transactions>({
    status: 200,
    message: "Loading...",
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const paymentsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTIONS as string
    );

    // Only fetch published payments
    const q = query(paymentsRef, where("status", "==", "COMPLETED"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const dataArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore timestamp to readable date string
          const createdAtDate = data.createdAt.toDate();
          const formattedDate = createdAtDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: doc.id,
            amountUSD: data.amountUSD,
            amountIDR: data.amountIDR,
            createdAt: formattedDate,
            orderId: data.orderId,
            payerEmail: data.payerEmail,
            payerId: data.payerId,
            paymentMethod: data.paymentMethod,
            productSlug: data.productSlug,
            productTitle: data.productTitle,
            status: data.status,
          };
        });

        setTransactions({
          status: 200,
          message: "Data fetched successfully",
          data: dataArray as TransactionsData[],
        });
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setTransactions({
          status: 500,
          message: "Error fetching transactions",
          data: [],
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { transactions, loading };
};
