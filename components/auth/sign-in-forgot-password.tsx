import AuthCard from "@/components/auth/auth-card";
import SignInSocial from "@/components/auth/sign-in-social";
import SignInOTPButton from "@/components/auth/sign-in-otp-button";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SignInForgotPassword = ({
  onBackLinkClicked,
  onOTP,
}: {
  onBackLinkClicked: () => void;
  onOTP: () => void;
}) => {
  return (
    <>
      <AuthCard
        title="Forgot Password?"
        footer={
          <Button variant="link" onClick={onBackLinkClicked}>
            Back
          </Button>
        }
      >
        <Button className="w-full">Reset your password</Button>
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
    </>
  );
};
export default SignInForgotPassword;
