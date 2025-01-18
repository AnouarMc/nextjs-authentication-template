import { useAuthContext } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

export const providers = [
  { provider: "github" as const, name: "GitHub", icon: <FaGithub /> },
  { provider: "google" as const, name: "Google", icon: <FcGoogle /> },
];

const SignInSocial = () => {
  const { isLoading, setIsLoading, currentProvider, setCurrentProvider } =
    useAuthContext();

  const signInWithProvider = async (provider: "google" | "github") => {
    setIsLoading(true);
    setCurrentProvider(provider);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsLoading(false);
    setCurrentProvider("");
  };

  return (
    <div className="flex gap-x-2">
      {providers.map(({ name, icon, provider }) => (
        <Button
          key={provider}
          variant="outline"
          className="w-1/2"
          disabled={isLoading}
          onClick={() => signInWithProvider(provider)}
        >
          {provider === currentProvider ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {icon}
              <span>{name}</span>
            </>
          )}
        </Button>
      ))}
    </div>
  );
};
export default SignInSocial;
