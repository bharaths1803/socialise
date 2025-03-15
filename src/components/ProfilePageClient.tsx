"use client";

import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
} from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { Grid, Heart, Link2, Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PostCard from "./PostCard";
import Link from "next/link";

type Posts = Awaited<ReturnType<typeof getUserPosts>>;
type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type LikedPosts = Awaited<ReturnType<typeof getUserLikedPosts>>;

interface ProfilePageClientProps {
  posts: Posts;
  user: NonNullable<User>;
  likedPosts: LikedPosts;
  isFollowing: boolean;
  dbUserId: string | null;
}

const ProfilePageClient = ({
  posts,
  likedPosts,
  isFollowing: isInititalFollowing,
  user,
  dbUserId,
}: ProfilePageClientProps) => {
  const [isFollowing, setIsFollowing] = useState(isInititalFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const { user: currentUser } = useUser();
  const [viewPosts, setViewPosts] = useState("USERPOSTS");

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      toast.error("Cannot follow user");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    user.username === currentUser?.username ||
    user.username === currentUser?.emailAddresses[0].emailAddress.split("@")[0];

  return (
    <div className="ml-20 lg:ml-64 flex flex-col justify-center items-center overflow-hidden overflow-y-auto pt-10">
      <div className="w-xs md:w-lg space-y-4">
        <div className="flex gap-5">
          <img
            src={user.image || "https://github.com/shadcn.png"}
            className="size-14 md:size-32 lg:size-52 rounded-full"
          />
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-lg">{user.username}</span>
              {isOwnProfile ? (
                <Link
                  className="bg-[#262626] text-white px-2 py-1 rounded-lg hover:opacity-50 hover:cursor-pointer active:opacity-25"
                  href={`/edit/${user.username}`}
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`${
                    isFollowing
                      ? "bg-[#262626] text-white"
                      : "bg-white text-black"
                  } px-2 py-1 rounded-lg hover:opacity-50 active:opacity-25`}
                >
                  {isUpdatingFollow ? (
                    <Loader className="size-4 animate-spin" />
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <div>
                {user._count.posts} <span className="text-gray-500">posts</span>
              </div>
              <div>
                {user._count.followers}{" "}
                <span className="text-gray-500">followers</span>
              </div>
              <div>
                {user._count.following}{" "}
                <span className="text-gray-500">following</span>
              </div>
            </div>
            <p>{user.name}</p>
            {user.bio && <p className="max-w-screen">{user.bio}</p>}
            {user.location && <p>{user.location}</p>}
            {user.website && (
              <div className="flex gap-2 items-center">
                <Link2 className="size-3" />
                <p>{user.website}</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-600" />

        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex gap-10">
            <button
              className={`flex gap-1 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center px-3 py-2 ${
                viewPosts === "USERPOSTS" ? "rounded-lg bg-[#1a1a1a]" : ""
              }`}
              onClick={(e) => setViewPosts("USERPOSTS")}
            >
              <Grid className="size-5" />
              <span>POSTS</span>
            </button>
            <button
              className={`flex gap-1 hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer items-center px-3 py-2 ${
                viewPosts === "USERLIKEDPOSTS" ? "rounded-lg bg-[#1a1a1a]" : ""
              }`}
              onClick={(e) => setViewPosts("USERLIKEDPOSTS")}
            >
              <Heart className="size-5" />
              <span>LIKED-POSTS</span>
            </button>
          </div>
        </div>

        {viewPosts === "USERPOSTS" && (
          <div className="container flex flex-col justify-center items-center space-y-6 my-6">
            {posts.map((post) => (
              <PostCard dbUserId={dbUserId} post={post} key={post.id} />
            ))}
          </div>
        )}

        {viewPosts === "USERLIKEDPOSTS" && (
          <div className="container flex flex-col justify-center items-center space-y-6 my-6">
            {likedPosts.map((post) => (
              <PostCard dbUserId={dbUserId} post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageClient;
