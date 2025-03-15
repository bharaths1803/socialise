"use client";

import { getProfileByUsername, updateProfile } from "@/actions/profile.action";
import { ArrowLeftSquare, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;

const EditProfilePageClient = ({ user }: { user: NonNullable<User> }) => {
  const [updateData, setUpdateData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleUpdateProfile = async () => {
    if (!updateData.name) return;
    try {
      setIsUpdatingProfile(true);
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("bio", updateData.bio);
      formData.append("location", updateData.location);
      formData.append("website", updateData.website);
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed updating profile!");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 ml-20 mr-4 lg:ml-64">
      <div className="col-span-9 overflow-y-auto max-h-screen no-scrollbar">
        <div className="container flex flex-col justify-center items-center my-6">
          <div className="w-full md:w-md lg:w-lg xl:w-xl space-y-3">
            <h2 className="text-white font-bold text-3xl w-full">
              Edit Profile
            </h2>
            <div className="p-3 flex gap-3 w-full bg-[#262626] rounded-2xl">
              <img
                src={user.image || "https://github.com/shadcn.png"}
                className="rounded-full size-7"
              />
              <div className="space-y-1">
                <div className="font-bold text-white">{user.username}</div>
                <div className="text-gray-600 text-sm">{user.name}</div>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-white font-bold text-lg">Name</div>
              <textarea
                className="h-10 overlfow-y-auto bg-[#262626] px-3 py-2 resize-none w-full rounded-2xl"
                placeholder={user.name}
                value={updateData.name}
                onChange={(e) =>
                  setUpdateData({ ...updateData, name: e.target.value })
                }
                maxLength={25}
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="text-white font-bold text-lg">Location</div>
              <textarea
                className="h-10 overlfow-y-auto bg-[#262626] px-3 py-2 resize-none w-full rounded-2xl"
                value={updateData.location}
                onChange={(e) =>
                  setUpdateData({ ...updateData, location: e.target.value })
                }
                placeholder={user.location || ""}
                maxLength={25}
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="text-white font-bold text-lg">Website</div>
              <textarea
                className="h-10 overlfow-y-auto bg-[#262626] px-3 py-2 resize-none w-full rounded-2xl"
                value={updateData.website}
                onChange={(e) =>
                  setUpdateData({ ...updateData, website: e.target.value })
                }
                maxLength={25}
                placeholder={user.website || ""}
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="text-white font-bold text-lg">Bio</div>
              <textarea
                className="h-40 overlfow-y-auto bg-[#262626] px-3 py-2 resize-none w-full rounded-2xl"
                value={updateData.bio}
                onChange={(e) =>
                  setUpdateData({ ...updateData, bio: e.target.value })
                }
                maxLength={150}
                placeholder={user.bio || ""}
              />
            </div>
            <div className="w-full flex justify-end">
              <div className="flex gap-3">
                <Link
                  className="p-3 bg-white text-black rounded-lg"
                  href={`/profile/${user.username}`}
                >
                  <div className="flex gap-1 items-center">
                    <ArrowLeftSquare className="size-5" />
                    <div>Profile</div>
                  </div>
                </Link>
                <button
                  className="p-3 bg-white text-black rounded-lg hover:cursor-pointer hover:bg-white/75 active:bg-white/50"
                  onClick={handleUpdateProfile}
                >
                  {isUpdatingProfile ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block md:col-span-3"></div>
    </div>
  );
};

export default EditProfilePageClient;
