"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getProfileByUsername(username: string) {
  try {
    const profile = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        website: true,
        location: true,
        createdAt: true,
        bio: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in getting profiles", error);
    throw new Error("Error fetching profiles");
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },

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
    });

    return posts;
  } catch (error) {
    console.error("Error getting user posts", error);
    throw new Error("Error getting user posts");
  }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();

    if (!currentUserId) return false;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error in is following action", error);
    return false;
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorised");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: {
        clerkId,
      },
      data: {
        name,
        bio,
        location,
        website,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.log("Error in update profile actions", error);
    return { success: false, error: "Error updating profile" };
  }
}

export async function getUserLikedPosts(userId: string) {
  try {
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            likerId: userId,
          },
        },
      },
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
    });
  } catch (error) {
    console.log("Error in get user liked posts", error);
    return { success: false, error: "Error getting user liked posts" };
  }
}
