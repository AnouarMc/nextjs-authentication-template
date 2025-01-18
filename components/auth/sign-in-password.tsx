"use client";

import AuthCard from "@/components/auth/auth-card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, passwordSchemaType } from "@/schemas";
import { useAuthContext } from "@/providers/auth-provider";

const SignInPassword = ({
  onAlternatives,
  onForgotPassword,
}: {
  onAlternatives: () => void;
  onForgotPassword: () => void;
}) => {
  const { isLoading, setIsLoading } = useAuthContext();
  const form = useForm<passwordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const handleSignIn = form.handleSubmit(async () => {
    // TODO: check if password match redirect to dashboard
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
  });

  return (
    <AuthCard
      title="Enter your password"
      subtitle="Enter the password associated with your account"
      showEmail
      footer={
        <Button variant="link" type="button" onClick={onAlternatives}>
          Use another method
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={handleSignIn} className="space-y-5 text-left">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button
                    className="h-4 p-0"
                    variant="link"
                    type="button"
                    onClick={onForgotPassword}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <Input
                    autoFocus
                    disabled={isLoading}
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
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
export default SignInPassword;
