"use client";

import { validateCreds } from "@/actions/signup";
import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import { useAuthContext } from "@/providers/auth-provider";
import SignInSocial from "@/components/auth/sign-in-social";
import { useLoadingState } from "@/providers/loading-state-provider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormInput,
} from "@/components/ui/form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDescription } from "@/components/ui/card";
import { signupSchema, signupSchemaType } from "@/schemas";

const SignUpForm = () => {
  const { email, setEmail, setPassword } = useAuthContext();
  const { isLoading, setIsLoading } = useLoadingState();
  const router = useRouter();

  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email,
      password: "",
    },
  });
  const { isSubmitting, errors } = form.formState;

  const checkEmailAvailable = form.handleSubmit(
    async (credentials: signupSchemaType) => {
      setIsLoading(true);
      const { success, errors } = await validateCreds(credentials);
      if (success) {
        setEmail(form.getValues("email"));
        setPassword(form.getValues("password"));
        router.push("/sign-up/verify-email-address");
      } else {
        errors?.forEach(({ name, message }) =>
          form.setError(name as keyof signupSchemaType, { message })
        );
      }
      setIsLoading(false);
    }
  );

  return (
    <AuthCard
      title="Create your account"
      subtitle="Welcome! Please fill in the details to get started"
      footer={<Footer />}
    >
      <SignInSocial />
      <div className="flex items-center gap-x-4 pt-6 pb-4">
        <Separator className="shrink" />
        <span className="text-sm text-gray-500">or</span>
        <Separator className="shrink" />
      </div>
      <Form {...form}>
        <form onSubmit={checkEmailAvailable} className="space-y-5 text-left">
          <FormError message={errors.root?.message} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel disabled={isLoading}>Email Address</FormLabel>
                <FormControl>
                  <FormInput
                    autoFocus
                    disabled={isLoading}
                    {...field}
                    data-cy="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel disabled={isLoading}>Password</FormLabel>
                <FormControl>
                  <FormInput
                    disabled={isLoading}
                    {...field}
                    type="password"
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
            data-cy="signup-button"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default SignUpForm;

const Footer = () => {
  return (
    <>
      <CardDescription>Already have an account?</CardDescription>
      <Button variant="link" asChild className="px-1 mx-1">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </>
  );
};
