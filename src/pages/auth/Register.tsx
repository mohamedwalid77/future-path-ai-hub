
import React from "react";
import { RegisterForm } from "@/components/auth/AuthForms";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c14] cyber-grid p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e]/30 via-[#16213e]/20 to-[#0f172a]/30 z-0"></div>
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gradient">Luminova AI</h1>
          <p className="text-muted-foreground mt-2">Begin your AI-powered career journey</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
