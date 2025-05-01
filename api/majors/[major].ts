import type { VercelRequest, VercelResponse } from '@vercel/node';
import majorsData from '../majorsData.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { major } = req.query;
    
    if (!major) {
      return res.status(400).json({ error: 'Major name is required' });
    }

    const majorData = majorsData.find(m => m.major === major);
    
    if (!majorData) {
      return res.status(404).json({ error: 'Major not found' });
    }

    res.status(200).json(majorData);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 