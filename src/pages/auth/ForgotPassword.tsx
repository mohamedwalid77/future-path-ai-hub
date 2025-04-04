
import React from "react";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";

const ForgotPassword = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-hero-pattern bg-future-dark p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
