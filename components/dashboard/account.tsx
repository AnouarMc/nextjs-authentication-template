import {
  removeAccount,
  revalidateDashboard,
  setEmailAsPrimary,
} from "@/actions/manage-account";
import FormError from "@/components/auth/form-error";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { AccountCustomProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Ellipsis } from "lucide-react";

const Account = ({
  account: { email, isPrimary },
}: {
  account: AccountCustomProps;
}) => {
  const [showRemove, setShowRemove] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  const onRemove = async () => {
    setIsSubmitting(true);
    const { success, errors } = await removeAccount(email);
    if (success) {
      if (isPrimary) await revalidateDashboard();
    } else {
      setError(errors?.[0].message);
    }
    setIsSubmitting(false);
  };

  const updatePrimaryEmail = async () => {
    const { success, errors } = await setEmailAsPrimary(email);
    if (success) {
      await revalidateDashboard();
    } else {
      toast.error(errors?.[0].message);
    }
  };

  return (
    <>
      <div className="flex items-center flex-row grow overflow-hidden gap-x-2">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {email}
        </div>
        {isPrimary && (
          <Badge variant="secondary" className="border border-gray-700/50">
            Primary
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-auto"
            asChild
          >
            <Button size="sm" variant="ghost" className="ml-auto">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!isPrimary && (
              <DropdownMenuItem onClick={updatePrimaryEmail}>
                Set as primary
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowRemove(true)}
              className="text-destructive hover:!text-destructive"
            >
              Remove email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DashboardCard
        title="Remove email address"
        subtitle={`${email} will be removed from this account`}
        isVisible={showRemove}
      >
        <div className="text-sm text-gray-500">
          You will no longer be able to sign in using this email address.
        </div>
        <FormError message={error} className="mt-4" />
        <div className="flex gap-x-2 justify-end mt-4">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => {
              setError("");
              setShowRemove(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            type="submit"
            disabled={isSubmitting}
            onClick={onRemove}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Remove"}
          </Button>
        </div>
      </DashboardCard>
    </>
  );
};
export default Account;
