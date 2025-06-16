
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package, Palette, FolderPlus } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Activity as ActivityType } from "@/types/api";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'component_generated':
      return <Package className="w-3 h-3" />;
    case 'tokens_extracted':
      return <Palette className="w-3 h-3" />;
    case 'project_created':
      return <FolderPlus className="w-3 h-3" />;
    default:
      return <Activity className="w-3 h-3" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'component_generated':
      return 'bg-green-500';
    case 'tokens_extracted':
      return 'bg-blue-500';
    case 'project_created':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export default function RecentActivity() {
  const { data: activities } = useQuery<ActivityType[]>({
    queryKey: ['/api/recent-activity'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gray-500" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <div className="text-center py-6">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity: ActivityType) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(new Date(activity.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
