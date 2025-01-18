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
import { emailSchema, emailSchemaType } from "@/schemas";

const SignInEmail = () => {
  const { setEmail, isLoading, setIsLoading } = useAuthContext();
  const router = useRouter();

  const form = useForm<emailSchemaType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { isSubmitting } = form.formState;

  const checkEmailExist = form.handleSubmit(async () => {
    // TODO: check if email exist redirect to password route or otp route
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setEmail(form.getValues("email"));
    router.push("/sign-in/password");
    //router.push("/sign-in/otp");
    setIsLoading(false);
  });

  return (
    <AuthCard
      title="Sign in to Acme Inc"
      subtitle="Welcome back! Please sign in to continue"
      footer={<Footer />}
    >
      <SignInSocial />
      <div className="flex items-center gap-x-4 pt-6 pb-4">
        <Separator className="shrink" />
        <span className="text-sm text-gray-500">or</span>
        <Separator className="shrink" />
      </div>
      <Form {...form}>
        <form onSubmit={checkEmailExist} className="space-y-5 text-left">
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

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
export default SignInEmail;

const Footer = () => {
  return (
    <>
      <CardDescription>Don&apos;t have an account?</CardDescription>
      <Button variant="link" asChild className="px-1 mx-1">
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </>
  );
};
