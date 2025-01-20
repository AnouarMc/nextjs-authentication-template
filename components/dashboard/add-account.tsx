import FormError from "@/components/auth/form-error";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  emailSchema,
  emailSchemaType,
  otpSchema,
  otpSchemaType,
} from "@/schemas";
import { Input } from "../ui/input";
import VerificationCountdown from "../auth/verification-countdown";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import AuthProvider from "@/providers/auth-provider";
import LoadingStateProvider from "@/providers/loading-state-provider";

const Content = () => {
  const [step, setStep] = useState<"link" | "email" | "verification">("link");

  const emailForm = useForm<emailSchemaType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting: emailIsSubmitting, errors: emailErrors } =
    emailForm.formState;
  const checkEmailExist = emailForm.handleSubmit(
    async (email: emailSchemaType) => {
      console.log(email);
      setStep("verification");
    }
  );

  const otpForm = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting: otpIsSubmitting, errors: otpErrors } =
    otpForm.formState;

  const verifyEmail = otpForm.handleSubmit(async (otpCode: otpSchemaType) => {
    console.log(otpCode);
  });

  switch (true) {
    case step === "link":
      return (
        <Button
          variant="ghost"
          className="w-full justify-start px-0 pl-1 text-primary hover:text-primary/90"
          onClick={() => setStep("email")}
        >
          <Plus />
          <span>Add email address</span>
        </Button>
      );
    case step === "email":
      return (
        <DashboardCard
          title="Add email address"
          subtitle="An email containing a verification code will be sent to this email address"
        >
          <Form {...emailForm}>
            <form onSubmit={checkEmailExist} className="space-y-6 text-left">
              <FormError message={emailErrors.root?.message} />
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        {...field}
                        disabled={emailIsSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-x-2 justify-end mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={emailIsSubmitting}
                  onClick={() => {
                    emailForm.setValue("email", "");
                    emailForm.clearErrors();
                    setStep("link");
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={emailIsSubmitting}>
                  {emailIsSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DashboardCard>
      );
    case step === "verification":
      return (
        <DashboardCard
          title="Verify email address"
          subtitle={`Enter the verification code sent to ${emailForm.getValues(
            "email"
          )}`}
        >
          <div className="text-center">
            <Form {...otpForm}>
              <form onSubmit={verifyEmail} className="space-y-6 text-center">
                <FormError message={otpErrors.root?.message} />
                <FormField
                  control={otpForm.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col items-center mt-4">
                        <FormControl>
                          <InputOTP
                            autoFocus
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            disabled={otpIsSubmitting}
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

                <div className="flex gap-x-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={otpIsSubmitting}
                    onClick={() => {
                      otpForm.setValue("otpCode", "");
                      otpForm.clearErrors();
                      setStep("email");
                    }}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={otpIsSubmitting}>
                    {otpIsSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DashboardCard>
      );
  }
};

const AddAccount = () => {
  return (
    <AuthProvider>
      <LoadingStateProvider>
        <Content />
      </LoadingStateProvider>
    </AuthProvider>
  );
};
export default AddAccount;
