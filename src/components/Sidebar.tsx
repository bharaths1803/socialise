import { getUserByClerkId, syncUser } from "@/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { Heart, Home, LogOut, PlusSquare, Search, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Sidebar = async () => {
  const user = await currentUser();
  if (user) await syncUser();
  else return <UnAuthenticatedSidbar />;

  return (
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
          <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
            <PlusSquare className="size-5" />
            <span className="">Create</span>
          </div>
          <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
            <Heart className="size-5" />
            <span className="">Notifications</span>
          </div>
          <div className="flex gap-2 p-3 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center">
            <User className="size-5" />
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
  );
};

const UnAuthenticatedSidbar = () => {
  return (
    <aside className="border-r h-screen border-2 fixed left-0 w-60 py-7 flex flex-col justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-lg w-full">
            Welcome Socialiser!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">Login and Start Socialising!</p>
          <SignInButton>
            <Button className="w-full" variant={"outline"}>
              Login
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className="w-full mt-2" variant={"default"}>
              Signup
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;
