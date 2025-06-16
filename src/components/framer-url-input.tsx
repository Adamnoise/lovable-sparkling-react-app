import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, Play, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { validateFramerUrl, extractProjectNameFromUrl } from "@/lib/utils";

export default function FramerUrlInput() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (framerUrl: string) => {
      const projectName = extractProjectNameFromUrl(framerUrl);
      const response = await apiRequest("POST", "/api/projects", {
        name: projectName,
        framerUrl,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Your Framer project is now being processed.",
      });
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Framer URL.",
        variant: "destructive",
      });
      return;
    }

    if (!validateFramerUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Framer share link.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate(url);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-framer-blue" />
          <span>New Framer Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="framer-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Framer Share URL
            </Label>
            <div className="flex space-x-3 mt-2">
              <Input
                id="framer-url"
                type="url"
                placeholder="https://framer.com/share/Component--abc123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={createProjectMutation.isPending}
              />
              <Button 
                type="submit" 
                disabled={createProjectMutation.isPending}
                className="bg-framer-blue hover:bg-blue-600"
              >
                {createProjectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Paste your Framer share link to start the conversion process
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
