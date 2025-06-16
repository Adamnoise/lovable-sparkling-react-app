import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Package, Clock, CheckCircle } from "lucide-react";

export default function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const statsData = [
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: Folder,
      color: "text-framer-blue",
      bgColor: "bg-framer-blue/10",
    },
    {
      title: "Components Generated",
      value: stats?.totalComponents || 0,
      icon: Package,
      color: "text-framer-purple",
      bgColor: "bg-framer-purple/10",
    },
    {
      title: "Processing Queue",
      value: stats?.processingQueue || 0,
      icon: Clock,
      color: "text-framer-cyan",
      bgColor: "bg-framer-cyan/10",
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
