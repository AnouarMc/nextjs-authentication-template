"use client";

import Logo from "@/components/logo";
import { useAuthContext } from "@/providers/auth-provider";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  showEmail?: boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const AuthCard = ({
  title,
  subtitle,
  showEmail,
  children,
  footer,
}: AuthCardProps) => {
  const { email } = useAuthContext();

  return (
    <div className="pb-24">
      <Card className="w-[360px] max-w-full mx-auto text-center shadow-xl">
        <CardHeader>
          <Logo className="mx-auto mb-6 mt-2" width={64} />
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
          {showEmail && <CardDescription>{email}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>

        <CardFooter className="justify-center">{footer}</CardFooter>
      </Card>
    </div>
  );
};
export default AuthCard;
