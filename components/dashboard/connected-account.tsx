import FormError from "@/components/auth/form-error";
import { removeAccount } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { providers } from "@/constants";
import { AccountCustomProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, Ellipsis } from "lucide-react";

const Account = ({
  account: { provider, email },
}: {
  account: AccountCustomProps;
}) => {
  const [showRemove, setShowRemove] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  const onRemove = async () => {
    setIsSubmitting(true);
    const { success, errors } = await removeAccount(email, provider);
    if (!success) {
      setError(errors?.[0].message);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center gap-x-2" key={provider}>
        <div className="w-4 shrink-0">
          {providers.find((item) => item.provider === provider)?.icon}
        </div>
        <div>{providers.find((item) => item.provider === provider)?.name}</div>
        <div className="text-muted-foreground text-xs overflow-hidden text-ellipsis">
          {email}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            asChild
          >
            <Button size="sm" variant="ghost" className="ml-auto">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => setShowRemove(true)}
              className="text-destructive hover:!text-destructive"
            >
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {showRemove && (
        <DashboardCard
          title="Remove connected account"
          subtitle={`${provider} will be removed from this account`}
        >
          <div className="text-sm text-gray-500">
            You will no longer be able to use this connected account and any
            dependent features will no longer work.
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
      )}
    </div>
  );
};
export default Account;
