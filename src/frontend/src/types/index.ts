export interface RequirementGroup {
  label: string;
  courses: string[];
  // how many courses to take from this group (default 1)
  n?: number;
}

export interface Requirement {
  label: string;
  courses?: string[];
  type: 'all' | 'one_of' | 'n_of' | 'credits' | 'note' | 'group';
  n?: number;
  // What the number in `n`/`credits` counts. The catalog states some rules in
  // courses ("choose four additional courses") and others in credits ("choose
  // nine additional credits"), and the two are not interchangeable: BIOL and
  // EEG courses are mostly 4 credits, MUS lessons 1. Defaults to 'courses'.
  unit?: 'courses' | 'credits';
  subject?: string;
  credits?: number;
  level?: number;
  notes?: string;
  // For type 'group': "choose one course from each of three of these four areas"
  groups?: RequirementGroup[];
  // how many of `groups` must be satisfied (default: all of them)
  groupsRequired?: number;
}

export interface Major {
  _id?: string;
  major: string;
  requirements: Requirement[];
}

export interface MajorProgress {
  checked: CheckedState;
  creditProgress: CreditProgress;
}

export interface CheckedState {
  [key: string]: boolean;
}

export interface CreditProgress {
  [key: string]: number;
}

export interface AllProgress {
  [majorName: string]: MajorProgress;
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
