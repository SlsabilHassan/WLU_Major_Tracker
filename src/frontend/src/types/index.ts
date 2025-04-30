export type Requirement = {
  type: 'all' | 'one_of' | 'n_of' | 'credits';
  label: string;
  courses?: string[];
  n?: number;
  subject?: string;
  credits?: number;
  level?: number;
};

export type Major = {
  major: string;
  requirements: Requirement[];
};

export type CheckedState = {
  [key: string]: boolean;
}; 