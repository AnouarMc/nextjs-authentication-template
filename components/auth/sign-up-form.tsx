"use client";

import AuthCard from "@/components/auth/auth-card";
import { useAuthContext } from "@/providers/auth-provider";
import SignInSocial from "@/components/auth/sign-in-social";

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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDescription } from "@/components/ui/card";
import { signupSchema, signupSchemaType } from "@/schemas";

const SignUpForm = () => {
  const { setEmail, isLoading, setIsLoading } = useAuthContext();
  const router = useRouter();

  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const checkEmailAvailable = form.handleSubmit(async () => {
    // TODO: check if email available redirect to verification route
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setEmail(form.getValues("email"));
    router.push("/sign-up/verify-email-address");
    setIsLoading(false);
  });

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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input autoFocus disabled={isLoading} {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} type="password" />
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
