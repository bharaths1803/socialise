import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { syncUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useState } from "react";
import CreatePost from "./CreatePostDialog";
import { Home, Search, Heart, LogOut } from "lucide-react";
import SidebarClient from "./SidebarClient";
import { getNotifications } from "@/actions/notification.actions";

const Sidebar = async () => {
  const user = await currentUser();
  const notifications = await getNotifications();
  if (user) {
    await syncUser();
    return <SidebarClient />;
  } else return <UnAuthenticatedSidbar />;
};

const UnAuthenticatedSidbar = () => {
  return (
    <aside className="border-r h-screen border-2 fixed left-0 hidden lg:w-60 py-7 lg:flex flex-col justify-center items-center">
      <p className="text-xs">Sign in and Socialise</p>
    </aside>
  );
};

export default Sidebar;
