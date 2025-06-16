import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, Zap } from "lucide-react";
import DashboardStats from "@/components/dashboard-stats";
import FramerUrlInput from "@/components/framer-url-input";
import ProcessingStatus from "@/components/processing-status";
import GeneratedComponents from "@/components/generated-components";
import DesignTokensPanel from "@/components/design-tokens-panel";
import AssetOptimizationPanel from "@/components/asset-optimization-panel";
import RecentActivity from "@/components/recent-activity";
import CodePreviewModal from "@/components/code-preview-modal";
import { useState, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const { isConnected, lastMessage } = useWebSocket("");
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'project_created':
        case 'project_completed':
          queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
          break;
        case 'component_generated':
          queryClient.invalidateQueries({ queryKey: ['/api/components'] });
          queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
          break;
        case 'processing_update':
          queryClient.invalidateQueries({ 
            queryKey: [`/api/processing-jobs/${lastMessage.projectId}`] 
          });
          break;
      }
    }
  }, [lastMessage]);

  const handleComponentPreview = (component: any) => {
    setSelectedComponent(component);
    setIsCodeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-framer-blue to-framer-purple rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Framer Bridge</h1>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-framer-blue/10 text-framer-blue dark:bg-framer-blue/20">
                Production Ready
              </span>
              {isConnected && (
                <span className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <FramerUrlInput />
            <ProcessingStatus />
            <GeneratedComponents onComponentPreview={handleComponentPreview} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DesignTokensPanel />
            <AssetOptimizationPanel />
            <RecentActivity />
          </div>
        </div>
      </main>

      {/* Code Preview Modal */}
      <CodePreviewModal 
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        component={selectedComponent}
      />
    </div>
  );
}
