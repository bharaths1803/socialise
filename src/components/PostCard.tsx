"use client";

import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import {
  HeartIcon,
  Loader,
  MessageCircle,
  SendHorizontal,
  Trash2Icon,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

const PostCard = ({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) => {
  const { user } = useUser();
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.likerId === dbUserId)
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.likerId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleCreateComment = async () => {
    console.log(comment);
    if (!comment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(comment, post.id);
      if (result?.success) {
        toast.success("Comment Posted Successfully!");
        setComment("");
      }
    } catch (error) {
      toast.error("Failed adding comment!");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleComment = () => {
    if (commentTextAreaRef?.current) {
      commentTextAreaRef.current.focus();
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const res = await deletePost(post.id);
      if (res?.success) {
        toast.success("Post deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete post!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-lg space-y-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <img
            src={post.author?.image ?? "https://github.com/shadcn.png"}
            alt="Post author image"
            className="rounded-full size-5"
          />
          <h1 className="font-medium text-sm">
            {post.author?.username}{" "}
            <span className="text-gray-600">
              {" "}
              • {formatDistanceToNow(post.createdAt)}
            </span>
          </h1>
        </div>
        <button onClick={handleDeletePost} className="hover:cursor-pointer">
          {isDeleting ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <Trash2Icon className="size-5" />
          )}
        </button>
      </div>

      <div className="h-full py-3 w-full flex flex-col items-center">
        <img src={post.image} className="h-full" />
      </div>
      <div className="flex gap-2">
        <button
          className="border-none size-7 hover:text-white/50"
          onClick={handleLike}
        >
          <HeartIcon
            className={`size-full ${hasLiked ? "fill-current" : ""}`}
          />
        </button>
        <button
          className="border-none size-7 hover:text-white/50"
          onClick={handleComment}
        >
          <MessageCircle className="size-full" />
        </button>
      </div>
      <span className="text-white font-semibold text-sm">
        {optimisticLikes} likes
      </span>
      <div className="max-w-full text-sm">
        {post.author?.username} <span className="">{post.text}</span>
      </div>
      {post._count.comments > 1 && (
        <span className="text-gray-500 hover:cursor-pointer active:text-gray-600">
          View All {post._count.comments} Comments
        </span>
      )}
      <div className="max-h-16 overflow-y-auto no-scrollbar">
        {post.comments.map((comment) => (
          <div className="flex space-x-2" key={comment.id}>
            <span>{comment.commentor.username}</span>
            <p className="mx-2 max-w-full">{comment.text}</p>
          </div>
        ))}
      </div>
      <textarea
        className="max-h-40 overlfow-y-auto border-none focus:border-none outline-none focus:outline-none pr-2 resize-none w-full"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={400}
        ref={commentTextAreaRef}
      />
      <div className="w-full flex justify-end">
        <button
          className="p-2 bg-white text-black rounded-lg hover:bg-white/50 text-sm"
          onClick={handleCreateComment}
        >
          {isCommenting ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <SendHorizontal className="size-5" />
          )}
        </button>
      </div>
      <div className="w-full h-[1px] bg-gray-600" />
    </div>
  );
};

export default PostCard;
