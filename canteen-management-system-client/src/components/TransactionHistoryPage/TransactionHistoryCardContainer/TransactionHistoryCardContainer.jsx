import { Card } from "antd";
import "./TransactionHistoryCardContainer.css";
import { Table, Tag, Typography } from "antd";
const { Title } = Typography;

const TransactionHistoryCardContainer = ({ transactions }) => {
  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (text) => (
        <span className="poppins-medium2 order-id-text">{text}</span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (type) => {
        let style = {};
        if (type === "Refund") {
          style = {
            background: "#CEE3FF",
            color: "#1E42B1",
            border: "1px solid #E5E7EB",
          };
        } else if (type === "Payment") {
          style = {
            background: "#FFD8D8",
            color: "#C34433",
            border: "1px solid #E5E7EB",
          };
        } else if (type === "Deposit") {
          style = {
            background: "#D9F2D9",
            color: "#399121",
            border: "1px solid #E5E7EB",
          };
        }
        return (
          <span
            style={{
              ...style,
            }}
            className="poppins-medium type-text"
          >
            {type}
          </span>
        );
      },
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (date) => (
        <span className="poppins-medium date-text">{date}</span>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount, record) => {
        const typeColorMap = {
          Refund: "#1E42B1",
          Payment: "#C34433",
          Deposit: "#399121",
        };
        const color = typeColorMap[record?.type] ?? "#111827";
        const formatted = `$${Math.abs(amount).toFixed(2)}`;
        return (
          <span
            style={{ color, lineHeight: "1.5rem", fontSize: "1rem" }}
            className="poppins-medium2"
          >
            {formatted}
          </span>
        );
      },
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      align: "center",
      render: (balance) => (
        <span className="poppins-medium2 balance-text">
          ${balance.toFixed(2)}
        </span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let style = {};
        if (status === "Completed") {
          style = {
            color: "#399121",
            border: "2px solid #D9F2D9",
            borderRadius: "1rem",
            padding: "0 2rem",
          };
        } else if (status === "Cancelled") {
          style = {
            color: "#C34433",
            border: "2px solid #FFD8D8",
            borderRadius: "1rem",
            padding: "0 2rem",
          };
        }
        return (
          <span
            style={{
              ...style,
            }}
            className="poppins-medium status-text"
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <Card
      className="transaction-history-card"
      style={{
        borderRadius: "1rem",
        border: "1px solid #E5E7EB",
        background: "#FFF",
        padding: "1rem 2rem",
        gap: "0.5rem",
      }}
    >
      <div className="card-header">
        <Title
          level={4}
          style={{
            margin: 0,
            color: "#111827",
            alignContent: "center",
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          }}
          className="poppins-medium2"
        >
          Transaction History
        </Title>
      </div>
      <Table
        columns={columns}
        dataSource={transactions}
        pagination={false}
        bordered={false}
        style={{
          borderRadius: "12px",
          overflow: "hidden",
        }}
        rowClassName={() => "custom-row"}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                className="poppins-bold"
                style={{
                  background: "#EFF6FF",
                  color: "#1E42B1",
                  textAlign: "center",
                  padding: "12px",
                }}
              />
            ),
          },
        }}
      />
    </Card>
  );
};

export default TransactionHistoryCardContainer;
