import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, X } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: any;
}

export default function CodePreviewModal({ isOpen, onClose, component }: CodePreviewModalProps) {
  const { toast } = useToast();

  if (!component) return null;

  const handleCopyToClipboard = async () => {
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

  const handleDownload = () => {
    downloadFile(component.code, `${component.name}.tsx`, 'text/typescript');
    toast({
      title: "Downloaded",
      description: `${component.name}.tsx has been downloaded.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Generated Component Code</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{component.name}.tsx</h3>
              <Badge variant="outline">{component.type}</Badge>
              <Badge variant="outline">{component.framework}</Badge>
              <Badge variant="outline">{component.size}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <span className="text-sm text-gray-300 font-mono">{component.name}.tsx</span>
            </div>
            <div className="p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                <code>{component.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
