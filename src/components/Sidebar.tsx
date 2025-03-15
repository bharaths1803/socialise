import { syncUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import SidebarClient from "./SidebarClient";
import { getNotifications } from "@/actions/notification.actions";

const Sidebar = async () => {
  const user = await currentUser();
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
