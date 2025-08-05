import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout";
import AskPandaura from "./pages/AskPandaura";
import LogicStudio from "./pages/LogicStudio";
import AutoDocs from "./pages/AutoDocs";
import TagDatabaseManager from "./pages/TagDatabaseManager";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/pandaura-as" replace />} />
        <Route path="/pandaura-as" element={<SharedLayout><AskPandaura /></SharedLayout>} />
        <Route path="/logic-studio" element={<SharedLayout><LogicStudio /></SharedLayout>} />
        <Route path="/autodocs" element={<SharedLayout><AutoDocs /></SharedLayout>} />
        <Route path="/tag-database" element={<SharedLayout><TagDatabaseManager /></SharedLayout>} />
        <Route path="/projects" element={<SharedLayout><Projects /></SharedLayout>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/pandaura-as" replace />} />
      </Routes>
    </Router>
  );
}
