import Profile from "@/components/dashboard/profile";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6 ">
      <Profile user={session.user} />
    </div>
  );
};
export default Page;
