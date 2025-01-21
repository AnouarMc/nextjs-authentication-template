"use client";

import FormError from "@/components/auth/form-error";
import { logOut, removeUser } from "@/actions/manage-account";
import DashboardCard from "@/components/dashboard/dashboard-card";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DeleteUser = () => {
  const [showRemove, setShowRemove] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [data, setData] = useState("");

  const onRemove = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { success, errors } = await removeUser();
    if (success) {
      await logOut();
    } else {
      setError(errors?.[0].message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row  mt-2">
      <div className="mb-4 md:mb-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-48">
          Delete Account
        </h2>
      </div>
      <div className="grow overflow-hidden">
        {!showRemove ? (
          <Button
            onClick={() => setShowRemove(true)}
            variant="ghost"
            className="text-destructive hover:!text-destructive"
          >
            Delete Account
          </Button>
        ) : (
          <DashboardCard
            title="Delete account"
            subtitle="Are you sure you want to delete your account?"
          >
            <div className="text-destructive mb-4 -mt-3 text-sm">
              This action is permanent and irreversible
            </div>
            <FormError message={error} />

            <div className="text-sm mb-2">
              Type &quot;Delete account&quot; below to continue
            </div>
            <Input
              autoFocus
              value={data}
              onChange={(e) => setData(e.currentTarget.value)}
            />

            <form onSubmit={onRemove} className="flex gap-x-2 justify-end mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setError("");
                  setData("");
                  setShowRemove(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isSubmitting || data !== "Delete account"}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Delete"}
              </Button>
            </form>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};
export default DeleteUser;
