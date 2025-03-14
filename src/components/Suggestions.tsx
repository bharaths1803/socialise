import { getRandomUsers, getUserByClerkId } from "@/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import FollowButton from "./FollowButton";

const Suggestions = async () => {
  const users = await getRandomUsers();
  const { userId: clerkId } = await auth();
  const currentUser = await getUserByClerkId(clerkId as unknown as string);
  if (users?.length === 0 || !currentUser) return null;

  return (
    <div className="pt-4 pr-4">
      <div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full">
            <img
              className="size-full rounded-full"
              src={currentUser.image || "https://github.com/shadcn.png"}
            />
          </div>
          <div>
            <div className="text-white">{currentUser.username}</div>
            <div className="text-gray-500">{currentUser.name}</div>
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-3">
        <p className="text-sm text-gray-500">Suggested for you</p>
      </div>
      <div className="space-y-3 mt-3">
        {users?.map((user) => (
          <div className="flex justify-between items-center" key={user.id}>
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-full">
                <img
                  className="size-full rounded-full"
                  src={user.image || "https://github.com/shadcn.png"}
                />
              </div>
              <div>
                <div className="text-white">{user.username}</div>
                <div className="text-gray-500 text-sm">Popular</div>
              </div>
            </div>
            <FollowButton userId={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
