"use client";

import ConnectedAccount from "@/components/dashboard/connected-account";
import AddConnectedAccount from "@/components/dashboard/add-connected-account";
import { AccountCustomProps } from "@/types";

const ConnectedAccounts = ({
  accounts,
}: {
  accounts: AccountCustomProps[];
}) => {
  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row mt-2">
      <div className="mb-4 md:mb-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-48">
          Connected accounts
        </h2>
      </div>
      <div className="grow overflow-hidden">
        {accounts.map((account) => (
          <ConnectedAccount key={account.provider} account={account} />
        ))}

        <AddConnectedAccount connectedAccounts={accounts} />
      </div>
    </div>
  );
};
export default ConnectedAccounts;
