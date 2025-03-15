"use client";

import { isFollowing } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.actions";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const FollowButton = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await toggleFollow(userId);
      toast.success("User followed successfully!");
    } catch (error) {
      toast.error("Error following user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="bg-white text-black px-4 hover:bg-white/50 active:bg-white/75 rounded-lg text-sm"
      onClick={handleFollow}
    >
      {loading ? <Loader className="size-5 animate-spin" /> : "Follow"}
    </button>
  );
};

export default FollowButton;
