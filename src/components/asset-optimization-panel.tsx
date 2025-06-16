import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, CheckCircle, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function AssetOptimizationPanel() {
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Get the most recent project for assets
  const latestProject = projects?.[0];

  const { data: assets } = useQuery({
    queryKey: [`/api/assets/${latestProject?.id}`],
    enabled: !!latestProject,
  });

  const totalOriginalSize = assets?.reduce((acc: number, asset: any) => acc + asset.originalSize, 0) || 0;
  const totalOptimizedSize = assets?.reduce((acc: number, asset: any) => 
    acc + (asset.optimizedSize || asset.originalSize), 0) || 0;
  const totalSavings = totalOriginalSize > 0 ? 
    Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100) : 0;
  const savedBytes = totalOriginalSize - totalOptimizedSize;

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="w-5 h-5 text-framer-cyan" />
          <span>Asset Optimization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!assets || assets.length === 0 ? (
          <div className="text-center py-6">
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No assets to optimize yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset: any) => (
              <div 
                key={asset.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  asset.status === 'completed' 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {asset.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                  )}
                  <span className={`text-sm font-medium ${
                    asset.status === 'completed' 
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {asset.name}
                  </span>
                </div>
                <Badge variant="outline" className={
                  asset.status === 'completed' 
                    ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                    : 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                }>
                  {asset.status === 'completed' 
                    ? `-${asset.savings}%`
                    : 'Processing'
                  }
                </Badge>
              </div>
            ))}

            {totalOriginalSize > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Savings</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatBytes(savedBytes)} ({totalSavings}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
