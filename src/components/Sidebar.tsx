import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { syncUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";
import CreatePost from "./CreatePostDialog";
import { Home, Search, Heart, LogOut } from "lucide-react";
import SidebarClient from "./SidebarClient";

const Sidebar = async () => {
  const user = await currentUser();
  if (user) {
    await syncUser();
    return <SidebarClient />;
  } else return <UnAuthenticatedSidbar />;
};

const UnAuthenticatedSidbar = () => {
  return (
    <aside className="border-r h-screen border-2 fixed left-0 w-60 py-7 flex flex-col justify-center items-center">
      Unathuenticated
    </aside>
  );
};

export default Sidebar;
