import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.actions";
import ProfilePageClient from "@/components/ProfilePageClient";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const user = await getProfileByUsername(params.username);
  const dbUserId = await getDbUserId();
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
      user={user}
      dbUserId={dbUserId}
    />
  );
};

export default ProfilePage;
