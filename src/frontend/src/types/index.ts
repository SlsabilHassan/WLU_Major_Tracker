export interface Requirement {
  label: string;
  courses?: string[];
  type: 'all' | 'one_of' | 'n_of' | 'credits';
  n?: number;
  subject?: string;
  credits?: number;
  level?: number;
}

export interface Major {
  _id: string;
  major: string;
  requirements: Requirement[];
}

export interface CheckedState {
  [key: string]: boolean;
}

export interface RoadmapProps {
  requirements: Requirement[];
  checked: CheckedState;
  onToggle: (label: string, course: string) => void;
}

export interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  progressColor?: string;
  textColor?: string;
} 