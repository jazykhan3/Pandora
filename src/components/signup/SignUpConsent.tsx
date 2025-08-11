import React, { useState, useEffect } from "react";
import { useModuleState } from "../../contexts/ModuleStateContext";
import logo from "../../assets/logo.png";

export default function SignUpConsent({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) {
  const { getModuleState, setModuleState } = useModuleState();
  const signupState = getModuleState("signup");
  const [consent1, setConsent1] = useState(signupState.consent1 || false);
  const [consent2, setConsent2] = useState(signupState.consent2 || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setModuleState("signup", { ...signupState, consent1, consent2 });
  }, [consent1, consent2, setModuleState]);

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    if (!consent1)
      newErrors.consent1 = "You must acknowledge zero-trust policy.";
    if (!consent2) newErrors.consent2 = "You must agree to the EULA.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setModuleState("signup", { ...signupState, consent1, consent2 });
      nextStep();
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
          className="h-24 w-auto filter-none"
          style={{ filter: "none", imageRendering: "crisp-edges" }}
        />
      </div>

      <div className="w-[600px] max-w-lg bg-surface border border-light rounded-lg shadow-card z-10 p-8">
        <h3 className="text-xl font-semibold text-primary text-center mb-6">
          Zero-Trust Ready Consent
        </h3>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div className="relative">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent1}
                onChange={(e) => setConsent1(e.target.checked)}
                className="accent-accent w-5 h-5 mt-1"
              />
              <span className="text-primary text-base">
                I acknowledge Pandaura AS uses role-based access and activity
                monitoring in accordance with zero-trust security principles.
              </span>
            </label>
            {errors.consent1 && (
              <p className="text-error text-sm mt-2">{errors.consent1}</p>
            )}
          </div>

          <div className="relative">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent2}
                onChange={(e) => setConsent2(e.target.checked)}
                className="accent-accent w-5 h-5 mt-1"
              />
              <span className="text-primary text-base">
                I agree to the End User License Agreement.
              </span>
            </label>
          </div>
          <a
            href="/eula"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline ml-2 text-sm"
          >
            View EULA
          </a>
          {errors.consent2 && (
            <p className="text-error text-sm mt-2">{errors.consent2}</p>
          )}
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
