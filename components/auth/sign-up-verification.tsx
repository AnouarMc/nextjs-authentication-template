"use client";

import Logo from "@/components/logo";
import { useEmail } from "@/providers/email-provider";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const SignUpVerification = () => {
  const { email } = useEmail();
  const router = useRouter();

  const form = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting } = form.formState;

  const verifyEmail = form.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // TODO: verify token and signup user and redirect to dashboard
  });

  return (
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email
        </CardDescription>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
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
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>

            <Button
              className="mt-4"
              variant="link"
              type="button"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SignUpVerification;
