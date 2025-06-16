
import DashboardStats from "@/components/dashboard-stats";
import DashboardHeader from "@/components/dashboard-header";
import DashboardMainContent from "@/components/dashboard-main-content";
import DashboardSidebar from "@/components/dashboard-sidebar";
import CodePreviewModal from "@/components/code-preview-modal";
import { useDashboardWebSocket } from "@/hooks/use-dashboard-websocket";
import { useCodePreview } from "@/hooks/use-code-preview";

export default function Dashboard() {
  const { isConnected } = useDashboardWebSocket();
  const { selectedComponent, isCodeModalOpen, handleComponentPreview, closeCodeModal } = useCodePreview();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader isConnected={isConnected} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DashboardMainContent onComponentPreview={handleComponentPreview} />
          <DashboardSidebar />
        </div>
      </main>

      <CodePreviewModal 
        isOpen={isCodeModalOpen}
        onClose={closeCodeModal}
        component={selectedComponent}
      />
    </div>
  );
}
