import type { VercelRequest, VercelResponse } from '@vercel/node';
import majorsData from './majorsData.json';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.status(200).json(majorsData);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 