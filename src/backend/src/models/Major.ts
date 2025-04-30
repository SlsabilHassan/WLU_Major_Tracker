import mongoose, { Document, Schema } from 'mongoose';

export interface IRequirement {
  type: 'all' | 'one_of' | 'n_of' | 'credits';
  label: string;
  courses?: string[];
  n?: number;
  subject?: string;
  credits?: number;
  level?: number;
}

export interface IMajor extends Document {
  major: string;
  requirements: IRequirement[];
}

const requirementSchema = new Schema({
  type: {
    type: String,
    enum: ['all', 'one_of', 'n_of', 'credits'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  courses: [String],
  n: Number,
  subject: String,
  credits: Number,
  level: Number
});

const majorSchema = new Schema({
  major: {
    type: String,
    required: true,
    unique: true
  },
  requirements: [requirementSchema]
});

export const Major = mongoose.model<IMajor>('Major', majorSchema); 