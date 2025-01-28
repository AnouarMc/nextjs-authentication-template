import { sendVerification } from "@/actions/verification";
import { useAuthContext } from "@/providers/auth-provider";
import { useLoadingState } from "@/providers/loading-state-provider";

import { toast } from "sonner";
import { MdOutlineMail } from "react-icons/md";
import { Button } from "@/components/ui/button";

const SignInOTPButton = ({ onOTP }: { onOTP?: () => void }) => {
  const { email } = useAuthContext();
  const { isLoading } = useLoadingState();

  const sendOTP = async () => {
    onOTP?.();
    const { success, errors } = await sendVerification(email);
    if (!success) {
      toast.error(errors?.[0].message);
    }
  };
  return (
    <Button
      variant="magic-secondary"
      className="block overflow-hidden text-ellipsis w-full mt-2"
      disabled={isLoading}
      onClick={sendOTP}
    >
      <MdOutlineMail className="inline mb-0.5" />
      <span className="pl-2">{`Email code to ${email}`}</span>
    </Button>
  );
};
export default SignInOTPButton;
