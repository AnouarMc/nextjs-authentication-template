"use client";

import FormError from "@/components/auth/form-error";
import { changePassword } from "@/actions/manage-account";
import { revalidateDashboard } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/schemas";

const SetPassword = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const form = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, errors } = form.formState;
  const setPassword = form.handleSubmit(
    async (passwords: resetPasswordSchemaType) => {
      const { success, errors } = await changePassword(passwords);
      if (success) {
        await revalidateDashboard();
        form.reset();
        setShowUpdate(false);
      } else {
        errors?.forEach(({ name, message }) => {
          form.setError(name as keyof resetPasswordSchemaType, { message });
        });
      }
    }
  );

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row  mt-2">
      <div className="mb-4 md:mb-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-48">
          Password
        </h2>
      </div>
      <div className="grow overflow-hidden">
        {!showUpdate ? (
          <div className="flex items-center grow gap-x-4 px-4">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/90"
              onClick={() => setShowUpdate(true)}
            >
              Set password
            </Button>
          </div>
        ) : (
          <DashboardCard title="Set password">
            <Form {...form}>
              <form onSubmit={setPassword} className="space-y-6 text-left mt-4">
                <FormError message={errors.root?.message} />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          type="password"
                        />
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
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-x-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowUpdate(false);
                      form.reset();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};
export default SetPassword;
