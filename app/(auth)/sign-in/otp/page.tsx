"use client";

import SignInOTP from "@/components/auth/sign-in-otp";
import SignInAlternatives from "@/components/auth/sign-in-alternatives";

import { useState } from "react";
import LoadingStateProvider from "@/providers/loading-state-provider";

type Step = "otp" | "alternative_methods";

const PageContent = () => {
  const [currentStep, setCurrentStep] = useState<Step>("otp");

  switch (currentStep) {
    case "otp":
      return (
        <SignInOTP
          onAlternatives={() => setCurrentStep("alternative_methods")}
        />
      );

    case "alternative_methods":
      return (
        <SignInAlternatives onBackLinkClicked={() => setCurrentStep("otp")} />
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
