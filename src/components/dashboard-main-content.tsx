
import FramerUrlInput from "@/components/framer-url-input";
import ProcessingStatus from "@/components/processing-status";
import GeneratedComponents from "@/components/generated-components";

interface DashboardMainContentProps {
  onComponentPreview: (component: any) => void;
}

export default function DashboardMainContent({ onComponentPreview }: DashboardMainContentProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <FramerUrlInput />
      <ProcessingStatus />
      <GeneratedComponents onComponentPreview={onComponentPreview} />
    </div>
  );
}
