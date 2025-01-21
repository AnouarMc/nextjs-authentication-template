"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { providers } from "@/constants";
import { signIn } from "next-auth/react";
import { AccountCustomProps } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddConnectedAccount = ({
  connectedAccounts,
}: {
  connectedAccounts: AccountCustomProps[];
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const unconnectedProviders = providers.filter(
    (item) =>
      !connectedAccounts.some((account) => account.provider === item.provider)
  );

  if (unconnectedProviders.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-0 pl-1 text-primary hover:text-primary/90"
          disabled={isDisabled}
        >
          {isDisabled ? <Loader2 className="animate-spin" /> : <Plus />}
          <span>Connect account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {unconnectedProviders.map((item) => (
          <DropdownMenuItem
            key={item.provider}
            onClick={async () => {
              setIsDisabled(true);
              signIn(item.provider);
            }}
          >
            {item.icon} {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddConnectedAccount;
