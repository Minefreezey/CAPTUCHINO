import { Route, Routes } from "react-router-dom";

import FailedPage from "@/pages/failed";
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
