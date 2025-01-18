import { MdOutlineMail } from "react-icons/md";
import { Button } from "../ui/button";
import { useAuthContext } from "@/providers/auth-provider";

const SignInOTPButton = ({ onOTP }: { onOTP?: () => void }) => {
  const { email, isLoading } = useAuthContext();
  return (
    <Button
      variant="outline"
      className="block overflow-hidden text-ellipsis w-full mt-2"
      disabled={isLoading}
      onClick={onOTP}
    >
      <MdOutlineMail className="inline mb-0.5" />
      <span className="pl-2">{`Email code to ${email}`}</span>
    </Button>
  );
};
export default SignInOTPButton;
