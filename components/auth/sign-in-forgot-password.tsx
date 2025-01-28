import AuthCard from "@/components/auth/auth-card";
import { sendVerification } from "@/actions/verification";
import { useAuthContext } from "@/providers/auth-provider";
import SignInSocial from "@/components/auth/sign-in-social";
import SignInOTPButton from "@/components/auth/sign-in-otp-button";
import { useLoadingState } from "@/providers/loading-state-provider";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const SignInForgotPassword = ({
  onBackLinkClicked,
  onOTP,
}: {
  onBackLinkClicked: () => void;
  onOTP: () => void;
}) => {
  const { isLoading, setIsLoading } = useLoadingState();
  const { email } = useAuthContext();
  const router = useRouter();

  const sendOTP = async () => {
    setIsLoading(true);
    const { success, errors } = await sendVerification(email);
    if (success) {
      router.push("/sign-in/password-reset");
    } else {
      toast.error(errors?.[0].message);
    }
    setIsLoading(false);
  };
  return (
    <AuthCard
      title="Forgot Password?"
      footer={
        <Button variant="link" onClick={onBackLinkClicked}>
          Back
        </Button>
      }
    >
      <Button
        variant="magic"
        className="w-full"
        disabled={isLoading}
        onClick={sendOTP}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Reset your password"
        )}
      </Button>
      <div className="flex items-center gap-x-4 py-6">
        <Separator className="shrink" />
        <span className="text-sm text-gray-500 whitespace-nowrap">
          Or, sign in with another method
        </span>
        <Separator className="shrink" />
      </div>

      <SignInSocial />
      <SignInOTPButton onOTP={onOTP} />
    </AuthCard>
  );
};
export default SignInForgotPassword;
