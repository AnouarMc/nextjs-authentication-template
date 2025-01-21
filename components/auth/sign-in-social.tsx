import { useLoadingState } from "@/providers/loading-state-provider";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { providers } from "@/constants";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

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
