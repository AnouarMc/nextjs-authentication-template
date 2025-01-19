import AuthCard from "@/components/auth/auth-card";
import SignInSocial from "@/components/auth/sign-in-social";
import SignInOTPButton from "@/components/auth/sign-in-otp-button";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoadingState } from "@/providers/loading-state-provider";

const SignInAlternatives = ({
  onBackLinkClicked,
  onPrimaryAction,
  showEmailButton,
  showPasswordButton,
}: {
  onBackLinkClicked: () => void;
  onPrimaryAction?: () => void;
  showEmailButton?: boolean;
  showPasswordButton?: boolean;
}) => {
  const { isLoading } = useLoadingState();

  return (
    <>
      <AuthCard
        title="Use another method"
        subtitle="Facing issues? You can use any of these methods to sign in"
        footer={
          <Button variant="link" onClick={onBackLinkClicked}>
            Back
          </Button>
        }
      >
        <SignInSocial />

        {showEmailButton && <SignInOTPButton onOTP={onPrimaryAction} />}

        {showPasswordButton && (
          <Button
            variant="outline"
            className="block overflow-hidden text-ellipsis w-full mt-2"
            disabled={isLoading}
            onClick={onPrimaryAction}
          >
            <Lock className="inline mb-0.5" />
            <span className="pl-2">Sign in with your password</span>
          </Button>
        )}
      </AuthCard>
    </>
  );
};
export default SignInAlternatives;
