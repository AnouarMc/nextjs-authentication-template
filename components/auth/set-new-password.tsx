"use client";

import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import { resetPassword } from "@/actions/password-reset";
import { useAuthContext } from "@/providers/auth-provider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/schemas";

const SetNewPassword = ({ otpCode }: { otpCode: string }) => {
  const { email } = useAuthContext();
  const form = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (passwords: resetPasswordSchemaType) => {
    const { success, errors } = await resetPassword(email, otpCode, passwords);
    if (!success) {
      console.log("yeah it is not working");
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof resetPasswordSchemaType, { message })
      );
    }
  };

  return (
    <AuthCard
      title="Set new password"
      footer={
        <Button variant="link" disabled={isSubmitting} asChild>
          <Link href="/sign-in/password">Back</Link>
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-left mt-4"
        >
          <FormError message={errors.root?.message} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default SetNewPassword;
