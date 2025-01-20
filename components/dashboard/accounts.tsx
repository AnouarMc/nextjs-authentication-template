"use client";

import Account from "@/components/dashboard/account";
import AddAccount from "@/components/dashboard/add-account";

import { AccountCustomProps } from "@/types";

const Accounts = ({ accounts }: { accounts: AccountCustomProps[] }) => {
  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row">
      <div className="shrink-0 w-48">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Accounts
        </h2>
      </div>
      <div className="grow overflow-hidden">
        {accounts.map((account) => (
          <Account key={account.email} account={account} />
        ))}
        <AddAccount />
      </div>
    </div>
  );
};
export default Accounts;
