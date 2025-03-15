import { getProfileByUsername } from "@/actions/profile.action";
import EditProfilePageClient from "@/components/EditProfilePageClient";
import { notFound } from "next/navigation";

const EditProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) notFound();
  return <EditProfilePageClient user={user} />;
};

export default EditProfilePage;
