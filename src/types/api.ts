
export interface DashboardStats {
  totalProjects: number;
  totalComponents: number;
  processingQueue: number;
  successRate: number;
}

export interface Project {
  id: string;
  name: string;
  framerUrl: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  framework: string;
  size: string;
  status: 'generating' | 'generated' | 'error';
  code: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  originalSize: number;
  optimizedSize?: number;
  savings?: number;
  status: 'processing' | 'completed' | 'error';
}

export interface DesignToken {
  id: string;
  tokenName: string;
  tokenValue: string;
  tokenType: 'color' | 'typography' | 'spacing' | 'shadow';
}

export interface ProcessingJob {
  id: string;
  step: 'api_connection' | 'asset_processing' | 'design_tokens' | 'component_generation';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}

export interface Activity {
  id: string;
  type: 'component_generated' | 'tokens_extracted' | 'project_created';
  message: string;
  createdAt: string;
}
