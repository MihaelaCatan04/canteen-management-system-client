import React, { useEffect, useState } from "react";
import MainPageLayout from "../../layouts/MainPage/MainPage";
import TransactionHistoryCardContainer from "../../components/TransactionHistoryPage/TransactionHistoryCardContainer/TransactionHistoryCardContainer";
import { transactionService } from "../../services/TransactionService";

const MONTHS_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
];

const mapApiTransaction = (tx) => {
  const typeMap = {
    refund: "Refund",
    payment: "Payment",
    hold: "Payment", 
    deposit: "Deposit",
  };

  const parseNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const signed = "signed_amount" in tx ? parseNumber(tx.signed_amount) : (parseNumber(tx.amount) * (tx.type === "refund" ? 1 : -1));
  const remaining = parseNumber(tx.remaining_balance);

  const d = tx.created_at ? new Date(tx.created_at) : null;
  const dateStr = d
    ? `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    : "";

  return {
    key: tx.id,
    orderId: tx.order_no ?? "",
    type: typeMap[tx.type] ?? (tx.type ? String(tx.type).charAt(0).toUpperCase() + String(tx.type).slice(1) : ""),
    date: dateStr,
    amount: signed, 
    balance: remaining,
    status: tx.status ? String(tx.status).charAt(0).toUpperCase() + String(tx.status).slice(1) : "",
  };
};

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await transactionService.getTransactions();
        if (!mounted) return;

        const rawList = Array.isArray(data?.results)
          ? data.results
          : [];

        const list = rawList.map(mapApiTransaction);
        setTransactions(list);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        if (!mounted) return;
        setTransactions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MainPageLayout>
      <TransactionHistoryCardContainer transactions={transactions} loading={loading} />
    </MainPageLayout>
  );
};

export default TransactionHistoryPage;
