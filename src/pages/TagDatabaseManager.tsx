import React, { useState } from "react";
import { Download, ChevronDown, Bot } from "lucide-react";

export default function TagDatabaseManager() {
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-primary">
      {/* 🟨 Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-light px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-primary">Tag Database Manager</h1>

        <div className="flex gap-3 items-center">
          <button 
            onClick={() => {
              console.log("Exporting to Excel...");
              alert("Excel export initiated! Tags will be downloaded as .xlsx file.");
            }}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-secondary transition-colors cursor-pointer"
          >
            Export to Excel (.xlsx)
          </button>
          <div className="relative">
            <button
              onClick={() => setShowVendorDropdown(!showVendorDropdown)}
              className="bg-white border border-light px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-accent-light transition-colors cursor-pointer"
            >
              Export to Vendor Format <ChevronDown className="w-4 h-4" />
            </button>
            {showVendorDropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-light rounded-md shadow-md w-56 z-50">
                {["Rockwell CSV", "TIA XML", "Beckhoff XLS"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      console.log(`Exporting to ${item}...`);
                      alert(`${item} export initiated! File will be downloaded shortly.`);
                      setShowVendorDropdown(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🟨 Sticky Filter/Search Panel */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-light px-6 py-3 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search tags..."
          className="border border-light rounded px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {[
          { label: "Vendor Type", options: ["Rockwell", "Siemens", "Beckhoff"] },
          { label: "Tag Type", options: ["Input", "Output", "Memory", "Temp", "Constant"] },
          { label: "Data Type", options: ["BOOL", "INT", "REAL", "DINT", "STRING", "TIMER", "COUNTER"] },
          { label: "Scope", options: ["Global", "Local"] },
        ].map((select, i) => (
          <select
            key={i}
            className="border border-light rounded px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option>{select.label}</option>
            {select.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        ))}

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-primary cursor-pointer" />
          Show AI-generated only
        </label>
      </div>

      {/* 🟨 Scrollable Table Area */}
      <div className="flex-1 px-6 py-4 pb-32 overflow-hidden">
        <div className="border border-dashed border-light rounded-md h-[400px] flex items-center justify-center text-sm text-muted">
          [ 🧱 Editable tag table will go here ]
        </div>
      </div>

      {/* 🟨 Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => {
            console.log("Opening AI assistant for tag management...");
            // Open AI assistant modal or navigate to Pandaura AS
            window.location.hash = '#/ask-pandaura';
          }}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition cursor-pointer"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
