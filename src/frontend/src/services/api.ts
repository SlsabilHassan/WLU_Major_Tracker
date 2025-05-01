import axios from 'axios';
import { Major } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://wlu-major-tracker-backend.vercel.app/api'
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMajors = async (): Promise<Major[]> => {
  try {
    const response = await api.get<Major[]>('/majors');
    return response.data;
  } catch (error) {
    console.error('Error fetching majors:', error);
    throw error;
  }
}; 