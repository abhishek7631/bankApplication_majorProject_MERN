import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../Dashboard/Dashboard.css";
import { AuthContext } from "../../context/authContext";

// Transaction Item Component (Move above Dashboard)
const TransactionItem = ({ type, amount, date, userName, status }) => {
  const statusColors = {
    Success: "text-success",
    Failed: "text-danger",
    Waiting: "text-warning",
  };

  return (
    <Card className="transaction-item mb-2">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Text className="fw-bold">{type}</Card.Text>
          <Card.Text className="text-muted">
            {date} - {userName}
          </Card.Text>
        </div>
        <div className="text-end">
          <Card.Text className="fw-bold">₹{amount}</Card.Text>
          <Card.Text className={statusColors[status] || "text-secondary"}>
            {status}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch balance
  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4001/api/user/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error.message);
      }
    };
    getData();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:4001/api/transactions/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <Container className="my-4">
      {/* Balance Section */}
      <Card className="balance-card text-white mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h4>Welcome</h4>
              <h2>{userName}</h2>
            </Col>
            <Col className="text-end">
              <h6 className="text-white-50">Available Balance</h6>
              <h1 className="balance-amount">
                ₹{Number(balance).toLocaleString()}
              </h1>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Recent Transactions</h5>
          <Button variant="link" onClick={() => navigate("/user/history")}>
            See All
          </Button>
        </div>

        {/* Fallback if no transactions */}
        {transactions.length === 0 && (
          <p className="text-muted">No recent transactions available.</p>
        )}

        {/* Transaction List */}
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            type={transaction.type}
            amount={transaction.amount}
            date={transaction.date}
            userName={transaction.userName || "N/A"}
            status={transaction.status}
          />
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;
