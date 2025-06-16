import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, FileText, Layers, Eye } from "lucide-react";

const getTokenIcon = (type: string) => {
  switch (type) {
    case 'color':
      return <Palette className="h-4 w-4" />;
    case 'typography':
      return <FileText className="h-4 w-4" />;
    case 'spacing':
      return <Layers className="h-4 w-4" />;
    case 'shadow':
      return <Eye className="h-4 w-4" />;
    default:
      return <Palette className="h-4 w-4" />;
  }
};

export default function DesignTokensPanel() {
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Get the most recent completed project for tokens
  const latestProject = projects?.find((p: any) => p.status === 'completed') || projects?.[0];

  const { data: tokens } = useQuery({
    queryKey: [`/api/design-tokens/${latestProject?.id}`],
    enabled: !!latestProject,
  });

  const groupedTokens = tokens?.reduce((acc: any, token: any) => {
    if (!acc[token.tokenType]) {
      acc[token.tokenType] = [];
    }
    acc[token.tokenType].push(token);
    return acc;
  }, {});

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-framer-purple" />
          <span>Design Tokens</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!tokens || tokens.length === 0 ? (
          <div className="text-center py-6">
            <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No design tokens extracted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Colors */}
            {groupedTokens?.color && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Colors</h3>
                <div className="grid grid-cols-2 gap-2">
                  {groupedTokens.color.map((token: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: token.tokenValue }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {token.tokenName.replace('-500', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Typography */}
            {groupedTokens?.typography && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Typography</h3>
                <div className="space-y-2">
                  {groupedTokens.typography.map((token: any, index: number) => (
                    <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                      <div className={`${
                        token.tokenName.includes('heading') ? 'text-lg font-bold' : 'text-sm'
                      } text-gray-900 dark:text-white`}>
                        {token.tokenName.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </div>
                      <code className="text-xs text-gray-500 dark:text-gray-400">
                        {token.tokenValue}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spacing */}
            {groupedTokens?.spacing && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Spacing</h3>
                <div className="grid grid-cols-4 gap-1">
                  {groupedTokens.spacing.map((token: any, index: number) => {
                    const size = parseInt(token.tokenValue);
                    const height = Math.min(32, Math.max(8, size / 2));
                    return (
                      <div key={index} className="text-center">
                        <div 
                          className="bg-gray-200 dark:bg-gray-600 rounded mx-auto"
                          style={{ height: `${height}px`, width: '100%' }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                          {token.tokenValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
