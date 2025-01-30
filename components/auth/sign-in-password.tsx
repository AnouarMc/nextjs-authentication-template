"use client";

import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import { signInWithPassword } from "@/actions/signin";
import { useAuthContext } from "@/providers/auth-provider";
import { useLoadingState } from "@/providers/loading-state-provider";

import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, passwordSchemaType } from "@/schemas";

const SignInPassword = ({
  onAlternatives,
  onForgotPassword,
}: {
  onAlternatives: () => void;
  onForgotPassword: () => void;
}) => {
  const { email, setPassword } = useAuthContext();
  const { isLoading, setIsLoading } = useLoadingState();
  const form = useForm<passwordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { isSubmitting, errors } = form.formState;

  const handleSignIn = form.handleSubmit(async ({ password }) => {
    setIsLoading(true);
    setPassword(password);
    const { success, errors } = await signInWithPassword({ email, password });
    if (!success) {
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof passwordSchemaType, { message })
      );
    }
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
          <FormError message={errors.root?.message} />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel disabled={isLoading}>Password</FormLabel>
                  <Button
                    className="h-4 p-0"
                    variant="link"
                    type="button"
                    onClick={onForgotPassword}
                    data-cy="forgot-password"
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <FormInput
                    type="password"
                    {...field}
                    autoFocus
                    disabled={isLoading}
                    data-cy="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="magic"
            className="w-full"
            type="submit"
            disabled={isLoading}
            data-cy="next"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default SignInPassword;
