import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default function Home() {
  return (
    <div className="ml-64 grid grid-cols-5 bg-amber-400 h-full">
      <div className="col-span-3 bg-red-500">Main Content</div>
      <div className="col-span-2 bg-blue-700">Right Sidebar</div>
    </div>
  );
}
