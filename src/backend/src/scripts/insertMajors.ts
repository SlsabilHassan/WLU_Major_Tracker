import { connectDB } from '../config/database';
import { Major } from '../models/Major';
import majorsData from './majorsData.json';

const insertMajors = async () => {
  try {
    await connectDB();
    
    // Clear existing majors
    await Major.deleteMany({});
    console.log('Cleared existing majors');
    
    // Insert new majors
    const majors = await Major.insertMany(majorsData);
    console.log(`Inserted ${majors.length} majors`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error inserting majors:', error);
    process.exit(1);
  }
};

insertMajors(); 