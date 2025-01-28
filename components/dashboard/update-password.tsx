"use client";

import FormError from "@/components/auth/form-error";
import { changePassword } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormInput,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, updatePasswordSchemaType } from "@/schemas";

const UpdatePassword = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const form = useForm<updatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, errors } = form.formState;
  const updatePassword = form.handleSubmit(
    async (values: updatePasswordSchemaType) => {
      const { success, errors } = await changePassword(values);
      if (success) {
        form.reset();
        setShowUpdate(false);
      } else {
        errors?.forEach(({ name, message }) => {
          form.setError(name as keyof updatePasswordSchemaType, { message });
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
        <div
          className={cn(
            "flex items-center grow gap-x-4 px-4 transition-opacity duration-300",
            { "opacity-0 pointer-events-none": showUpdate }
          )}
        >
          <div>••••••••••</div>

          <Button
            variant="ghost"
            className="ml-auto text-primary hover:text-primary/90"
            onClick={() => setShowUpdate(true)}
          >
            Update Password
          </Button>
        </div>

        <DashboardCard title="Update password" isVisible={showUpdate}>
          <Form {...form}>
            <form
              onSubmit={updatePassword}
              className="space-y-6 text-left mt-4"
            >
              <FormError message={errors.root?.message} />
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel disabled={isSubmitting}>
                      Current password
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        {...field}
                        type="password"
                        autoFocus
                        disabled={isSubmitting}
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
                    <FormLabel disabled={isSubmitting}>New password</FormLabel>
                    <FormControl>
                      <FormInput
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
                    <FormLabel disabled={isSubmitting}>
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <FormInput
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
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DashboardCard>
      </div>
    </div>
  );
};
export default UpdatePassword;
