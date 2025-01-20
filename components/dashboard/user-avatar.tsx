import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ user, preview }: { user?: User; preview?: string }) => {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
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
