import { SpinnerLoading } from "@/components/ui/loaders";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalAppLoading() {
  return (
    <div className="flex flex-col space-y-3 p-6 h-screen w-full items-center justify-center">
      <SpinnerLoading />
    </div>
  );
}