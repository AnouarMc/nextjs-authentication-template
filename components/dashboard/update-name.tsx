import FormError from "@/components/auth/form-error";
import { useLoadingState } from "@/providers/loading-state-provider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "next-auth";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdateName = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const { isLoading, setIsLoading } = useLoadingState();

  const form = useForm({
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onUpdate = form.handleSubmit(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    onClose();
  });

  return (
    <Form {...form}>
      <form onSubmit={onUpdate} className="mt-6 space-y-6 text-left">
        <FormError message={errors.root?.message} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoFocus {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-x-2 justify-end">
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
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateName;
