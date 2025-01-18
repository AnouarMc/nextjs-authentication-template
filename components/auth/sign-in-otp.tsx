"use client";

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
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { otpSchema, otpSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInOTP = ({ onAlternatives }: { onAlternatives: () => void }) => {
  const { isLoading, setIsLoading } = useAuthContext();

  const form = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting } = form.formState;

  const verifyEmail = form.handleSubmit(async () => {
    // TODO: verify token and signup user and redirect to dashboard
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
  });

  return (
    <AuthCard
      title="Check your email"
      showEmail
      footer={
        <Button variant="link" type="button" onClick={onAlternatives}>
          Use another method
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={verifyEmail} className="space-y-6 text-center">
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
export default SignInOTP;
