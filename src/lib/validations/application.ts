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

  course: z.string()
    .min(1, 'Course is required'),

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
  '5th Year',
  '6th Year'
];

export const DEPARTMENTS = [
  'Aerospace Engineering',
  'Automotive Engineering',
  'Architecture and Interior Design',
  'Biomedical Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Civil Engineering',
  'Computational Intelligence',
  'Computing Technologies',
  'Data Science And Business Systems',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Electronics & Instrumentation Engineering',
  'Genetic Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Networking and Communications',
  'Physics and Nanotechnology'
];

// Department-specific courses mapping
export const DEPARTMENT_COURSES: Record<string, string[]> = {
  'Aerospace Engineering': [
    'B.Tech – Aerospace Engineering'
  ],
  'Automotive Engineering': [
    'B.Tech – Automobile Engineering',
    'B.Tech – Automobile Engineering with Specialization in Automotive Electronics',
    'B.Tech – Automotive Engineering (ARAI)',
    'B.Tech – Automobile Engineering with Specialization in Vehicles Testing (GARC)'
  ],
  'Architecture and Interior Design': [
    'B.Des. Interior Design'
  ],
  'Biomedical Engineering': [
    'B.Tech – Biomedical Engineering',
    'B.Tech – Biomedical Engineering with specialisation in Machine Intelligence'
  ],
  'Biotechnology': [
    'B.Tech – Biotechnology',
    'B.Tech – Biotechnology with specialization in Food Technology',
    'B.Tech – Biotechnology (Computational Biology)',
    'B.Tech – Biotechnology with specialization in Regenerative Medicine'
  ],
  'Chemical Engineering': [
    'B.Tech – Chemical Engineering'
  ],
  'Civil Engineering': [
    'B.Tech – Civil Engineering',
    'B.Tech – Civil Engineering with Computer Applications'
  ],
  'Computational Intelligence': [
    'B.Tech – Artificial Intelligence',
    'B.Tech – Computer Science And Engineering with Specialization in Artificial Intelligence and Machine Learning',
    'B.Tech – Computer Science And Engineering with Specialization in Software Engineering',
    'Integrated M.Tech in Artificial Intelligence',
    'Integrated M.Tech in Computer Science And Engineering with Specialization in Cognitive Computing'
  ],
  'Computing Technologies': [
    'B.Tech – Computer Science and Engineering',
    'Integrated M.Tech. in Computer Science and Engineering'
  ],
  'Data Science And Business Systems': [
    'B.Tech – Computer Science and Business Systems',
    'B.Tech – Computer Science And Engineering with Specialization in Big Data Analytics',
    'B.Tech – Computer Science And Engineering with Specialization in Blockchain Technology',
    'B.Tech. Computer Science And Engineering (Data Science)',
    'B.Tech – Computer Science And Engineering with Specialization in Gaming Technology',
    'Integrated M.Tech – Computer Science And Engineering with Specialization in Data Science'
  ],
  'Electrical & Electronics Engineering': [
    'B.Tech – Electrical & Electronics Engineering',
    'B.Tech – Electric Vehicle Technology'
  ],
  'Electronics & Communication Engineering': [
    'B.Tech – Electronics & Communication Engineering',
    'B.Tech – Electronics And Communication And Engineering with Specialization in Data Sciences',
    'B.Tech – Electronics And Communication Engineering with Specialization in Cyber-Physical Systems',
    'B.Tech – Electronics And Computer Engineering',
    'B.Tech Electronics Engineering (VLSI Design and Technology)',
    'Integrated M.Tech Electronics And Communication Engineering with Specialization in Micro Electronics System Design'
  ],
  'Electronics & Instrumentation Engineering': [
    'B.Tech – Electronics And Instrumentation Engineering',
    'B.Tech -Electronics and Communication Engineering with specialization in Instrumentation Engineering',
    'B.Tech – Automation & Robotics'
  ],
  'Genetic Engineering': [
    'B.Tech in Biotechnology with Genetic Engineering specialization'
  ],
  'Mechanical Engineering': [
    'B.Tech – Mechanical Engineering',
    'B.Tech – Mechanical Engineering with specialization in Artificial Intelligence and Machine Learning',
    'B.Tech – Mechanical Engineering with specialization in Automation and Robotics',
    'Integrated M.Tech. in Mechanical Engineering'
  ],
  'Mechatronics Engineering': [
    'B.Tech – Mechatronics Engineering',
    'B.Tech – Mechatronics Engineering with specialization in Autonomous Driving Technology',
    'B.Tech – Mechatronics Engineering with specialization in Immersive Technologies',
    'B.Tech – Mechatronics Engineering with specialization in Industrial IoT and Systems Engineering',
    'B.Tech – Mechatronics Engineering with Specialization in Robotics'
  ],
  'Networking and Communications': [
    'B.Tech – Computer Science And Engineering with Specialization in Cloud Computing',
    'B.Tech – Computer Science And Engineering with Specialization in Computer Networking',
    'B.Tech – Computer Science And Engineering with Specialization in Information Technology',
    'B.Tech – Computer Science And Engineering with Specialization in Internet of Things',
    'B.Tech -Computer Science And Engineering with Specialization in Cyber Security',
    'Integrated M.Tech – Computer Science And Engineering with Specialization in Cyber Security and Digital Forensics'
  ],
  'Physics and Nanotechnology': [
    'B.Tech – Nanotechnology',
    'Integrated M.Tech in Material Science and Engineering'
  ]
};

// Get courses for a specific department
export const getCoursesByDepartment = (department: string): string[] => {
  return DEPARTMENT_COURSES[department] || [];
};

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