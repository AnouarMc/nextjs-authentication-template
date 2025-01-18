"use client";

import Logo from "@/components/logo";
import { useAuthContext } from "@/providers/auth-provider";
import SignInSocial from "@/components/auth/sign-in-social";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Welcome! Please fill in the details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>

      <CardFooter className="justify-center">
        <CardDescription>Already have an account?</CardDescription>
        <Button variant="link" asChild className="px-1 mx-1">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default SignUpForm;
