"use client";

import SignInOTP from "@/components/auth/sign-in-otp";
import SignInPassword from "@/components/auth/sign-in-password";
import LoadingStateProvider from "@/providers/loading-state-provider";
import SignInAlternatives from "@/components/auth/sign-in-alternatives";
import SignInForgotPassword from "@/components/auth/sign-in-forgot-password";

import { useState } from "react";

type Step =
  | "password"
  | "alternative_methods"
  | "alternative_methods_otp"
  | "forgot_password"
  | "otp";

const PageContent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("password");

  switch (currentStep) {
    case "password":
      return (
        <SignInPassword
          onForgotPassword={() => setCurrentStep("forgot_password")}
          onAlternatives={() => setCurrentStep("alternative_methods")}
        />
      );
    case "alternative_methods":
      return (
        <SignInAlternatives
          showEmailButton={true}
          onPrimaryAction={() => setCurrentStep("otp")}
          onBackLinkClicked={() => setCurrentStep("password")}
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
          onAlternatives={() => setCurrentStep("alternative_methods_otp")}
        />
      );
    case "alternative_methods_otp":
      return (
        <SignInAlternatives
          showPasswordButton={true}
          onPrimaryAction={() => setCurrentStep("password")}
          onBackLinkClicked={() => setCurrentStep("otp")}
        />
      );
  }
};

const Page = () => {
  return (
    <LoadingStateProvider>
      <PageContent />
    </LoadingStateProvider>
  );
};
export default Page;
