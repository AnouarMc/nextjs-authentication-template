import SetPassword from "@/components/dashboard/set-password";
import UpdatePassword from "@/components/dashboard/update-password";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { hasPassword } = session.user;
  return <div>{hasPassword ? <UpdatePassword /> : <SetPassword />}</div>;
};
export default Page;
