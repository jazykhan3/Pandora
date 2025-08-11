
import React, { useState, useEffect } from "react";
import { useModuleState } from "../../contexts/ModuleStateContext";
import logo from "../../assets/logo.png";

function generateInstanceId() {
  // Simulate local instance ID
  return (
    "INST-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  );
}
function getDeviceFingerprint() {
  // Simulate device fingerprint (local hash)
  return btoa(navigator.userAgent + navigator.language);
}

export default function SignUpEnvironment({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) {
  const { getModuleState, setModuleState } = useModuleState();
  const signupState = getModuleState("signup");
  const [instanceId, setInstanceId] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [binding, setBinding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulate fetching instanceId and fingerprint
    setInstanceId(generateInstanceId());
    setFingerprint(getDeviceFingerprint());
    setModuleState("signup", { ...signupState, instanceId, fingerprint });
    // eslint-disable-next-line
  }, []);

  const handleBind = async () => {
    setBinding(true);
    setError("");
    setSuccess(false);
    try {
      // const res = await fetch("/api/v1/auth/device-bind", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     instanceId,
      //     fingerprint,
      //     email: signupState?.email,
      //   }),
      // });
      // if (!res.ok) throw new Error("Failed to bind device.");
      // setSuccess(true);
      // setModuleState("signup", { ...signupState, instanceId, fingerprint, bound: true });
      setTimeout(() => nextStep(), 1200);
    } catch (err: any) {
      setError(err.message || "Binding failed.");
    } finally {
      setBinding(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-fit bg-background relative overflow-hidden py-0 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-transparent" />
      </div>

      <div className="z-10 mb-8 flex flex-col items-center">
        <img
          src={logo}
          alt="Pandaura AS Logo"
          className="h-20 w-auto filter-none"
          style={{ filter: "none", imageRendering: "crisp-edges" }}
        />
      </div>

      <div className="w-[600px] max-w-lg bg-surface border border-light rounded-lg shadow-card z-10 p-8">
        <h3 className="text-xl font-semibold text-primary text-center mb-6">
          Environment & Device Binding
        </h3>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-muted">Instance ID</span>
            <span className="font-mono text-primary text-sm bg-gray-100 px-2 py-1 rounded select-all">
              {instanceId || <span className="text-disabled">Loading...</span>}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Device Fingerprint</span>
            <span className="font-mono text-xs text-success">Bound</span>
          </div>
        </div>
        <div className="bg-accent/10 border border-accent rounded-md p-4 mb-6 text-center text-black text-sm">
          <span className="font-semibold">Your account will now be bound to this environment and device for security.</span>
          <br />
          Credentials won’t work elsewhere.
        </div>
        {error && <p className="text-error text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-success text-sm mb-4 text-center">Device successfully bound!</p>}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-muted font-medium transition-all"
            onClick={prevStep}
            disabled={binding}
          >
            Back
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md shadow-sm transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 font-medium"
            onClick={handleBind}
            disabled={binding || success}
          >
            {binding ? "Binding..." : success ? "Bound" : "Proceed / Bind"}
          </button>
        </div>
      </div>
    </div>
  );
}
