import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AskPandaura from "./pages/AskPandaura";
import LogicStudio from "./pages/LogicStudio"; // ✅ Add this

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ask-pandaura" element={<AskPandaura />} />
        <Route path="/logic-studio" element={<LogicStudio />} /> {/* ✅ Add this */}
        <Route path="*" element={<Navigate to="/ask-pandaura" replace />} />
      </Routes>
    </Router>
  );
}
