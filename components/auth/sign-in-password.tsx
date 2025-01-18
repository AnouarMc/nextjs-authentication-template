"use client";

import Logo from "@/components/logo";

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
  const { email, isLoading, setIsLoading } = useAuthContext();
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
    <Card className="w-[360px] max-w-full mx-auto mb-24 text-center shadow-xl">
      <CardHeader>
        <Logo className="mx-auto mb-6 mt-2" width={64} />
        <CardTitle>Enter your password</CardTitle>
        <CardDescription>
          Enter the password associated with your account
        </CardDescription>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>

      <CardFooter className="justify-center">
        <Button variant="link" type="button" onClick={onAlternatives}>
          Use another method
        </Button>
      </CardFooter>
    </Card>
  );
};
export default SignInPassword;
