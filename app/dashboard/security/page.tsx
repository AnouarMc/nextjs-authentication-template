import DeleteUser from "@/components/dashboard/delete-user";
import SetPassword from "@/components/dashboard/set-password";
import UpdatePassword from "@/components/dashboard/update-password";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ManageTwoFactor from "@/components/dashboard/manage-two-factor";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { hasPassword } = session.user;
  return (
    <div className="space-y-6">
      {hasPassword ? <UpdatePassword /> : <SetPassword />}
      <Separator />
      <ManageTwoFactor twoFactorEnabled={session.user.twoFactorEnabled} />
      <Separator />
      <DeleteUser />
    </div>
  );
};
export default Page;
