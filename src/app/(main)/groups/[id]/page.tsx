import GroupDetails from "@/app/(main)/components/groups/GroupDetails";

// Định nghĩa kiểu dữ liệu cho params dưới dạng Promise theo chuẩn Next.js 15
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailsPage({ params }: PageProps) {
  //  Phải await params trước khi lấy id ra
  const resolvedParams = await params;
  const groupId = resolvedParams.id;

  // Truyền id đã giải nén xuống cho Component con xử lý
  return <GroupDetails groupId={groupId} />;
}