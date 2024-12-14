import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Registration/RegisterForm";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import DepositMoney from "./components/Deposit/DepositMoney";
import History from "./components/History/TransactionHistory";
import DetailTransaction from "./components/History/DetailTransactions/DetailTransaction";
import SendMoney from "./components/SendMoney/SendMoney";
import Profile from "./components/Profile/Profile";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route path="/user" element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="deposit" element={<DepositMoney />} />
          <Route path="history" element={<History />} />
          <Route
            path="history/:transactionId"
            element={<DetailTransaction />}
          />
          <Route path="send" element={<SendMoney />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
