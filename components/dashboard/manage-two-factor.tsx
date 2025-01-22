"use client";

import AddTwoFactor from "@/components/dashboard/add-two-factor";
import RemoveTwoFactor from "@/components/dashboard/remove-two-factor";

const ManageTwoFactor = ({
  twoFactorEnabled,
}: {
  twoFactorEnabled: boolean;
}) => {
  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row mt-2">
      <div className="mb-4 md:mb-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-48">
          Two-step verification
        </h2>
      </div>

      <div className="grow overflow-hidden">
        {twoFactorEnabled ? <RemoveTwoFactor /> : <AddTwoFactor />}
      </div>
    </div>
  );
};
export default ManageTwoFactor;
