import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function SignUpFinish() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-white">
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
      <h1 className="text-2xl font-bold mb-4">Account Created!</h1>
      <p className="mb-8">
        You’re ready to start building.
      </p>
      <button
        className="bg-primary hover:bg-secondary text-white py-2 px-6 rounded-md shadow-sm transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 font-medium"
        onClick={() => navigate("/home")}
      >
        Log In Now
      </button>
    </div>
  );
}
