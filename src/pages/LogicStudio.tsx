import React, { useState, useEffect, useRef } from "react";
import STEditor from "../pages/STEditor/STEditor";
import AIActionButtons from "../pages/AIActionButtons";
import AISuggestedAutocomplete from "../pages/AISuggestedAutocomplete";
import PendingChangesPanel from "../pages/STEditor/PendingChangesPanel";
import SmartWatchPanel from "../pages/STEditor/SmartWatchPanel";
import RoutineSearchbar from "../pages/STEditor/RoutineSearchbar";
import PandauraOrb from "../components/PandauraOrb";

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
  const [editorCode, setEditorCode] = useState(`PROGRAM Main
  VAR
    Start_Button    : BOOL;
    Stop_Button     : BOOL;
    Emergency_Stop  : BOOL;
    Motor_Contactor : BOOL;
    Motor_Running   : BOOL;
    Safety_OK       : BOOL;
  END_VAR

  // Safety Circuit
  Safety_OK := NOT Emergency_Stop;

  // Motor Control Logic
  IF Start_Button AND Safety_OK AND NOT Stop_Button THEN
    Motor_Contactor := TRUE;
  ELSIF Stop_Button OR NOT Safety_OK THEN
    Motor_Contactor := FALSE;
  END_IF;

  Motor_Running := Motor_Contactor;

END_PROGRAM`);
  const [vendor, setVendor] = useState("Rockwell" as "Rockwell" | "Siemens" | "Beckhoff");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showIntegrationDropdown, setShowIntegrationDropdown] = useState(false);
  const [showUploaderDropdown, setShowUploaderDropdown] = useState(false);
  const [showPendingChanges, setShowPendingChanges] = useState(false);
  const [showWatchPanel, setShowWatchPanel] = useState(true);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  
  const vendorDropdownRef = useRef<HTMLDivElement>(null);
  const integrationDropdownRef = useRef<HTMLDivElement>(null);
  const uploaderDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vendorDropdownRef.current && !vendorDropdownRef.current.contains(event.target as Node)) {
        setShowVendorDropdown(false);
      }
      if (integrationDropdownRef.current && !integrationDropdownRef.current.contains(event.target as Node)) {
        setShowIntegrationDropdown(false);
      }
      if (uploaderDropdownRef.current && !uploaderDropdownRef.current.contains(event.target as Node)) {
        setShowUploaderDropdown(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setShowActionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="h-[60vh] min-h-[800px] border border-light rounded-md overflow-hidden">
            <STEditor
              initialCode={editorCode}
              vendorType={vendor}
              onChange={(code) => setEditorCode(code)}
            />
          </div>

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
      setEditorCode(prevCode => {
        // Basic refactoring simulation - improve formatting
        const lines = prevCode.split('\n');
        const formatted = lines.map(line => {
          line = line.trim();
          if (line.includes('IF ') || line.includes('ELSIF ')) {
            return '  ' + line;
          } else if (line.includes('END_IF') || line.includes('END_VAR') || line.includes('END_PROGRAM')) {
            return line;
          } else if (line.includes('VAR') || line.includes('PROGRAM')) {
            return line;
          } else if (line.startsWith('//')) {
            return '  ' + line;
          } else if (line.includes(':=')) {
            return '    ' + line;
          }
          return '  ' + line;
        });
        return formatted.join('\n');
      });
      alert("Code refactored! Formatting and indentation improved.");
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
          <div className="flex-1 flex gap-2">
            <textarea
              className="flex-1 border border-light rounded-md px-4 py-3 bg-surface shadow-sm text-sm text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[72px]"
              placeholder="Describe your logic or ask for modifications..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            {/* AI Action Dropdown */}
            <div className="relative" ref={actionDropdownRef}>
              <button
                onClick={() => setShowActionDropdown(!showActionDropdown)}
                className="border border-light bg-primary text-white px-4 py-3 rounded-md shadow-sm text-sm hover:bg-secondary transition-all flex items-center gap-2 min-h-[72px]"
                title="AI Assistant Actions"
              >
                AI Assistant
                <ChevronDown className="w-4 h-4" />
              </button>
              {showActionDropdown && (
                <div className="absolute mt-1 w-48 bg-white border border-light rounded-md shadow-lg z-10 right-0">
                  <div
                    onClick={() => {
                      if (!prompt.trim()) {
                        alert("Please enter a description of the logic you want to generate.");
                        return;
                      }
                      console.log("Generating logic from prompt:", prompt);
                      // Simulate logic generation
                      const generatedLogic = `// Generated from: "${prompt}"
PROGRAM Generated_Logic
  VAR
    // Auto-generated variables
    Input_Signal : BOOL;
    Output_Signal : BOOL;
  END_VAR

  // Generated logic based on prompt
  Output_Signal := Input_Signal;

END_PROGRAM`;
                      setEditorCode(generatedLogic);
                      setPrompt("");
                      setShowActionDropdown(false);
                      alert("Logic generated successfully! Review the code in the editor above.");
                    }}
                    className="px-4 py-3 text-sm hover:bg-accent-light cursor-pointer border-b border-light"
                  >
                    <div className="font-medium">Generate Logic</div>
                    <div className="text-xs text-muted">Create new ST code from description</div>
                  </div>
                  <div
                    onClick={() => {
                      if (!prompt.trim()) {
                        alert("Please enter your modification request.");
                        return;
                      }
                      console.log("Editing logic via prompt:", prompt);
                      // Simulate logic editing
                      alert(`Modifying existing logic based on: "${prompt}"\n\nChanges applied to the editor.`);
                      setPrompt("");
                      setShowActionDropdown(false);
                    }}
                    className="px-4 py-3 text-sm hover:bg-accent-light cursor-pointer"
                  >
                    <div className="font-medium">Edit via Prompt</div>
                    <div className="text-xs text-muted">Modify existing code with AI</div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              alert(`Generating tags for ${vendor} from current logic...\nTags will be created in Tag Database Manager.`);
            }}
            className="border border-light bg-white px-4 py-2 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all"
            title="Auto-generate tags from the current logic"
          >
            Generate Tags
          </button>

          {/* Export to Vendor Format Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="border border-light bg-white px-4 py-2 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all flex items-center gap-2"
              title="Export logic to vendor-specific format"
            >
              Export to {vendor}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExportDropdown && (
              <div className="absolute mt-1 w-48 bg-white border border-light rounded-md shadow-lg z-10">
                <div
                  onClick={() => {
                    console.log(`Exporting to Rockwell format`);
                    alert(`Exporting logic to Rockwell (.L5X) format...`);
                    setShowExportDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-accent-light cursor-pointer flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-red-500 rounded"></span>
                  Rockwell (.L5X)
                </div>
                <div
                  onClick={() => {
                    console.log(`Exporting to Siemens format`);
                    alert(`Exporting logic to Siemens (.SCL) format...`);
                    setShowExportDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-accent-light cursor-pointer flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-teal-500 rounded"></span>
                  Siemens (.SCL)
                </div>
                <div
                  onClick={() => {
                    console.log(`Exporting to Beckhoff format`);
                    alert(`Exporting logic to Beckhoff (.POU) format...`);
                    setShowExportDropdown(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-accent-light cursor-pointer flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-orange-500 rounded"></span>
                  Beckhoff (.POU)
                </div>
              </div>
            )}
          </div>

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

      <PandauraOrb />

    </div>
  );
}
