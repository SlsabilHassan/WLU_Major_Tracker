import { Major } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchMajors = async (): Promise<Major[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/majors`);
    if (!response.ok) {
      throw new Error('Failed to fetch majors');
    }
    const data = await response.json();
    
    // Transform the backend data to match your frontend structure
    return data.map((major: any) => ({
      _id: major._id,
      major: major.major,
      requirements: major.requirements.map((req: any) => ({
        type: req.type,
        label: req.label,
        courses: req.courses,
        n: req.n,
        subject: req.subject,
        credits: req.credits,
        level: req.level
      }))
    }));
  } catch (error) {
    console.error('Error fetching majors:', error);
    throw error;
  }
}; 