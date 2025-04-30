export interface IRequirement {
  type: string;
  label?: string;
  courses?: string[];
  n?: number;
  subject?: string;
  credits?: number;
  level?: number;
}

export interface IMajor {
  major: string;
  requirements: IRequirement[];
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  majors: string[];
  checkedCourses: Record<string, boolean>;
}
