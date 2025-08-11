import React, { useState, useEffect } from "react";
import { useModuleState } from "../../contexts/ModuleStateContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";

function validateEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

function passwordRequirements(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export default function SignUpAccountBasics({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void; }) {
  const { getModuleState, setModuleState } = useModuleState();
  const signupState = getModuleState("signup");
  const [fullName, setFullName] = useState(signupState.fullName || "");
  const [email, setEmail] = useState(signupState.email || "");
  const [password, setPassword] = useState(signupState.password || "");
  const [confirm, setConfirm] = useState(signupState.confirm || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  // Persist to context on change
  useEffect(() => {
    setModuleState("signup", { fullName, email, password, confirm });
  }, [fullName, email, password, confirm, setModuleState]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email:
        value.length === 0
          ? ""
          : validateEmail(value)
          ? ""
          : "Valid email required.",
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const reqs = passwordRequirements(value);
    const allValid = Object.values(reqs).every(Boolean);
    setErrors((prev) => ({
      ...prev,
      password:
        value.length === 0
          ? ""
          : allValid
          ? ""
          : "Password does not meet requirements.",
    }));
    if (confirm.length > 0) {
      setConfirmError(value === confirm ? "" : "Passwords do not match.");
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirm(value);
    setConfirmError(password === value ? "" : "Passwords do not match.");
  };

  const handleNext = () => {
    const reqs = passwordRequirements(password);
    const allValid = Object.values(reqs).every(Boolean);
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = "Full name required.";
    if (!validateEmail(email)) newErrors.email = "Valid email required.";
    if (!allValid) newErrors.password = "Password does not meet requirements.";
    if (password !== confirm) newErrors.confirm = "Passwords do not match.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setModuleState("signup", { fullName, email, password, confirm });
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
          Account Basics
        </h3>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          autoComplete="on"
        >
          <div className="relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all"
              placeholder=" "
            />
            <label
              htmlFor="fullName"
              className="absolute left-4 top-2 text-sm text-muted transition-all peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Full Name
            </label>
            {errors.fullName && (
              <p className="text-error text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-muted transition-all peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Work Email
            </label>
            {errors.email && (
              <p className="text-error text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={handlePasswordChange}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all pr-10"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-muted transition-all 
                             peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Create Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="text-xs mt-2">
            <ul className="space-y-1">
              <li
                className={password.length >= 8 ? "text-success" : "text-muted"}
              >
                {password.length >= 8 ? "✓" : "✗"} Minimum 8 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(password) ? "text-success" : "text-muted"
                }
              >
                {/[A-Z]/.test(password) ? "✓" : "✗"} Uppercase letter
              </li>
              <li
                className={
                  /[a-z]/.test(password) ? "text-success" : "text-muted"
                }
              >
                {/[a-z]/.test(password) ? "✓" : "✗"} Lowercase letter
              </li>
              <li
                className={
                  /[0-9]/.test(password) ? "text-success" : "text-muted"
                }
              >
                {/[0-9]/.test(password) ? "✓" : "✗"} Number
              </li>
              <li
                className={
                  /[^A-Za-z0-9]/.test(password) ? "text-success" : "text-muted"
                }
              >
                {/[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} Special character
              </li>
            </ul>
          </div>
          {errors.password && (
            <p className="text-error text-sm mt-2">{errors.password}</p>
          )}

          <div className="relative">
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              required
              value={confirm}
              onChange={handleConfirmChange}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all pr-10"
              placeholder=" "
            />
            <label
              htmlFor="confirm"
              className="absolute left-4 top-2 text-sm text-muted transition-all 
                             peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirm && (
            <p className="text-error text-sm mt-2">{errors.confirm}</p>
          )}
          {confirmError && (
            <p className="text-error text-sm mt-2">{confirmError}</p>
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
