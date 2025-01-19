"use client";

import { signup } from "@/actions/signup";
import AuthCard from "@/components/auth/auth-card";
import { useAuthContext } from "@/providers/auth-provider";

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
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { otpSchema, otpSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoadingState } from "@/providers/loading-state-provider";

const SignUpVerification = () => {
  const { email, password } = useAuthContext();
  const { isLoading, setIsLoading } = useLoadingState();
  const router = useRouter();

  const form = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting } = form.formState;

  const finalizeSignup = form.handleSubmit(async (code: otpSchemaType) => {
    setIsLoading(true);
    const { success, errors } = await signup({ email, password }, code);
    if (success) {
      router.push("/dashboard/profile");
    } else {
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof otpSchemaType, { message })
      );
    }
    setIsLoading(false);
  });

  return (
    <AuthCard
      title="Verify your email"
      subtitle="Enter the verification code sent to your email"
      showEmail
      footer={
        <Button variant="link" onClick={() => router.back()}>
          Back
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={finalizeSignup} className="space-y-6 text-center">
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
                      disabled={isLoading}
                      onComplete={finalizeSignup}
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
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default SignUpVerification;
