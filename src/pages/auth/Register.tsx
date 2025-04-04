
import React from "react";
import { RegisterForm } from "@/components/auth/AuthForms";

const Register = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-hero-pattern bg-future-dark p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
