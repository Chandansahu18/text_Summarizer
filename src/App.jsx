import EnglishSum from "./EnglishSum";
import HindiSum from "./HindiSum";
import ExcelSummarizer from "./ExcelSummarizer";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EnglishSum />} />
          <Route path="/hindi" element={<HindiSum />} />
          <Route path="/app" element={<ExcelSummarizer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
