import React, { useState } from "react";
import {
  UploadCloud,
  MessageSquare,
  Plus,
  X,
  Send,
} from "lucide-react";
import pandauraLogo from "../assets/logo.png";

export default function AskPandaura() {
  const [chatMessage, setChatMessage] = useState("");
  const [showConversationsModal, setShowConversationsModal] = useState(false);

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

  return (
    <div className="flex flex-col bg-white h-full relative">
      <div className="p-6 max-w-4xl mx-auto flex-1">
        <div className="flex items-center justify-between mb-6">
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
                onClick={() => window.location.href = '/logic-studio'}
                className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-secondary transition-colors"
              >
                → Open in Logic Studio
              </button>
              <button 
                onClick={() => window.location.href = '/tag-database'}
                className="bg-white border border-light px-3 py-1 rounded text-xs hover:bg-accent-light transition-colors"
              >
                📋 Generate Tag Database
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 shadow-md z-30">
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
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {renderConversationsModal()}
    </div>
  );
}