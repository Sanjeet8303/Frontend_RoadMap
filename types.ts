export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'core' | 'advanced' | 'tooling' | 'soft-skills';
  iconName?: string;
}

export interface RoadmapData {
  topic: string;
  steps: RoadmapStep[];
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}