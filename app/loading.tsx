import { LoadingState } from "@/components/ui/state-views";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <LoadingState message="Loading Nityasādhanā..." sanskritMessage="प्रतीक्ष्यताम्..." />
    </div>
  );
}
