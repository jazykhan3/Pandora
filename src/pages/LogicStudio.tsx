import React, { useState, useEffect, useRef } from "react";
import STEditor from "../pages/STEditor/STEditor";
import AIActionButtons from "../pages/AIActionButtons";
import AISuggestedAutocomplete from "../pages/AISuggestedAutocomplete";
import PendingChangesPanel from "../pages/STEditor/PendingChangesPanel";
import RoutineSearchbar from "../pages/STEditor/RoutineSearchbar";
import AutoFixTooltip from "../pages/STEditor/AutoFixTooltip";
import RefactorSuggestionBanner from "../pages/STEditor/RefactorSuggestionBanner";
import SmartEditToolbar from "../pages/STEditor/SmartEditToolbar";

import {
  UploadCloud,
  ChevronDown,
} from "lucide-react";

const vendorOptions = ["Rockwell", "Siemens", "Beckhoff"];

interface LogicStudioProps {
  sessionMode?: boolean;
}

export default function LogicStudio({ sessionMode = false }: LogicStudioProps) {
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
  const [showPendingChanges, setShowPendingChanges] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [vendorContextEnabled, setVendorContextEnabled] = useState(false);
  
  const vendorDropdownRef = useRef<HTMLDivElement>(null);
  const vendorContextRef = useRef<HTMLDivElement>(null);

  // Mock data for AI components
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

  const handleGenerateLogic = () => {
    if (!prompt.trim()) {
      alert("Please enter a description of the logic you want to generate.");
      return;
    }
    
    console.log("Generating logic from prompt:", prompt);
    const generatedLogic = `// Generated from: "${prompt}"
PROGRAM Generated_Logic
  VAR
    // Auto-generated variables based on prompt
    Input_Signal : BOOL;
    Output_Signal : BOOL;
    Process_Active : BOOL;
  END_VAR

  // Generated logic based on your description
  IF Input_Signal THEN
    Process_Active := TRUE;
    Output_Signal := Process_Active;
  ELSE
    Process_Active := FALSE;
    Output_Signal := FALSE;
  END_IF;

END_PROGRAM`;
    
    setEditorCode(generatedLogic);
    setPrompt("");
    alert("Logic generated successfully! Review the code in the editor above.");
  };

  const handlePromptKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateLogic();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-primary">
      {/* Header */}
      <header className="flex items-center justify-between bg-surface px-6 py-4 border-b border-light shadow">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-primary">Logic Studio</h1>
        </div>
        <div className="text-sm text-secondary">Project: Motor_Auto.ap14</div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col gap-6 p-6">
        {/* Top Section - Search Bar */}
        <div className="flex justify-end">
          <RoutineSearchbar
            onSearch={(query) => {
              console.log("Searching for:", query);
              return [];
            }}
            onSelectResult={(result) => {
              console.log("Selected result:", result);
            }}
          />
        </div>

        {/* Main ST Editor - Scrollable Output Area */}
        <div className="flex-1 min-h-[400px]">
          <div className="h-full border border-light rounded-md overflow-hidden shadow-sm">
            <STEditor
              initialCode={editorCode}
              vendorType={vendor}
              onChange={(code) => setEditorCode(code)}
            />
          </div>
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

        {/* Bottom Input Section */}
        <div className="bg-white border border-light rounded-lg p-4 shadow-sm">
          <div className="flex gap-3 items-end">
            {/* Prompt Input Field */}
            <textarea
              className="flex-1 border border-light rounded-md px-4 py-3 bg-surface shadow-sm text-sm text-primary placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[60px] max-h-[120px]"
              placeholder="Describe your logic requirements in natural language..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handlePromptKeyPress}
            />
            
            {/* Vendor Style Dropdown */}
            <div className="relative" ref={vendorDropdownRef}>
              <button
                onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                className="flex items-center gap-2 border border-light bg-white px-4 py-3 rounded-md shadow-sm text-sm text-primary hover:bg-accent-light transition-all min-h-[60px] whitespace-nowrap"
              >
                Vendor: {vendor}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showVendorDropdown && (
                <div className="absolute bottom-full mb-1 w-48 bg-surface border border-light rounded-md shadow-lg z-10">
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

            {/* Export Button */}
            <button
              onClick={() => {
                console.log(`Exporting logic to ${vendor} format`);
                alert(`✅ Exporting logic to ${vendor} format...\n\nYour structured text will be downloaded shortly in ${vendor}-compatible format.`);
              }}
              className="bg-primary text-white px-4 py-3 rounded-md shadow-sm text-sm hover:bg-secondary transition-all min-h-[60px] whitespace-nowrap"
              title="Export current logic to vendor-specific format"
            >
              📤 Export Logic
            </button>

            {/* Smart Document Uploader */}
            <button
              onClick={() => {
                console.log("Opening document uploader...");
                // Trigger file upload dialog
              }}
              className="border border-light bg-white p-3 rounded-md shadow-sm hover:bg-accent-light transition-all text-sm min-h-[60px]"
              title="Upload any project documents to improve logic accuracy."
            >
              <UploadCloud className="w-5 h-5 text-primary" />
            </button>

            {/* Generate Button */}
            <button
              onClick={handleGenerateLogic}
              className="bg-primary text-white px-6 py-3 rounded-md shadow-sm text-sm hover:bg-secondary transition-all min-h-[60px] whitespace-nowrap"
              disabled={!prompt.trim()}
            >
              Generate Logic
            </button>
          </div>

          {/* Workflow Step Indicator */}
          <div className="text-xs text-muted text-center mt-3">
            🟢 Define Prompt → 🟡 Upload Docs → 🟡 Choose Vendor → ⚪ Review/Edit Logic
          </div>
        </div>

        {/* AI Suggestions Panel */}
        {showAISuggestions && (
          <AISuggestedAutocomplete
            suggestions={[
              "IF Safety_OK AND Start_Button THEN",
              "Conveyor_Speed := Target_Speed;",
              "Motor_Fault := Overload OR Overcurrent;"
            ]}
            onClose={() => setShowAISuggestions(false)}
          />
        )}

        {/* Quick Actions */}
        <div className="bg-white border border-light rounded-md p-3">
          <h3 className="text-sm font-medium text-primary mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPendingChanges(!showPendingChanges)}
              className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
            >
              {showPendingChanges ? '📋 Hide' : '📋 Show'} Pending Changes
            </button>
            {!showAISuggestions && (
              <button
                onClick={() => setShowAISuggestions(true)}
                className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
              >
                ✨ Show AI Suggestions
              </button>
            )}
          </div>
        </div>
      </main>
      
      <AIActionButtons />
    </div>
  );
}