"use client";

import SignInOTP from "@/components/auth/sign-in-otp";
import SignInAlternatives from "@/components/auth/sign-in-alternatives";

import { useState } from "react";

type Step = "otp" | "alternatives";

const Page = () => {
  const [currentStep, setCurrentStep] = useState<Step>("otp");

  switch (currentStep) {
    case "otp":
      return (
        <SignInOTP onAlternatives={() => setCurrentStep("alternatives")} />
      );

    case "alternatives":
      return (
        <SignInAlternatives
          onBackLinkClicked={() => setCurrentStep("otp")}
          showEmailButton={false}
          showPasswordButton={false}
        />
      );
  }
};
export default Page;
