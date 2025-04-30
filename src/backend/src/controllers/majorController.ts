import { Request, Response } from 'express';
import { Major } from '../models/Major';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const getMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    const majors = await Major.find();
    res.json(majors);
  } catch (error) {
    logger.error('Error fetching majors:', error);
    throw new AppError('Error fetching majors', 500);
  }
};

export const getMajor = async (req: Request, res: Response): Promise<void> => {
  try {
    const major = await Major.findOne({ major: req.params.major });
    if (!major) {
      throw new AppError('Major not found', 404);
    }
    res.json(major);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching major:', error);
    throw new AppError('Error fetching major', 500);
  }
};

export const createMajor = async (req: Request, res: Response): Promise<void> => {
  try {
    const major = new Major(req.body);
    await major.save();
    res.status(201).json(major);
  } catch (error) {
    logger.error('Error creating major:', error);
    throw new AppError('Error creating major', 400);
  }
};

export const updateMajor = async (req: Request, res: Response): Promise<void> => {
  try {
    const major = await Major.findOneAndUpdate(
      { major: req.params.major },
      req.body,
      { new: true, runValidators: true }
    );
    if (!major) {
      throw new AppError('Major not found', 404);
    }
    res.json(major);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating major:', error);
    throw new AppError('Error updating major', 400);
  }
};

export const deleteMajor = async (req: Request, res: Response): Promise<void> => {
  try {
    const major = await Major.findOneAndDelete({ major: req.params.major });
    if (!major) {
      throw new AppError('Major not found', 404);
    }
    res.json({ message: 'Major deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting major:', error);
    throw new AppError('Error deleting major', 500);
  }
}; 