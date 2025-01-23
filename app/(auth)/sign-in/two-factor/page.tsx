import TwoFactorVerification from "@/components/auth/two-factor-verification";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TWO_FACTOR_COOKIE_NAME } from "@/constants";

const Page = async () => {
  const cookieStore = await cookies();
  const twoFactorCookie = cookieStore.get(TWO_FACTOR_COOKIE_NAME)?.value;
  if (!twoFactorCookie) {
    redirect("/sign-in");
  }

  return <TwoFactorVerification />;
};

export default Page;
