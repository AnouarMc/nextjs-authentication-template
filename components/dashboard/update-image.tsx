import FormError from "@/components/auth/form-error";
import UserAvatar from "@/components/dashboard/user-avatar";
import { useLoadingState } from "@/providers/loading-state-provider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { User } from "next-auth";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageSchema, imageSchemaType } from "@/schemas";
import { useRef, useImperativeHandle, useState } from "react";
import { acceptedImageTypes, maxFileSizeText } from "@/constants";
import {
  revalidateDashboard,
  updateProfileImage,
} from "@/actions/manage-account";

const UpdateImage = ({ user }: { user: User }) => {
  const { isLoading, setIsLoading } = useLoadingState();
  const [imgLoadingState, setImgLoadingState] = useState<
    "" | "upload" | "remove"
  >("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<imageSchemaType>({
    resolver: zodResolver(imageSchema),
  });

  const { ref, ...rest } = form.register("image");
  const { errors } = form.formState;
  useImperativeHandle(ref, () => fileInputRef.current);

  const onRemove = async () => {
    setIsLoading(true);
    setImgLoadingState("remove");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
    setImgLoadingState("");
  };

  const onUpload = form.handleSubmit(async (image) => {
    setIsLoading(true);
    setImgLoadingState("upload");
    const { success, errors } = await updateProfileImage(image);
    if (success) {
      await revalidateDashboard();
    } else {
      errors?.forEach(({ name, message }) =>
        form.setError(name as keyof imageSchemaType, { message })
      );
    }
    setIsLoading(false);
    setImgLoadingState("");
  });

  return (
    <>
      <div className="flex gap-x-4">
        <UserAvatar user={user} />
        <Form {...form}>
          <form onChange={onUpload}>
            <div className="flex gap-x-2">
              <Button
                className="dark:bg-gray-800 dark:hover:bg-gray-800/60"
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                {imgLoadingState === "upload" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Upload"
                )}
              </Button>

              {user.image && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:!text-destructive"
                  onClick={onRemove}
                  disabled={isLoading}
                >
                  {imgLoadingState === "remove" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Remove"
                  )}
                </Button>
              )}
            </div>

            <FormField
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...rest}
                      type="file"
                      accept={acceptedImageTypes.join(",")}
                      className="hidden"
                      ref={fileInputRef}
                      data-cy="image-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm mt-1 text-gray-500">
              Recommended size 1:1, up to {maxFileSizeText}
            </p>
          </form>
        </Form>
      </div>
      <FormError message={errors.root?.message} className="mt-2" />
    </>
  );
};
export default UpdateImage;
