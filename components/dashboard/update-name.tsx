import {
  revalidateDashboard,
  updateProfileName,
} from "@/actions/manage-account";
import FormError from "@/components/auth/form-error";
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
import { User } from "next-auth";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const UpdateName = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const { isLoading, setIsLoading } = useLoadingState();

  const form = useForm<{ name: string }>({
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onUpdate = form.handleSubmit(async ({ name }) => {
    setIsLoading(true);
    const { success, errors } = await updateProfileName(name);
    if (success) {
      await revalidateDashboard();
      onClose();
    } else {
      errors?.forEach(({ name, message }) => {
        form.setError(name as keyof { name: string }, { message });
      });
    }
    setIsLoading(false);
  });

  return (
    <Form {...form}>
      <form onSubmit={onUpdate} className="mt-6 text-left">
        <FormError message={errors.root?.message} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel disabled={isLoading}>Name</FormLabel>
              <FormControl>
                <FormInput
                  autoFocus
                  {...field}
                  disabled={isLoading}
                  data-cy="user-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-2 justify-end mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || form.getValues("name") === user.name}
            data-cy="update-user-name"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateName;
