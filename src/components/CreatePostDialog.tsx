"use client";

import { ImageUpscale, Loader, X } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { createPost } from "@/actions/post.action";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";

interface CreatePostDialogProps {
  open: boolean;
  profilePicUrl: string;
  username: string;
  onClose: () => void;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CreatePostDialog = ({
  open,
  profilePicUrl,
  username,
  onClose,
}: CreatePostDialogProps) => {
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleCreatePost = async () => {
    if (!text || !imageUrl) {
      toast.error("Both image and text required");
      return;
    }
    try {
      setIsPosting(true);
      const result = await createPost(text, imageUrl);
      if (result?.success) {
        setText("");
        setImageUrl("");
        toast.success("Post Created Successfully!");
        onClose();
      }
    } catch (error) {
      console.log("Failed to create post", error);
      toast.error("Failed to create post!");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      {open && (
        <>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-50 backdrop-blur-sm z-30" />
          <div className="fixed top-0 left-0 w-screen h-screen flex flex-col py-20 items-center space-y-4 z-50">
            <div className="w-md lg:w-2xl flex justify-between">
              <h2 className="text-white text-center w-full font-bold text-2xl">
                Create Post
              </h2>
              <button
                className="p-2"
                onClick={() => {
                  setImageUrl("");
                  onClose();
                }}
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="w-md lg:w-2xl grid grid-cols-2 border-2 border-gray-600 rounded-lg h-full bg-[#262626]">
              <div className="flex flex-col justify-center items-center h-full rounded-lg rounded-br-none rounded-tr-none space-y-6">
                {imageUrl ? (
                  <img
                    className="h-full rounded-lg"
                    src={imageUrl}
                    alt="Post Image"
                  />
                ) : (
                  <>
                    <ImageUpscale className="size-10" />
                    <UploadButton
                      endpoint={"imageUploader"}
                      onClientUploadComplete={(res) => {
                        setImageUrl(res?.[0].ufsUrl);
                        toast.success("Image Uploaded");
                      }}
                      onUploadError={(error: Error) => {
                        console.log("Upload error", error.message);
                      }}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col justify-between my-2">
                <div className="space-y-3">
                  <div className="flex gap-2 items-center mx-2">
                    <Avatar className="size-7 border-2 rounded-full">
                      <AvatarImage
                        src={profilePicUrl || "https://github.com/shadcn.png"}
                        className="rounded-full"
                      />
                    </Avatar>
                    <span className="text-sm">{username}</span>
                  </div>
                  <textarea
                    className="h-40 overlfow-y-auto border-none focus:border-none outline-none focus:outline-none px-2 resize-none w-full"
                    placeholder="What's popping?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={400}
                  />
                  <div className="flex w-full justify-end mr-6">
                    <span className="text-xs text-white">
                      {text.length}/400
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mx-auto mb-3">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setImageUrl("");
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"default"}
                    onClick={handleCreatePost}
                    className="flex justify-center items-center"
                  >
                    {isPosting ? (
                      <Loader className="size-5 animate-spin" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreatePostDialog;
