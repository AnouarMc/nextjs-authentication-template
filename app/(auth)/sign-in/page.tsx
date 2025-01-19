import SignInEmail from "@/components/auth/sign-in-email";
import LoadingStateProvider from "@/providers/loading-state-provider";

const Page = () => {
  return (
    <LoadingStateProvider>
      <SignInEmail />
    </LoadingStateProvider>
  );
};
export default Page;
