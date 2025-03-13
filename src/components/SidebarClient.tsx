"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Home, Search, Heart, LogOut, PlusSquare } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import CreatePostDialog from "./CreatePostDialog";

const SidebarClient = () => {
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const { user } = useUser();

  const handleCloseCreatePostDialog = () => {
    setIsCreatePostDialogOpen(false);
  };

  return (
    <div className="h-screen w-screen">
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
      <aside className="border-r h-screen border-2 fixed left-0 w-60 py-7 px-2">
        <h1 className="font-bold text-2xl pl-1">Swipify</h1>
        <div className="h-full flex flex-col justify-between mt-10">
          <div className="space-y-4">
            <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
              <Home className="size-5" />
              <span className="">Home</span>
            </div>
            <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
              <Search className="size-5" />
              <span className="">Search</span>
            </div>
            <button
              className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center w-full"
              onClick={() => setIsCreatePostDialogOpen(true)}
            >
              <PlusSquare className="size-5" />
              <span className="">Create Post</span>
            </button>
            <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
              <Heart className="size-5" />
              <span className="">Notifications</span>
            </div>
            <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
              <Avatar className="size-7 border-2 rounded-full">
                <AvatarImage
                  src={user?.imageUrl || "https://github.com/shadcn.png"}
                  className="rounded-full"
                />
              </Avatar>
              {/* <User className="size-5" /> */}
              <span className="">Profile</span>
            </div>
          </div>
          <div className="mb-20">
            <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
              <LogOut className="size-5" />
              <span className="">Logout</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarClient;
