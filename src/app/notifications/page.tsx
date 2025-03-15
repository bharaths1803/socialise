export const dynamic = "force-dynamic";

import { getNotifications } from "@/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";

const Notifications = async () => {
  const notifications = await getNotifications();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 ml-20 mr-4 lg:ml-64">
      <div className="col-span-9 overflow-y-auto max-h-screen no-scrollbar">
        <div className="container flex flex-col justify-center items-center my-6">
          <div className="w-full md:w-md lg:w-lg xl:w-xl space-y-6">
            <h2 className="text-white font-bold text-3xl">Notifications</h2>
            {notifications.map((notification) => (
              <div
                className="flex justify-between hover:bg-[#1a1a1a] active:bg-[#0d0d0d] hover:rounded-lg hover:cursor-pointer"
                key={notification.id}
              >
                <div className="flex gap-2 max-w-full">
                  <img
                    src={
                      notification.notificationCreated?.image ||
                      "https://github.com/shadcn.png"
                    }
                    className="size-10 rounded-full"
                  />
                  <span className="mr-2">
                    {notification.notificationCreated?.username}{" "}
                    {notification.notificationType === "COMMENT"
                      ? `commented: ${notification.comment?.text}`
                      : "liked your photo"}
                    <span className="text-gray-600 text-sm ml-2">
                      {formatDistanceToNow(notification.createdAt)}
                    </span>
                  </span>
                </div>
                <img
                  src={
                    notification.post?.image || "https://github.com/shadcn.png"
                  }
                  className="size-10 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden lg:block md:col-span-3"></div>
    </div>
  );
};

export default Notifications;
