import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AssistantPage } from "./pages/assistant/page";
import Layout from "./layout";
import { DashboardPage } from "./pages/dashboard/page";
import { PaymentPage } from "./pages/payment/page";
import { PopupPage } from "./pages/popup/page";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/popup" element={<PopupPage />} />
          <Route path="/s/:shortCode" element={<PopupPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
