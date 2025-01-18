"use client";

import SignInOTP from "@/components/auth/sign-in-otp";
import SignInPassword from "@/components/auth/sign-in-password";
import SignInAlternatives from "@/components/auth/sign-in-alternatives";
import SignInForgotPassword from "@/components/auth/sign-in-forgot-password";

import { useState } from "react";

type Step = "password" | "alternative_methods" | "forgot_password" | "otp";

const Page = () => {
  const [currentStep, setCurrentStep] = useState<Step>("password");
  const [showEmailButton, setShowEmailButton] = useState(true);

  switch (currentStep) {
    case "password":
      return (
        <SignInPassword
          onForgotPassword={() => setCurrentStep("forgot_password")}
          onAlternatives={() => {
            setShowEmailButton(true);
            setCurrentStep("alternative_methods");
          }}
        />
      );
    case "alternative_methods":
      return (
        <SignInAlternatives
          showEmailButton={showEmailButton}
          showPasswordButton={!showEmailButton}
          onOTP={() => setCurrentStep("otp")}
          onPassword={() => setCurrentStep("password")}
          onBackLinkClicked={() => {
            if (showEmailButton) setCurrentStep("password");
            else setCurrentStep("otp");
          }}
        />
      );
    case "forgot_password":
      return (
        <SignInForgotPassword
          onOTP={() => setCurrentStep("otp")}
          onBackLinkClicked={() => setCurrentStep("password")}
        />
      );
    case "otp":
      return (
        <SignInOTP
          onAlternatives={() => {
            setShowEmailButton(false);
            setCurrentStep("alternative_methods");
          }}
        />
      );
  }
};
export default Page;
