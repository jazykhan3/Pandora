import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  MessageCircle,
  Cpu,
  FileText,
  Database,
  Download,
  BookOpen,
} from "lucide-react";
import logo from "../assets/logop.png";
import NavbarIcons from "../pages/NavbarIcons";
import PandauraOrb from "../components/PandauraOrb";

const tools = [
  { name: "Pandaura AS", path: "/pandaura-as", icon: MessageCircle },
  { name: "Logic Studio", path: "/logic-studio", icon: Cpu },
  { name: "AutoDocs", path: "/autodocs", icon: FileText },
  { name: "Tag Database Manager", path: "/tag-database", icon: Database },
  { name: "Projects", path: "/projects", icon: Download },
  { name: "Case Study Generator", path: "/case-studies", icon: BookOpen },
] as const;

const toolDescriptions = {
  "Pandaura AS": [
    "Your AI co-engineer for automation, electrical, robotics, and everything in between.",
  ],
  "Logic Studio": [
    "Turn natural language into fully structured PLC code — instantly and vendor-ready.",
  ],
  "AutoDocs": [
    "Auto-generate PLC docs for end-user delivery—specs, IO lists, logic summaries, and more",
  ],
  "Tag Database Manager": [
    "Organize, edit, and maintain all your PLC tags in one centralized system.",
  ],
  "Projects": [
    "Manage and organize your automation projects, files, and collaborative workspaces.",
  ],
  "Case Study Generator": [
    "Create professional case studies from your automation projects and share success stories.",
  ],
};

interface SharedLayoutProps {
  children: React.ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTool = () => {
    const currentPath = location.pathname;
    const tool = tools.find(t => t.path === currentPath);
    return tool?.name || "Pandaura AS";
  };

  const handleToolClick = (toolPath: string) => {
    navigate(toolPath);
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between bg-surface px-6 py-4 border-b border-light shadow">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Pandaura Logo" className="h-12 w-auto" />
      </div>
      <div className="flex items-center space-x-4">
        <NavbarIcons />
      </div>
    </header>
  );

  const renderSidebar = () => (
    <div
      className={`h-full overflow-y-auto scrollbar-hide bg-gray-light border-r border-light shadow-card p-2 space-y-4 transition-all duration-300 ${
        sidebarOpen ? "w-72" : "w-16"
      }`}
    >
      <button
        className="text-secondary mb-2 focus:outline-none hover:text-primary transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Menu className="w-8 h-8" />
      </button>
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = getCurrentTool() === tool.name;
        return (
          <div key={tool.name}>
            <div
              onClick={() => handleToolClick(tool.path)}
              className={`flex items-center ${!sidebarOpen ? "justify-center" : ""} cursor-pointer py-3 rounded-md transition-all ${
                isActive
                  ? " text-primary shadow-sm"
                  : "hover:bg-gray hover:text-primary hover:shadow-sm"
              }`}
            >
              <Icon className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem]" />
              {sidebarOpen && <span className="text-sm font-medium ml-2">{tool.name}</span>}
            </div>
            {sidebarOpen && (
              <div className="ml-7 mt-1 space-y-1 text-xs text-muted">
                {toolDescriptions[tool.name]?.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-disabled">→</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background text-primary">
      {renderHeader()}
      <div className="flex flex-1 overflow-hidden min-w-0">
        {renderSidebar()}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <PandauraOrb />
    </div>
  );
}