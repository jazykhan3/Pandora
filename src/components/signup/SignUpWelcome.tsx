import logo from "../../assets/logo.png";

export default function SignUpWelcome({ nextStep }: { nextStep: () => void }) {
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
        <h1 className="text-3xl font-bold text-primary text-center mt-4">
          Welcome to Pandaura AS
        </h1>
        <h2 className="text-lg text-secondary text-center mb-8">
          Industrial Automation Suite
        </h2>

        <button
          className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-md shadow-sm transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 font-medium"
          onClick={nextStep}
        >
          Create Your Account
        </button>
      </div>
    </div>
  );
}
