"use client";

import { sendVerification } from "@/actions/verification";
import { useAuthContext } from "@/providers/auth-provider";
import { useLoadingState } from "@/providers/loading-state-provider";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const counterValue = 30;

const VerificationCountdown = () => {
  const { email } = useAuthContext();
  const { isLoading } = useLoadingState();
  const [counter, setCounter] = useState(counterValue);

  const resendVerification = async () => {
    if (counter <= 0) {
      setCounter(counterValue);
      const { success, errors } = await sendVerification(email);
      if (!success) {
        toast.error(errors?.[0].message);
      }
    }
  };

  useEffect(() => {
    const handle = setInterval(
      () =>
        setCounter((counter) => {
          if (counter > 0) return --counter;
          return 0;
        }),
      1000
    );
    return () => clearInterval(handle);
  }, []);

  return (
    <Button
      variant="link"
      className="text-xs mt-0"
      disabled={isLoading || counter > 0}
      onClick={resendVerification}
    >
      Didn&apos;t receive code? Resend {counter > 0 && `(${counter})`}
    </Button>
  );
};
export default VerificationCountdown;
