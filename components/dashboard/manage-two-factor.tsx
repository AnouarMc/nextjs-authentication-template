"use client";

import BackupCodes from "@/components/dashboard/backup-codes";
import AddTwoFactor from "@/components/dashboard/add-two-factor";
import RemoveTwoFactor from "@/components/dashboard/remove-two-factor";

import { useState } from "react";

const ManageTwoFactor = ({
  twoFactorEnabled,
}: {
  twoFactorEnabled: boolean;
}) => {
  const [firstTimeBackups, setFirstTimeBackups] = useState<string[]>([]);

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row mt-2">
      <div className="mb-4 md:mb-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-48">
          Two-step verification
        </h2>
      </div>

      <div className="grow overflow-hidden">
        {twoFactorEnabled ? (
          <>
            <RemoveTwoFactor />
            <BackupCodes firstTimeBackups={firstTimeBackups} />
          </>
        ) : (
          <AddTwoFactor
            onSuccess={(backupCodes) => setFirstTimeBackups(backupCodes)}
          />
        )}
      </div>
    </div>
  );
};
export default ManageTwoFactor;
