import { Router } from 'express';
import {
  getMajors,
  getMajor,
  createMajor,
  updateMajor,
  deleteMajor
} from '../controllers/majorController';

const router = Router();

router.get('/', getMajors);
router.get('/:major', getMajor);
router.post('/', createMajor);
router.put('/:major', updateMajor);
router.delete('/:major', deleteMajor);

export default router; 