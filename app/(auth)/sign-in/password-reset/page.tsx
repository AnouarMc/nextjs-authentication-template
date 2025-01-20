"use client";

import SetNewPassword from "@/components/auth/set-new-password";
import PasswordResetOTP from "@/components/auth/password-reset-otp";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingStateProvider from "@/providers/loading-state-provider";

const PageContent = () => {
  const [step, setStep] = useState<"verify" | "new-password">("verify");
  const [otpCode, setOtpCode] = useState("");

  const router = useRouter();

  switch (step) {
    case "verify":
      return (
        <PasswordResetOTP
          onVerificationSuccess={(otpCode) => {
            setStep("new-password");
            setOtpCode(otpCode);
          }}
          onBackLinkClicked={() => router.back()}
        />
      );
    case "new-password":
      return <SetNewPassword otpCode={otpCode} />;
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
