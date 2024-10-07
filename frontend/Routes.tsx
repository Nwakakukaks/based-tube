import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AssistantPage } from "./pages/assistant/page";
import Layout from "./layout";
import { DashboardPage } from "./pages/dashboard/page";
import { PaymentPage } from "./pages/payment/page";
import { RedirectToPaymentPage } from "./pages/redirectPayment/page";
import { TransactionPage } from "./pages/transactions/page";
import { StreamPage } from "./pages/streams/page";
import { LivePage } from "./pages/live/page";
import { RedirectToClaimPage } from "./pages/redirectClaim/page";
import { ClaimPage } from "./pages/claim/page";

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
          <Route path="/claim" element={<ClaimPage />} />
          <Route path="/s/:shortCode" element={<RedirectToPaymentPage />} />
          <Route path="/c/:shortCode" element={<RedirectToClaimPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
