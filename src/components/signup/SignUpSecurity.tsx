import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { CheckCircle, Circle } from "lucide-react";

export default function SignUpSecurity({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) {
  const [method, setMethod] = useState<"totp" | "sms" | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!method) return setError("Select a method.");
    if (code.length !== 6) return setError("Enter 6-digit code.");
    nextStep();
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
          className="h-24 w-auto filter-none"
          style={{ filter: "none", imageRendering: "crisp-edges" }}
        />
      </div>

      <div className="w-[600px] max-w-lg bg-transparent border border-light rounded-lg shadow-card z-10 p-8">
        <h3 className="text-xl font-semibold text-primary text-center mb-6">
          Secure Your Account
        </h3>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          autoComplete="on"
        >
          <div className="mb-4">
            <label className="block mb-2 text-base font-medium text-muted">
              Select either:
            </label>
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-center border-2 rounded-md px-4 py-3 cursor-pointer transition-all ${
                  method === "totp"
                    ? "border-accent bg-accent/5"
                    : "border-light bg-transparent hover:border-accent"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="totp"
                  checked={method === "totp"}
                  onChange={() => setMethod("totp")}
                  className="hidden"
                />
                <span className="mr-3">
                  {method === "totp" ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted" />
                  )}
                </span>
                <span className="text-base text-primary">
                  Authenticator App (TOTP) (Preferred)
                </span>
              </label>
              <label
                className={`flex items-center border-2 rounded-md px-4 py-3 cursor-pointer transition-all ${
                  method === "sms"
                    ? "border-accent bg-accent/5"
                    : "border-light bg-transparent hover:border-accent"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="sms"
                  checked={method === "sms"}
                  onChange={() => setMethod("sms")}
                  className="hidden"
                />
                <span className="mr-3">
                  {method === "sms" ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted" />
                  )}
                </span>
                <span className="text-base text-primary">SMS Backup Code</span>
              </label>
            </div>
          </div>
          {method === "totp" && (
            <div className="mb-4 flex flex-col items-center">
              <div className="mb-2 text-base text-muted">
                Scan QR code with your authenticator app.
              </div>
              <div className="w-32 h-32 border-2 border-light rounded-lg flex items-center justify-center mb-2 bg-white">
                {/* Replace with actual QR code */}
                <span className="text-muted">QR</span>
              </div>
              <input
                className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all mt-2"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                type="text"
                autoComplete="one-time-code"
              />
            </div>
          )}
          {method === "sms" && (
            <div className="mb-4 flex flex-col items-center">
              <div className="mb-2 text-base text-muted">
                Enter the 6-digit code sent to your phone.
              </div>

              <input
                className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all mt-2"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
                type="text"
                autoComplete="one-time-code"
              />
            </div>
          )}
          {error && <p className="text-error text-sm mt-2">{error}</p>}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-muted font-medium transition-all"
              onClick={prevStep}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md shadow-sm transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 font-medium"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
