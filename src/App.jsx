import EnglishSum from "./EnglishSum";
import HindiSum from "./HindiSum";
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
