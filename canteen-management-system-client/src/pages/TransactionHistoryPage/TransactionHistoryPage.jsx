import MainPageLayout from "../../layouts/MainPage/MainPage";
import TransactionHistoryCardContainer from "../../components/TransactionHistoryPage/TransactionHistoryCardContainer/TransactionHistoryCardContainer";

const TransactionHistoryPage = () => {
    const transactions = [
    {
      key: "1",
      orderId: "#ORD004",
      type: "Refund",
      date: "Jan 17, 2024",
      amount: -63.0,
      balance: 745.0,
      status: "Cancelled",
    },
    {
      key: "2",
      orderId: "#ORD003",
      type: "Payment",
      date: "Jan 16, 2024",
      amount: -73.5,
      balance: 682.0,
      status: "Completed",
    },
    {
      key: "3",
      orderId: "",
      type: "Deposit",
      date: "Jan 16, 2024",
      amount: 255.5,
      balance: 755.5,
      status: "Completed",
    },
    {
      key: "4",
      orderId: "",
      type: "Deposit",
      date: "Jan 15, 2024",
      amount: 500.0,
      balance: 500.0,
      status: "Completed",
    },
  ];
    return (
        <MainPageLayout>
            <TransactionHistoryCardContainer transactions={transactions} />
        </MainPageLayout>
    );
}
 
export default TransactionHistoryPage;