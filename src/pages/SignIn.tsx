import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import { authenticateUser } from "../utils/mockAuth";
import { Eye, EyeOff } from "lucide-react"; 
import logo from "../assets/logo.png";

export default function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isAuthenticated = authenticateUser(email, password);

    if (isAuthenticated) {
      setError("");
      setShowSplash(true);
      setTimeout(() => {
        navigate("/ask-pandaura");
      }, 1500);
    } else {
      setError("Invalid username or password.");
    }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden py-20 px-4">
      {/* Subtle background pattern - removed glowing orbs for clean light theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-transparent" />
      </div>
      
      <div className="z-10 mb-8 flex flex-col items-center">
        <img
          src={logo}
          alt="Pandaura Logo"
          className="h-20 w-auto"
        />
        <h2 className="text-2xl font-semibold text-primary text-center mt-4">
          Pandaura
        </h2>
      </div>
      
      <div className="w-full max-w-sm bg-surface border border-light rounded-lg shadow-card z-10 p-8">
        <h2 className="text-xl font-semibold text-primary text-center mb-8">
          Sign in to Pandaura
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="text"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-muted transition-all 
                         peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Username or Email
            </label>
          </div>
          
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-6 pb-3 bg-surface text-primary border border-light rounded-md shadow-sm outline-none focus:ring-2 focus:ring-accent focus:border-accent placeholder-transparent transition-all"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-muted transition-all 
                         peer-focus:text-xs peer-focus:text-secondary peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-disabled"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-muted">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface border-strong rounded focus:ring-accent focus:ring-2"
              />
              <span>Remember me</span>
            </label>
            <span className="italic opacity-50 cursor-not-allowed hover:opacity-70 transition-opacity">
              Forgot password?
            </span>
          </div>

          {error && (
            <div className="text-error text-sm text-center bg-error-light border border-error/20 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-surface hover:text-primary text-background py-3 rounded-md shadow-card transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 border-primary font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
