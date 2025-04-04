
import React from "react";
import { LoginForm } from "@/components/auth/AuthForms";

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-hero-pattern bg-future-dark p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
