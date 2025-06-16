
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link2, Image, Palette, Code, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import type { Project, ProcessingJob } from "@/types/api";

const stepIcons = {
  api_connection: Link2,
  asset_processing: Image,
  design_tokens: Palette,
  component_generation: Code,
};

const stepNames = {
  api_connection: "Framer API Connection",
  asset_processing: "Asset Processing",
  design_tokens: "Design Token Extraction",
  component_generation: "Component Generation",
};

export default function ProcessingStatus() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    refetchInterval: 2000,
  });

  // Get the most recent processing project
  const currentProject = projects?.find((p: Project) => p.status === 'processing');

  const { data: jobs } = useQuery<ProcessingJob[]>({
    queryKey: [`/api/processing-jobs/${currentProject?.id}`],
    enabled: !!currentProject,
    refetchInterval: 1000,
  });

  if (!currentProject) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Processing Status</span>
            <Badge variant="outline" className="text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Idle
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No projects currently being processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const overallProgress = jobs ? 
    Math.round(jobs.reduce((acc: number, job: ProcessingJob) => acc + job.progress, 0) / jobs.length) : 0;

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Processing Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Processing: <span className="font-medium text-gray-900 dark:text-white">{currentProject.name}</span>
          </div>

          {jobs?.map((job: ProcessingJob) => {
            const StepIcon = stepIcons[job.step] || Code;
            const stepName = stepNames[job.step] || job.step;

            return (
              <div 
                key={job.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    job.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                    job.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <StepIcon className={`w-4 h-4 ${
                      job.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                      job.status === 'processing' ? 'text-blue-600 dark:text-blue-400' :
                      'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      job.status === 'pending' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {stepName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.message || 'Waiting...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.status)}
                  <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status === 'processing' ? `${job.progress}%` :
                     job.status === 'completed' ? 'Complete' :
                     job.status === 'error' ? 'Error' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Overall Progress</span>
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
