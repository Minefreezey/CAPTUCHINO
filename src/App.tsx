import { Route, Routes } from "react-router-dom";

import FailedPage from "@/pages/failed";
import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import FormPage from "@/pages/form";
import SuccessPage from "@/pages/success";

function App() {
  return (
    <Routes>
      <Route element={<FormPage />} path="/" />
      <Route element={<SuccessPage />} path="/success" />
      <Route element={<FailedPage />} path="/failed" />
    </Routes>
  );
}

export default App;
