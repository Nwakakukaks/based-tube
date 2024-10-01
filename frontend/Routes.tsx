import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import { AssistantPage } from "./pages/assistant/page";
import Layout from "./layout";
import { TemplatePages } from "./pages/dashboard/page";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/modules" element={<TemplatePages />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
