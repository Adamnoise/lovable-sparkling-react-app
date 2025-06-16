
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Eye, Download, Copy, CheckCircle, Loader2, Package, FileText } from "lucide-react";
import { formatTimeAgo, copyToClipboard, downloadFile } from "@/lib/utils";
import type { Component } from "@/types/api";

interface GeneratedComponentsProps {
  onComponentPreview: (component: Component) => void;
}

export default function GeneratedComponents({ onComponentPreview }: GeneratedComponentsProps) {
  const { toast } = useToast();
  
  const { data: components, refetch, isLoading } = useQuery<Component[]>({
    queryKey: ['/api/components'],
    refetchInterval: 5000,
  });

  const handleCopyCode = async (component: Component) => {
    const success = await copyToClipboard(component.code);
    if (success) {
      toast({
        title: "Copied!",
        description: "Component code copied to clipboard.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (component: Component) => {
    downloadFile(component.code, `${component.name}.tsx`, 'text/typescript');
    toast({
      title: "Downloaded",
      description: `${component.name}.tsx has been downloaded.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'generating':
        return <Loader2 className="w-5 h-5 text-white animate-spin" />;
      default:
        return <Package className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'from-green-400 to-green-500';
      case 'generating':
        return 'from-blue-400 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generated Components</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!components || components.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No components generated yet. Start by processing a Framer URL.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component: Component) => (
              <div 
                key={component.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor(component.status)} rounded-lg flex items-center justify-center`}>
                      {getStatusIcon(component.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {component.name}
                        </h3>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getTypeIcon(component.type)}
                          <span className="capitalize">{component.type}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {component.framework} • {component.size} • {formatTimeAgo(new Date(component.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  {component.status === 'generated' && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onComponentPreview(component)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownload(component)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleCopyCode(component)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {component.status === 'generating' && (
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
