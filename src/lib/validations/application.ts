import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number'),
  
  year: z.string()
    .min(1, 'Academic year is required'),
  
  department: z.string()
    .min(1, 'Department is required'),
  
  registrationNumber: z.string()
    .min(1, 'Registration number is required')
    .regex(/^[A-Z0-9]+$/, 'Registration number should contain only uppercase letters and numbers')
});

// Experience Schema
export const experienceSchema = z.object({
  programmingLanguages: z.array(z.string())
    .min(1, 'Please select at least one programming language'),
  
  gameEngines: z.array(z.string())
    .optional(),
  
  previousProjects: z.string()
    .min(10, 'Please provide at least 10 characters describing your projects')
    .max(1000, 'Description must be less than 1000 characters'),
  
  portfolioUrl: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
});

// Motivation Schema
export const motivationSchema = z.object({
  whyJoin: z.string()
    .min(20, 'Please provide at least 20 characters explaining why you want to join')
    .max(500, 'Response must be less than 500 characters'),
  
  goals: z.string()
    .min(20, 'Please provide at least 20 characters describing your goals')
    .max(500, 'Response must be less than 500 characters'),
  
  availability: z.string()
    .min(10, 'Please provide at least 10 characters describing your availability')
    .max(200, 'Response must be less than 200 characters')
});

// Complete Application Schema
export const applicationFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: experienceSchema,
  motivation: motivationSchema
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type MotivationFormData = z.infer<typeof motivationSchema>;
export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

// Available options for form fields
export const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Graduate',
  'Post Graduate'
];

export const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Other'
];

export const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'C',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Dart',
  'PHP',
  'Ruby',
  'Scala',
  'Other'
];

export const GAME_ENGINES = [
  'Unity',
  'Unreal Engine',
  'Godot',
  'GameMaker Studio',
  'Construct 3',
  'Defold',
  'Cocos2d',
  'Phaser',
  'Three.js',
  'Babylon.js',
  'Custom Engine',
  'Other'
];