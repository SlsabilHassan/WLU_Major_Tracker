import { Major } from '../types';
import majorsData from '../data/majors.json';

export const fetchMajors = async (): Promise<Major[]> => {
  try {
    return majorsData as Major[];
  } catch (error) {
    console.error('Error fetching majors:', error);
    throw error;
  }
}; 