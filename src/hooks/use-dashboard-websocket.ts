
import { useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import { queryClient } from '@/lib/queryClient';

interface WebSocketMessage {
  type: 'project_created' | 'project_completed' | 'component_generated' | 'processing_update';
  projectId?: string;
  [key: string]: any;
}

export function useDashboardWebSocket() {
  const { isConnected, lastMessage } = useWebSocket("");

  useEffect(() => {
    if (lastMessage) {
      const message = lastMessage as WebSocketMessage;
      
      switch (message.type) {
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
          if (message.projectId) {
            queryClient.invalidateQueries({ 
              queryKey: [`/api/processing-jobs/${message.projectId}`] 
            });
          }
          break;
      }
    }
  }, [lastMessage]);

  return { isConnected };
}
