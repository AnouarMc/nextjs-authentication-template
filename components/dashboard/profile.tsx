"use client";

import UserAvatar from "@/components/dashboard/user-avatar";
import UpdateName from "@/components/dashboard/update-name";
import UpdateImage from "@/components/dashboard/update-image";
import DashboardCard from "@/components/dashboard/dashboard-card";

import { User } from "next-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingStateProvider from "@/providers/loading-state-provider";

const Profile = ({ user }: { user: User }) => {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row">
      <div className="shrink-0 w-48">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Profile
        </h2>
      </div>
      <div className="grow overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-x-2 transition-opacity duration-300",
            { "opacity-0 pointer-events-none": showUpdate }
          )}
        >
          <UserAvatar user={user} className="shrink-0" />
          <div className="text-ellipsis overflow-hidden whitespace-nowrap flex-shrink">
            {user?.name}
          </div>

          <Button
            variant="ghost"
            className="ml-auto text-primary hover:text-primary"
            onClick={() => setShowUpdate(true)}
          >
            Update Profile
          </Button>
        </div>

        <DashboardCard title="Update profile" isVisible={showUpdate}>
          <LoadingStateProvider>
            <UpdateImage user={user} />
            <UpdateName user={user} onClose={() => setShowUpdate(false)} />
          </LoadingStateProvider>
        </DashboardCard>
      </div>
    </div>
  );
};
export default Profile;
