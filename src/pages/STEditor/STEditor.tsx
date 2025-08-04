import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import AutoFixTooltip from "./AutoFixTooltip";

interface Props {
  initialCode: string;
  vendorType: string;
  onChange: (code: string) => void;
}

const defaultTemplates: Record<string, string> = {
  Rockwell: `PROGRAM Main
    VAR
        MotorStart : BOOL;
        MotorStop : BOOL;
        MotorRunning : BOOL;
    END_VAR

    IF MotorStart AND NOT MotorStop THEN
        MotorRunning := TRUE;
    ELSE
        MotorRunning := FALSE;
    END_IF;
END_PROGRAM`,
  Siemens: `PROGRAM Main
    VAR
        StartButton : BOOL;
        StopButton : BOOL;
        MotorState : BOOL;
    END_VAR

    IF StartButton = TRUE AND StopButton = FALSE THEN
        MotorState := TRUE;
    ELSE
        MotorState := FALSE;
    END_IF;
END_PROGRAM`,
  Beckhoff: `PROGRAM PLC_PRG
    VAR
        Start : BOOL;
        Stop : BOOL;
        Output : BOOL;
    END_VAR

    IF Start AND NOT Stop THEN
        Output := TRUE;
    ELSE
        Output := FALSE;
    END_IF;
END_PROGRAM`,
};

export default function STEditor({ initialCode, vendorType, onChange }: Props) {
  const [code, setCode] = useState(initialCode);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Auto-fill vendor-specific template if no code is provided
    if (!initialCode && vendorType in defaultTemplates) {
      const template = defaultTemplates[vendorType];
      setCode(template);
      onChange(template);
    }
  }, [initialCode, vendorType, onChange]);

  const handleEditorChange = (value: string | undefined) => {
    const updated = value || "";
    setCode(updated);
    onChange(updated);

    // Simulate showing an AI tooltip if a tag is undefined
    if (updated.includes("undefined_tag")) {
      setShowTooltip(true);
      setTooltipPosition({ top: 50, left: 200 }); // fixed position for demo
    } else {
      setShowTooltip(false);
    }
  };

  const handleApplyFix = () => {
    const fixedCode = code.replace("undefined_tag", "defined_tag");
    setCode(fixedCode);
    onChange(fixedCode);
    setShowTooltip(false);
  };

  return (
    <div className="relative w-full h-full border border-light rounded shadow-sm">
      <MonacoEditor
        height="280px"
        language="pascal"
        theme="vs-light"
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />

      {showTooltip && (
        <div
          className="absolute"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          <AutoFixTooltip
            message="Looks like this tag is undefined. Do you want to auto-fix it?"
            onApply={handleApplyFix}
          />
        </div>
      )}
    </div>
  );
}
