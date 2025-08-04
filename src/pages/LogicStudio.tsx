import React, { useState } from "react";
import STEditor from "../pages/STEditor/STEditor";
import AIActionButtons from "../pages/AIActionButtons";
import AISuggestedAutocomplete from "../pages/AISuggestedAutocomplete";
import PendingChangesPanel from "../pages/STEditor/PendingChangesPanel";
import SmartWatchPanel from "../pages/STEditor/SmartWatchPanel";
import RoutineSearchbar from "../pages/STEditor/RoutineSearchbar";

import {
  UploadCloud,
  Bot,
  ChevronDown,
  Plug,
} from "lucide-react";
import logo from "../assets/logop.png";

const vendorOptions = ["Rockwell", "Siemens", "Beckhoff"];

export default function LogicStudio() {
  const [prompt, setPrompt] = useState("");
  const [vendor, setVendor] = useState("Rockwell" as "Rockwell" | "Siemens" | "Beckhoff");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showIntegrationDropdown, setShowIntegrationDropdown] = useState(false);
  const [showUploaderDropdown, setShowUploaderDropdown] = useState(false);
  const [showPendingChanges, setShowPendingChanges] = useState(false);
  const [showWatchPanel, setShowWatchPanel] = useState(true);

  // Mock data for new components
  const mockDiffs = [
    {
      line: 15,
      original: "MotorStart := TRUE;",
      modified: "MotorStart := Start_Button AND NOT E_Stop;",
      type: 'changed' as const
    },
    {
      line: 23,
      original: "",
      modified: "// Added safety interlock for conveyor",
      type: 'added' as const
    }
  ];

  const mockWatchVariables = [
    {
      name: "Motor_Current",
      value: 15.7,
      type: 'REAL' as const,
      isPinned: false,
      isAICritical: true,
      alert: {
        type: 'warning' as const,
        message: "Current fluctuating - potential connection issue"
      },
      activity: {
        changes: 23,
        timespan: "last 5min"
      }
    },
    {
      name: "Conveyor_Running",
      value: true,
      type: 'BOOL' as const,
      isPinned: true,
      isAICritical: false
    },
    {
      name: "Safety_OK",
      value: false,
      type: 'BOOL' as const,
      isPinned: false,
      isAICritical: true,
      alert: {
        type: 'error' as const,
        message: "Safety circuit open - check E-stops and guards"
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary">
      {/* Header */}
      <header className="flex items-center justify-between bg-surface px-6 py-4 border-b border-light shadow">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Pandaura Logo" className="h-12 w-auto" />
          <h1 className="text-xl font-bold text-primary">Logic Studio</h1>
        </div>
        <div className="text-sm text-secondary">Project: Motor_Auto.ap14</div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex gap-6 p-6">
        {/* Left Column - Main Editor */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-end">
            <RoutineSearchbar
              onSearch={(query) => {
                console.log("Searching for:", query);
                return []; // Mock implementation
              }}
              onSelectResult={(result) => {
                console.log("Selected result:", result);
                // In real implementation, would jump to line/routine
              }}
            />
          </div>

          {/* Monaco Editor */}
          <STEditor
            initialCode={prompt}
            vendorType={vendor}
            onChange={(code) => setPrompt(code)}
          />

          {/* Pending Changes Panel */}
          <PendingChangesPanel
            isEnabled={showPendingChanges}
            onToggle={setShowPendingChanges}
            diffs={mockDiffs}
            originalCode="PROGRAM Main\n  VAR\n    MotorStart : BOOL;\n  END_VAR\n  MotorStart := TRUE;\nEND_PROGRAM"
            modifiedCode="PROGRAM Main\n  VAR\n    MotorStart : BOOL;\n  END_VAR\n  // Added safety interlock for conveyor\n  MotorStart := Start_Button AND NOT E_Stop;\nEND_PROGRAM"
            aiSummary="User added safety interlock logic and documentation. Changes improve safety compliance by checking emergency stop conditions."
            onReintegrate={() => console.log("Reintegrating changes with AI...")}
            onRevert={() => {
              console.log("Reverting changes...");
              setShowPendingChanges(false);
            }}
          />

          {/* AI Tools Buttons */}
<div className="flex gap-3 mt-2">
  <button
    onClick={() => {
      console.log("Refactoring logic...");
      // Show refactored code in editor
      setPrompt(prevCode => {
        // Basic refactoring simulation
        return prevCode.replace(/\s+/g, ' ').trim();
      });
    }}
    title="Improve formatting and structure"
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-light shadow-sm text-sm hover:bg-accent-light transition"
  >
    ✨ Refactor Logic
  </button>

  <button
    onClick={() => {
      console.log("Explaining logic...");
      alert("Logic Explanation:\n\nThis motor control logic implements safety interlocks with start/stop functionality. The emergency stop circuit provides immediate shutdown capability, while guard door switches ensure safe operation during maintenance.");
    }}
    title="Explain logic to non-programmers"
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-light shadow-sm text-sm hover:bg-accent-light transition"
  >
    🧠 Explain
  </button>

  <button
    onClick={() => {
      console.log("Highlighting variables...");
      // In a real app, this would highlight variables in the Monaco editor
      alert("Variables highlighted in the code editor:\n\n• Input variables (green)\n• Output variables (blue)\n• Internal variables (yellow)");
    }}
    title="Highlight variables in code"
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-light shadow-sm text-sm hover:bg-accent-light transition"
  >
    🔍 Highlight Variables
  </button>
</div>


        {/* Input Bar */}
        <div className="flex flex-wrap gap-4 items-start">
          {/* Prompt Input */}
          <textarea
            className="flex-1 border border-light rounded-md px-4 py-3 bg-surface shadow-sm text-sm text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[72px]"
            placeholder="Describe your logic or upload docs to generate ST code..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Vendor Style Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowVendorDropdown((prev) => !prev)}
              className="flex items-center gap-2 border border-light bg-white px-4 py-2 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all"
            >
              Vendor Style: {vendor}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showVendorDropdown && (
              <div className="absolute mt-1 w-48 bg-surface border border-light rounded-md shadow-lg z-10">
                {vendorOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setVendor(option as "Rockwell" | "Siemens" | "Beckhoff");
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

          {/* Generate Tags Button */}
          <button
            onClick={() => {
              console.log("Generating tags for", vendor);
              // Navigate to Tag Database Manager - would need routing context in real app
              window.location.hash = '#/tag-database-manager';
            }}
            className="border border-light bg-white px-4 py-2 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all"
            title="Auto-generate tags from the current logic"
          >
            Generate Tags
          </button>

          <div className="flex space-x-4 items-center mt-4 ml-4">
            {/* Integrations Icon */}
            <div className="relative">
              <button
                onClick={() => setShowIntegrationDropdown(!showIntegrationDropdown)}
                title="Integrations"
                className="p-2 rounded hover:bg-gray-200"
              >
                <Plug />
              </button>
              {showIntegrationDropdown && (
                <div className="absolute z-10 mt-2 w-72 bg-white rounded shadow-lg p-4 text-sm">
                  <div className="font-semibold mb-3 text-primary">Productivity Tools</div>
                  <ul className="space-y-3">
                    <li 
                      onClick={() => {
                        console.log("Connecting to Google Drive API...");
                        alert("Google Drive integration would be configured here");
                        setShowIntegrationDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>Google Drive API</span>
                    </li>
                    <li 
                      onClick={() => {
                        console.log("Connecting to Google Docs API...");
                        alert("Google Docs integration would be configured here");
                        setShowIntegrationDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs">📄</span>
                      </div>
                      <span>Google Docs API</span>
                    </li>
                    <li 
                      onClick={() => {
                        console.log("Connecting to Dropbox API...");
                        alert("Dropbox integration would be configured here");
                        setShowIntegrationDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                        <span className="text-white text-xs">📦</span>
                      </div>
                      <span>Dropbox API</span>
                    </li>
                    <li 
                      onClick={() => {
                        console.log("Connecting to Excel API...");
                        alert("Excel API integration would be configured here");
                        setShowIntegrationDropdown(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs">📊</span>
                      </div>
                      <span>Excel API</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Smart Uploader Icon */}
            <div className="relative">
              <button
                onClick={() => setShowUploaderDropdown(!showUploaderDropdown)}
                title="Smart Document Uploader"
                className="p-2 rounded hover:bg-gray-200"
              >
                <UploadCloud />
              </button>
              {showUploaderDropdown && (
                <div 
                  onClick={() => {
                    console.log("Opening document uploader...");
                    // Trigger file upload dialog
                    setShowUploaderDropdown(false);
                  }}
                  className="absolute z-10 mt-2 w-64 bg-white rounded shadow-lg p-3 text-sm cursor-pointer hover:bg-gray-50"
                >
                  <div className="font-semibold mb-2">Accepted File Types</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>.pdf, .doc, .docx</li>
                    <li>.xls, .xlsx, .txt</li>
                    <li>.l5x, .scl, .xml</li>
                    <li>.tsproj, .tpy</li>
                  </ul>
                  <div className="mt-2 text-xs text-muted">Click to upload files</div>
                </div>
              )}
            </div>
          </div>

          {/* Smart Document Uploader button */}
          <button
            onClick={() => {
              console.log("Opening document uploader...");
              // Trigger file upload dialog
            }}
            className="border border-light bg-white p-3 rounded-md shadow-sm hover:bg-accent-light transition-all text-sm"
            title="Upload any project documents to improve logic accuracy."
          >
            <UploadCloud className="w-5 h-5 text-primary" />
          </button>
        </div>

          {/* Workflow Step Indicator */}
          <div className="text-xs text-muted text-center mt-2">
            🟢 Define Prompt → 🟡 Upload Docs → 🟡 Choose Vendor → ⚪ Review/Edit Logic
          </div>
        </div>

        {/* Right Column - AI Panels */}
        <div className="w-80 space-y-4">
          {/* Smart Watch Panel */}
          <SmartWatchPanel
            variables={mockWatchVariables}
            onPin={(varName) => console.log("Pinning variable:", varName)}
            onUnpin={(varName) => console.log("Unpinning variable:", varName)}
            isSimulationActive={true}
          />

          {/* AI Suggested Autocomplete */}
          <AISuggestedAutocomplete
            suggestions={[
              "IF Safety_OK AND Start_Button THEN",
              "Conveyor_Speed := Target_Speed;",
              "Motor_Fault := Overload OR Overcurrent;"
            ]}
          />

          {/* Quick Actions */}
          <div className="bg-white border border-light rounded-md p-3">
            <h3 className="text-sm font-medium text-primary mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowPendingChanges(!showPendingChanges)}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded transition-colors"
              >
                {showPendingChanges ? '📋 Hide' : '📋 Show'} Pending Changes
              </button>
              <button
                onClick={() => console.log("Opening tag database...")}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded transition-colors"
              >
                🏷️ Manage Tags
              </button>
              <button
                onClick={() => console.log("Running simulation...")}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded transition-colors"
              >
                ▶️ Test Logic
              </button>
            </div>
          </div>
        </div>
      </main>
      <AIActionButtons />

      {/* Floating AI Orb */}
      <button
        onClick={() => {
          console.log("Opening AI assistant...");
          // Navigate back to Pandaura AS
          window.location.hash = '#/ask-pandaura';
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        title="Ask Pandaura Anything"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
      

    </div>
  );
}
