import Logo from "@/components/logo";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import SignInSocial from "./sign-in-social";
import { Separator } from "../ui/separator";

import SignInOTPButton from "./sign-in-otp-button";

const SignInForgotPassword = ({
  onBackLinkClicked,
  onOTP,
}: {
  onBackLinkClicked: () => void;
  onOTP: () => void;
}) => {
  return (
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Forgot Password?</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>

      <CardFooter className="justify-center">
        <Button variant="link" onClick={onBackLinkClicked}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
export default SignInForgotPassword;
