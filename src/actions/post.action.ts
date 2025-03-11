import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import image from "next/image";
import { text } from "stream/consumers";
import { revalidatePath } from "next/cache";

export async function createPost(text: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        text,
        image,
      },
    });
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("Error creating post", error);
    return { success: false, error };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorised, it's not your post");
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error creating post", error);
    return { success: false, error };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          select: {
            likerId: true,
          },
        },
        comments: {
          include: {
            commentor: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return posts;
  } catch (error) {
    console.error("Error getting user posts", error);
    throw new Error("Error getting user posts");
  }
}

export async function createComment(text: string, postId: string) {
  try {
    if (!text) throw new Error("Content required");
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post Not Found");

    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          text,
          commentorId: userId,
          postId,
        },
      });

      if (newComment.commentorId !== userId) {
        await tx.notification.create({
          data: {
            notificationType: "COMMENT",
            commentId: newComment.id,
            postId,
            notificationReceiverId: post.authorId,
            notificationCreatorId: userId,
          },
        });
      }

      return [newComment];
    });
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.log("Error creating comment", error);
    return { success: false, error };
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post Not Found");

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_likerId: {
          postId,
          likerId: userId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_likerId: {
            postId,
            likerId: userId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            likerId: userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  notificationType: "LIKE",
                  postId,
                  notificationCreatorId: userId,
                  notificationReceiverId: post.authorId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error toggling like", error);
    return { success: false, error };
  }
}
