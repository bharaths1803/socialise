"use client";

import { Home, Search, Heart, LogOut, PlusSquare } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import CreatePostDialog from "./CreatePostDialog";
import SidebarItemsText from "./SidebarItemsText";
import Link from "next/link";

const SidebarClient = () => {
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const { user } = useUser();

  const handleCloseCreatePostDialog = () => {
    setIsCreatePostDialogOpen(false);
  };

  return (
    <div className="">
      <CreatePostDialog
        open={isCreatePostDialogOpen}
        profilePicUrl={user?.imageUrl as unknown as string}
        username={
          user?.username ??
          (user?.emailAddresses[0].emailAddress.split(
            "@"
          )[0] as unknown as string)
        }
        onClose={handleCloseCreatePostDialog}
      />
      <aside
        className={`border border-r-2 h-screen fixed left-0 w-16 xl:w-60 py-7 px-2 transition-all duration-300`}
      >
        <div className="flex gap-2 items-end">
          <img className="h-10 w-10" src="/fluid-letter-s.png" />
          <h1 className="text-3xl font-bold hidden xl:block">ocialise</h1>
        </div>
        <div className="h-full flex flex-col justify-between mt-10">
          <div className="space-y-4">
            <Link
              className="w-full flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center"
              href={"/"}
            >
              <Home className="size-5" />
              <SidebarItemsText text={"Home"} />
            </Link>
            <button
              className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center w-full"
              onClick={() => setIsCreatePostDialogOpen(true)}
            >
              <PlusSquare className="size-5" />

              <SidebarItemsText text={"Create Post"} />
            </button>
            <Link
              className="w-full flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center"
              href={"/notifications"}
            >
              <Heart className="size-5" />
              <SidebarItemsText text={"Notifications"} />
            </Link>
            <div className="w-full flex gap-2 p-3 items-center">
              <UserButton>
                <img
                  src={user?.imageUrl || "https://github.com/shadcn.png"}
                  className="size-5 rounded-full"
                />
              </UserButton>

              <SidebarItemsText text={"Profile"} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarClient;
