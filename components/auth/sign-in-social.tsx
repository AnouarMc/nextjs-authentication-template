import { useLoadingState } from "@/providers/loading-state-provider";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export const providers = [
  { provider: "github" as const, name: "GitHub", icon: <FaGithub /> },
  { provider: "google" as const, name: "Google", icon: <FcGoogle /> },
];

const SignInSocial = () => {
  const { isLoading, setIsLoading } = useLoadingState();
  const [loadingProvider, setLoadingProvider] = useState("");

  const signInWithProvider = async (provider: "google" | "github") => {
    setIsLoading(true);
    setLoadingProvider(provider);
    await signIn(provider);
    setIsLoading(false);
    setLoadingProvider("");
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
          {provider === loadingProvider ? (
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
