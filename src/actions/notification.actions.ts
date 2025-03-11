import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import { error } from "console";

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    const notifications = await prisma.notification.findMany({
      where: {
        notificationReceiverId: userId,
      },
      include: {
        notificationCreated: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            text: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            text: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.log("Error getting notifications", error);
    throw new Error("Unable to fetch notifications");
  }
}

export async function markNotificationAsRead(notificationsId: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationsId,
        },
      },
      data: {
        isRead: true,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notifications read", error);
    return { success: false };
  }
}
