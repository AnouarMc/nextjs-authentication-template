"use client";

import UserAvatar from "@/components/dashboard/user-avatar";
import UpdateName from "@/components/dashboard/update-name";
import UpdateImage from "@/components/dashboard/update-image";
import DashboardCard from "@/components/dashboard/dashboard-card";

import { useState } from "react";
import { User } from "next-auth";
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
      <div className="flex items-center flex-row justify-between grow overflow-hidden gap-x-2">
        {!showUpdate ? (
          <>
            <UserAvatar user={user} />
            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
              {user?.name}
            </div>

            <Button
              variant="ghost"
              className="ml-auto text-primary hover:text-primary/90"
              onClick={() => setShowUpdate(true)}
            >
              Update Profile
            </Button>
          </>
        ) : (
          <DashboardCard title="Update profile">
            <LoadingStateProvider>
              <UpdateImage user={user} />
              <UpdateName user={user} onClose={() => setShowUpdate(false)} />
            </LoadingStateProvider>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};
export default Profile;
