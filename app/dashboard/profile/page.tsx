import { getAccountsByUserId } from "@/data/account";
import Profile from "@/components/dashboard/profile";
import Accounts from "@/components/dashboard/accounts";
import ConnectedAccounts from "@/components/dashboard/connected-accounts";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const accounts = await getAccountsByUserId(session?.user?.id);
  const distinctEmails = Array.from(
    new Map(accounts.map((account) => [account.email, account])).values()
  );
  const connectedAccounts = accounts.filter(
    (account) => account.provider !== "email"
  );

  return (
    <div className="space-y-6">
      <Profile user={session.user} />
      <Separator />
      <Accounts accounts={distinctEmails} />
      <Separator />
      <ConnectedAccounts accounts={connectedAccounts} />
    </div>
  );
};
export default Page;
