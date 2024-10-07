import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AssistantPage } from "./pages/assistant/page";
import Layout from "./layout";
import { DashboardPage } from "./pages/dashboard/page";
import { PaymentPage } from "./pages/payment/page";
import { PopupPage } from "./pages/popup/page";
import { TransactionPage } from "./pages/transactions/page";
import { StreamPage } from "./pages/streams/page";
import { LivePage } from "./pages/live/page";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/streams" element={<StreamPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/s/:shortCode" element={<PopupPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
