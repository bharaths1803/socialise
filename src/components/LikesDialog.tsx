"use client";
import { X } from "lucide-react";
import React from "react";
import { getPosts } from "@/actions/post.action";
import Link from "next/link";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

interface LikesDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

const LikesDialog = ({ open, onClose, post }: LikesDialogProps) => {
  return (
    <>
      {open && (
        <>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 backdrop-blur-sm z-30" />
          <div className="fixed top-0 left-0 w-screen h-screen flex flex-col py-20 items-center space-y-4 z-50">
            <div className="w-sm border-2 border-gray-600 rounded-lg h-full bg-[#262626] p-2 overflow-y-auto no-scrollbar">
              <div className="flex justify-between">
                <h2 className="text-center w-full font-bold text-2xl">Likes</h2>
                <button onClick={onClose}>
                  <X className="size-5" />
                </button>
              </div>
              <div className="w-full h-[1px] bg-gray-600" />
              <div className="space-y-3 mt-3">
                {post.likes?.map((like) => (
                  <div
                    className="flex justify-between items-center"
                    key={like.id}
                  >
                    <div className="flex gap-2">
                      <div className="h-10 w-10 rounded-full">
                        <img
                          className="size-full rounded-full"
                          src={
                            like.liker.image || "https://github.com/shadcn.png"
                          }
                        />
                      </div>
                      <div>
                        <Link
                          className="text-white"
                          href={`/profile/${like.liker.username}`}
                        >
                          {like.liker.username}
                        </Link>
                        <div className="text-gray-500 text-sm">Popular</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LikesDialog;
