import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user?: User;
  preview?: string;
  className?: string;
}

const UserAvatar = ({ user, preview, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-10 w-10 rounded-lg", className)}>
      <AvatarImage
        className="rounded-full"
        src={preview ?? user?.image ?? undefined}
        alt={`${user?.name} profile picture`}
      />
      <AvatarFallback className="rounded-full text-white bg-primary">
        {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
