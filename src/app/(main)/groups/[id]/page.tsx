import GroupDetails from "@/app/(main)/components/groups/GroupDetails";

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  // Trả về component GroupDetails và truyền ID nhóm vào
  return <GroupDetails groupId={params.id} />;
}