"use client";

import { useState } from "react";
import AuthAppVerification from "./auth-app-verification";
import BackupCodeVerification from "./backup-code-verification";

const Page = () => {
  const [step, setStep] = useState<"app" | "backup">("app");
  return (
    <>
      {step === "app" ? (
        <AuthAppVerification onAlternatives={() => setStep("backup")} />
      ) : (
        <BackupCodeVerification onAlternatives={() => setStep("app")} />
      )}
    </>
  );
};

export default Page;
