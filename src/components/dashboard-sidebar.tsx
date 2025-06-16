
import DesignTokensPanel from "@/components/design-tokens-panel";
import AssetOptimizationPanel from "@/components/asset-optimization-panel";
import RecentActivity from "@/components/recent-activity";

export default function DashboardSidebar() {
  return (
    <div className="space-y-6">
      <DesignTokensPanel />
      <AssetOptimizationPanel />
      <RecentActivity />
    </div>
  );
}
