"use client";

import FormError from "@/components/auth/form-error";
import { removeTwoFactor } from "@/actions/two-factor";
import { revalidateDashboard } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Ellipsis, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const RemoveTwoFactor = () => {
  const [showRemove, setShowRemove] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  const onRemove = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { success, errors } = await removeTwoFactor();
    if (success) {
      setShowRemove(false);
      await revalidateDashboard();
    } else {
      setError(errors?.[0].message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row  mt-2">
      <div className="grow overflow-hidden">
        <div className="flex items-center gap-x-2 px-4">
          <Key className="w-4 h-4" />
          <span>Authenticator application</span>

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
              <DropdownMenuItem
                onClick={() => setShowRemove(true)}
                className="text-destructive hover:!text-destructive"
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DashboardCard
          title="Remove two-step verification"
          subtitle="Your account may not be as secure. Are you sure you want to continue?"
          isVisible={showRemove}
        >
          <FormError message={error} />
          <form onSubmit={onRemove} className="flex gap-x-2 justify-end mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setError("");
                setShowRemove(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
          </form>
        </DashboardCard>
      </div>
    </div>
  );
};
export default RemoveTwoFactor;
