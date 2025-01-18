"use client";

import Logo from "@/components/logo";
import { useAuthContext } from "@/providers/auth-provider";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, emailSchemaType } from "@/schemas";
import SignInSocial from "./sign-in-social";
import { Separator } from "../ui/separator";

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
    //router.push("/sign-in/password");
    router.push("/sign-in/otp");
    setIsLoading(false);
  });

  return (
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Sign in to Acme Inc</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
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
      </CardContent>

      <CardFooter className="justify-center">
        <CardDescription>Don&apos;t have an account?</CardDescription>
        <Button variant="link" asChild className="px-1 mx-1">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default SignInEmail;
