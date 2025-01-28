import { validateCreds } from "@/actions/signup";
import FormError from "@/components/auth/form-error";
import { addAccount } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";
import LoadingStateProvider from "@/providers/loading-state-provider";
import AuthProvider, { useAuthContext } from "@/providers/auth-provider";
import VerificationCountdown from "@/components/auth/verification-countdown";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormInput,
} from "@/components/ui/form";
import {
  emailSchema,
  emailSchemaType,
  otpSchema,
  otpSchemaType,
} from "@/schemas";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

const Content = () => {
  const [step, setStep] = useState<"link" | "email" | "verification">("link");
  const { email, setEmail } = useAuthContext();

  const emailForm = useForm<emailSchemaType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting: emailIsSubmitting, errors: emailErrors } =
    emailForm.formState;
  const checkEmailExist = emailForm.handleSubmit(
    async (emailSchema: emailSchemaType) => {
      const { success, errors } = await validateCreds(emailSchema);
      if (success) {
        setEmail(emailSchema.email);
        setStep("verification");
      } else {
        errors?.forEach(({ name, message }) => {
          emailForm.setError(name as keyof emailSchemaType, { message });
        });
      }
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
    const { success, errors } = await addAccount(email, otpCode);
    if (success) {
      setStep("link");
    } else {
      errors?.forEach(({ name, message }) =>
        otpForm.setError(name as keyof otpSchemaType, { message })
      );
    }
  });

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-0 pl-1 text-primary hover:text-primary",
          {
            "opacity-0 pointer-events-none": step !== "link",
          }
        )}
        onClick={() => setStep("email")}
      >
        <Plus />
        <span>Add email address</span>
      </Button>

      <DashboardCard
        title="Add email address"
        subtitle="An email containing a verification code will be sent to this email address"
        isVisible={step === "email"}
      >
        <Form {...emailForm}>
          <form onSubmit={checkEmailExist} className="space-y-6 text-left">
            <FormError message={emailErrors.root?.message} />
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel disabled={emailIsSubmitting}>
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <FormInput
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

      <DashboardCard
        title="Verify email address"
        subtitle={`Enter the verification code sent to ${email}`}
        isVisible={step === "verification"}
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
    </>
  );
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
