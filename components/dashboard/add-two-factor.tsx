"use client";

import FormError from "@/components/auth/form-error";
import DashboardCard from "@/components/dashboard/dashboard-card";

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
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { otpSchema, otpSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { getQrCode, verifyQrCode } from "@/actions/two-factor";
import { revalidateDashboard } from "@/actions/manage-account";

const AddTwoFactor = ({
  onSuccess,
}: {
  onSuccess: (codes: string[]) => void;
}) => {
  const [step, setStep] = useState<"link" | "qr" | "verification">("link");
  const [qrCode, setQrCode] = useState({
    data: "",
    secret: "",
  });

  const form = useForm<otpSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });
  const { isSubmitting, errors } = form.formState;

  const getTwoFactorQRCode = async () => {
    setStep("qr");
    const { success, errors, data } = await getQrCode();
    if (success && data) {
      setQrCode(data);
    } else {
      toast.error(errors?.[0].message);
    }
  };

  const verifyTwoFactorCode = form.handleSubmit(async (otpCode) => {
    const { success, errors, backupCodes } = await verifyQrCode(
      otpCode,
      qrCode.secret
    );
    if (success && backupCodes !== null) {
      setStep("link");
      onSuccess(backupCodes);
      await revalidateDashboard();
    } else {
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof otpSchemaType, { message })
      );
    }
  });

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-0 pl-1 text-primary hover:text-primary/90 transition-opacity duration-300",
          { "opacity-0 pointer-events-none": step !== "link" }
        )}
        onClick={getTwoFactorQRCode}
      >
        <Plus />
        <span>Add two-step verification</span>
      </Button>

      <DashboardCard
        title="Add authenticator application"
        subtitle="Set up a new sign-in method by scanning this QR code in your authenticator app"
        isVisible={step === "qr"}
      >
        <div>
          {qrCode.data ? (
            <Image
              className="mx-auto"
              src={qrCode.data}
              width={200}
              height={200}
              alt="qr code"
            />
          ) : (
            <div className="w-[200px] h-[200px] flex justify-center items-center rounded-md bg-gray-400 mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex gap-x-2 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={() => setStep("link")}>
            Cancel
          </Button>
          <Button type="submit" onClick={() => setStep("verification")}>
            Continue
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard
        title="Add authenticator application"
        isVisible={step === "verification"}
      >
        <div className="text-center mt-4">
          <Form {...form}>
            <form
              onSubmit={verifyTwoFactorCode}
              className="space-y-6 text-center"
            >
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
                          onComplete={verifyTwoFactorCode}
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

              <div className="flex gap-x-2 justify-end mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  onClick={() => {
                    form.reset();
                    setStep("link");
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DashboardCard>
    </>
  );
};
export default AddTwoFactor;
