import { syncUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import SidebarClient from "./SidebarClient";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Sidebar = async () => {
  const user = await currentUser();
  if (user) {
    await syncUser();
    return <SidebarClient />;
  } else return <UnAuthenticatedSidbar />;
};

const UnAuthenticatedSidbar = () => {
  return (
    <aside className="border-r h-screen border-2 fixed left-0 hidden lg:w-60 py-7 lg:flex flex-col justify-center items-center space-y-3">
      <p className="text-xs">Sign in and Socialise</p>
      <SignInButton mode="modal">
        <Button className="w-full" variant="outline">
          Login
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button className="w-full mt-2" variant="default">
          Sign Up
        </Button>
      </SignUpButton>
    </aside>
  );
};

export default Sidebar;
