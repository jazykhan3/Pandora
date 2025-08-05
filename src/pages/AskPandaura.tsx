import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  ChevronDown,
  Bot,
  MessageCircle,
  Cpu,
  FileText,
  Database,
  Download,
  Menu,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import logo from "../assets/logop.png";
import pandauraLogo from "../assets/logo.png";
import NavbarIcons from "../pages/NavbarIcons";
import STEditor from "../pages/STEditor/STEditor";
import TagDatabaseManager from "../pages/TagDatabaseManager";
import AutoDocs from "../pages/AutoDocs";
import Projects from "../pages/Projects";
import Profile from "../pages/Profile";
import PandauraOrb from "../components/PandauraOrb";

const tools = [
  "Pandaura AS",
  "Logic Studio",
  "AutoDocs",
  "Tag Database Manager",
  "Projects",
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
};

const icons = [MessageCircle, Cpu, FileText, Database, Download];
const vendorOptions = ["Rockwell", "Siemens", "Beckhoff"];

export default function AskPandauraLayout() {
  const [activeTool, setActiveTool] = useState<keyof typeof toolDescriptions>("Pandaura AS");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [vendor, setVendor] = useState("Rockwell");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showConversationsModal, setShowConversationsModal] = useState(false);
  
  const vendorDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target as Node)) {
        setShowVendorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {tools.map((tool, index) => {
        const Icon = icons[index];
        return (
          <div key={tool}>
            <div
              onClick={() => setActiveTool(tool)}
              className={`flex items-center cursor-pointer py-3 rounded-md transition-all ${
                activeTool === tool
                  ? " text-primary shadow-sm"
                  : "hover:bg-gray hover:text-primary hover:shadow-sm"
              }`}
            >
              <Icon className="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem]" />
              {sidebarOpen && <span className="text-sm font-medium ml-2">{tool}</span>}
            </div>
            {sidebarOpen && (
              <div className="ml-7 mt-1 space-y-1 text-xs text-muted">
                {toolDescriptions[tool]?.map((line, idx) => (
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

  const renderConversationsModal = () => (
    showConversationsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-hidden shadow-lg">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-light">
            <h3 className="text-lg font-semibold text-primary">Conversations</h3>
            <button
              onClick={() => setShowConversationsModal(false)}
              className="text-secondary hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-4 border-b border-light">
            <button 
              onClick={() => {
                setChatMessage("");
                setShowConversationsModal(false);
                // Reset conversation state here
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            <div className="p-4 space-y-2">
              {/* Example conversations */}
              {[
                { id: 1, title: "TIA Portal Safety IO Configuration", time: "2 hours ago" },
                { id: 2, title: "Motor Control Logic Help", time: "Yesterday" },
                { id: 3, title: "SCADA System Design", time: "3 days ago" },
                { id: 4, title: "PLC Programming Best Practices", time: "1 week ago" },
              ].map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    // Load selected conversation
                    setChatMessage("");
                    setShowConversationsModal(false);
                    console.log("Loading conversation:", chat.title);
                  }}
                  className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors border border-light"
                >
                  <div className="font-medium text-sm text-primary truncate">
                    {chat.title}
                  </div>
                  <div className="text-xs text-muted mt-1">{chat.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderPandauraScreen = () => (
    <div className="flex flex-col bg-white min-h-[calc(100vh-64px)]">
      <div className="p-3 max-w-4xl px-6 pb-32">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Pandaura AS</h1>
            <p className="text-sm text-secondary">
              Your AI co-engineer for automation, electrical, robotics, and everything in between.
            </p>
          </div>
          
          {/* Conversations Icon */}
          <button
            onClick={() => setShowConversationsModal(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="View Conversations"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
          </button>
        </div>

       <div className="text-muted mt-4 px-6 flex flex-col items-center text-center">
  <img src={pandauraLogo} alt="Pandaura Logo" className="h-20 w-auto mb-4" />
  <h2 className="text-lg font-semibold text-primary">Ask Pandaura Anything</h2>
  <p className="text-sm">
    Start a conversation with Pandaura or upload a document to begin.
  </p>
</div>


        <div className="space-y-4 mt-8">
          <div className="bg-gray-100 rounded-md px-4 py-3 text-sm text-left">
            <span className="font-medium text-primary">You:</span> I need to create a motor starter logic with safety interlocks for a conveyor system. Can you help me generate the structured text code for Rockwell PLC?
          </div>
          <div className="bg-white border border-light rounded-md px-4 py-3 text-sm shadow-sm">
            <span className="font-medium text-primary">Pandaura:</span> I'll help you create a comprehensive motor starter logic with safety interlocks. Here's a structured approach:
            <br/><br/>
            <strong>Key Components:</strong>
            <br/>• Emergency stop circuit with latching
            <br/>• Guard door safety switches
            <br/>• Motor overload protection
            <br/>• Start/stop pushbutton logic
            <br/>• Status indicators and fault diagnostics
            <br/><br/>
            Would you like me to generate the complete ST code with these safety features included?
          </div>
          <div className="bg-gray-100 rounded-md px-4 py-3 text-sm text-left">
            <span className="font-medium text-primary">You:</span> Yes, please generate the code and also create the tag database for all the I/O points.
          </div>
          <div className="bg-white border border-light rounded-md px-4 py-3 text-sm shadow-sm">
            <span className="font-medium text-primary">Pandaura:</span> Perfect! I'll generate both the ST logic and create a comprehensive tag database. Let me switch you to Logic Studio to generate the code, and then we can use the Tag Database Manager to organize all I/O points with proper naming conventions and documentation.
            <br/><br/>
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => setActiveTool("Logic Studio")}
                className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-secondary transition-colors"
              >
                → Open in Logic Studio
              </button>
              <button 
                onClick={() => setActiveTool("Tag Database Manager")}
                className="bg-white border border-light px-3 py-1 rounded text-xs hover:bg-accent-light transition-colors"
              >
                📋 Generate Tag Database
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`fixed bottom-0 bg-white border-t px-6 py-4 shadow-md z-30 transition-all duration-300 ${
        sidebarOpen ? 'left-72 right-0' : 'left-16 right-0'
      }`}>
        <div className="flex items-end gap-3 max-w-6xl mx-auto">
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask about PLCs, SCADA, HMI, robotics, motor control, or upload documents..."
            className="flex-1 border border-light rounded-md px-4 py-3 bg-surface shadow-sm text-sm text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[44px] max-h-[120px]"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => {
                console.log("Opening file upload dialog");
                // Trigger file upload here
              }}
              className="bg-white border border-light p-3 rounded-md hover:bg-accent-light transition-colors shadow-sm"
              title="Upload documents"
            >
              <UploadCloud className="w-4 h-4 text-primary" />
            </button>
            <button 
              onClick={() => {
                if (chatMessage.trim()) {
                  console.log("Sending message:", chatMessage);
                  // Handle message sending here
                  setChatMessage("");
                }
              }}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors text-sm font-medium shadow-sm"
              disabled={!chatMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogicStudio = () => (
    <div className="flex flex-col w-full px-6 py-4 pb-32 space-y-4 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Logic Studio</h1>
      </div>

      <div className="flex-1 min-h-[200px] max-h-[280px] overflow-hidden border border-light rounded shadow-sm">
        <STEditor
          initialCode={prompt}
          vendorType={vendor}
          onChange={(code) => setPrompt(code)}
        />
      </div>

      <div className="flex gap-3">
        <button className="bg-white border border-light px-4 py-2 rounded-md shadow-sm text-sm hover:bg-accent-light">
          ✨ Refactor Logic
        </button>
        <button className="bg-white border border-light px-4 py-2 rounded-md shadow-sm text-sm hover:bg-accent-light">
          🧠 Explain
        </button>
        <button className="bg-white border border-light px-4 py-2 rounded-md shadow-sm text-sm hover:bg-accent-light">
          🔍 Highlight Variables
        </button>
      </div>

      <div className="flex gap-4 items-start">
        <textarea
          className="flex-1 h-[90px] border border-light rounded-md px-4 py-3 bg-surface shadow-sm text-sm text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          placeholder="Describe your logic or upload docs to generate ST code..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="relative" ref={vendorDropdownRef}>
          <button
            onClick={() => setShowVendorDropdown(!showVendorDropdown)}
            className="flex items-center gap-2 border border-light bg-white px-4 py-2 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all"
          >
            Vendor: {vendor}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showVendorDropdown && (
            <div className="absolute mt-1 w-48 bg-white border border-light rounded-md shadow-lg z-10">
              {vendorOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setVendor(option);
                    setShowVendorDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-accent-light cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="border border-light bg-white p-3 rounded-md shadow-sm hover:bg-accent-light transition-all text-sm"
          title="Upload project documents"
        >
          <UploadCloud className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="text-xs text-muted text-center">
        🟢 Define Prompt → 🟡 Upload Docs → 🟡 Choose Vendor → ⚪ Review/Edit Logic
      </div>
    </div>
  );

  // ✅ ACTIVE TOOL HANDLER
  const renderContent = () => {
    if (activeTool === "Pandaura AS") return renderPandauraScreen();
    if (activeTool === "Logic Studio") return renderLogicStudio();
    if (activeTool === "AutoDocs") return <AutoDocs />;
    if (activeTool === "Tag Database Manager") return <TagDatabaseManager />;
    if (activeTool === "Projects") return <Projects />;

    return (
      <div className="text-center text-muted py-12 pb-32">
        <h3 className="text-lg font-medium text-secondary mb-2">Module Available</h3>
        <p>This module is ready to use. Click on it in the sidebar to access its features.</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-primary">
      {renderHeader()}
      <div className="flex flex-1 overflow-hidden min-w-0">
        {renderSidebar()}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
      {renderConversationsModal()}
      <PandauraOrb />
    </div>
  );
}
