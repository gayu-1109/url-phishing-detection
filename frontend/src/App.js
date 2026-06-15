import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BulkResults from "./pages/BulkResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bulk-results" element={<BulkResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;