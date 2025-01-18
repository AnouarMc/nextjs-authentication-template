import Logo from "@/components/logo";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import SignInSocial from "./sign-in-social";

import SignInOTPButton from "./sign-in-otp-button";
import { useAuthContext } from "@/providers/auth-provider";
import { Lock } from "lucide-react";

const SignInAlternatives = ({
  onBackLinkClicked,
  onOTP,
  onPassword,
  showEmailButton,
  showPasswordButton,
}: {
  onBackLinkClicked: () => void;
  onOTP?: () => void;
  onPassword?: () => void;
  showEmailButton: boolean;
  showPasswordButton: boolean;
}) => {
  const { isLoading } = useAuthContext();

  return (
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Use another method</CardTitle>
        <CardDescription>
          Facing issues? You can use any of these methods to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInSocial />

        {showEmailButton && <SignInOTPButton onOTP={onOTP} />}

        {showPasswordButton && (
          <Button
            variant="outline"
            className="block overflow-hidden text-ellipsis w-full mt-2"
            disabled={isLoading}
            onClick={onPassword}
          >
            <Lock className="inline mb-0.5" />
            <span className="pl-2">Sign in with your password</span>
          </Button>
        )}
      </CardContent>

      <CardFooter className="justify-center">
        <Button variant="link" onClick={onBackLinkClicked}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
export default SignInAlternatives;
