import { getProfileByUsername } from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.actions";
import EditProfilePageClient from "@/components/EditProfilePageClient";
import { notFound } from "next/navigation";

const EditProfilePage = async ({
  params,
}: {
  params: { username: string };
}) => {
  const user = await getProfileByUsername(params.username);
  if (!user) notFound();

  return <EditProfilePageClient user={user} />;
};

export default EditProfilePage;
