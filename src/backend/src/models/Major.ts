import mongoose, { Schema, Document } from 'mongoose';
import { IRequirement, IMajor } from '../types';

const RequirementSchema = new Schema<IRequirement>({
  type: { type: String, required: true },
  label: String,
  courses: [String],
  n: Number,
  subject: String,
  credits: Number,
  level: Number
});

const MajorSchema = new Schema<IMajor & Document>({
  major: { type: String, required: true, unique: true },
  requirements: [RequirementSchema]
});

export const Major = mongoose.model<IMajor & Document>('Major', MajorSchema); 