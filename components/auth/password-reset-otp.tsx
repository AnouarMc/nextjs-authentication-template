"use client";

import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import { verifyOTPCode } from "@/actions/verification";
import { useAuthContext } from "@/providers/auth-provider";
import VerificationCountdown from "@/components/auth/verification-countdown";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { otpSchema, otpSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

const PasswordResetOTP = ({
  onVerificationSuccess,
  onBackLinkClicked,
}: {
  onVerificationSuccess: (otpCode: string) => void;
  onBackLinkClicked: () => void;
}) => {
  const { email } = useAuthContext();
  const form = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting, errors } = form.formState;

  const verifyEmail = form.handleSubmit(async ({ otpCode }) => {
    const { success, errors } = await verifyOTPCode(email, otpCode);
    if (success) {
      onVerificationSuccess(otpCode);
    } else {
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof otpSchemaType, { message })
      );
    }
  });

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter the verification code sent to your email"
      showEmail
      footer={
        <Button
          variant="link"
          onClick={onBackLinkClicked}
          disabled={isSubmitting}
        >
          Back
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={verifyEmail} className="space-y-6 text-center">
          <FormError message={errors.root?.message} />
          <FormField
            control={form.control}
            name="otpCode"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP
                      autoFocus
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      disabled={isSubmitting}
                      onComplete={verifyEmail}
                      {...field}
                    >
                      {[...Array(6)].map((_, index) => (
                        <InputOTPGroup key={index}>
                          <InputOTPSlot index={index} />
                        </InputOTPGroup>
                      ))}
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="mt-4" />
                </div>
                <VerificationCountdown />
              </FormItem>
            )}
          />

          <Button
            variant="magic"
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default PasswordResetOTP;
