import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.actions";
import PostCard from "@/components/PostCard";
import Suggestions from "@/components/Suggestions";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  const dbUserId = await getDbUserId();
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-12 ml-64 ">
      <div className="col-span-9 overflow-y-auto max-h-screen no-scrollbar">
        <div className="container flex flex-col justify-center items-center space-y-6 my-6">
          {posts.map((post) => (
            <PostCard dbUserId={dbUserId} post={post} key={post.id} />
          ))}
        </div>
      </div>
      <div className="col-span-3">
        <Suggestions />
      </div>
    </div>
  );
}
