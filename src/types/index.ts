export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Development' | 'Design' | 'Management' | 'Art' | 'AI For Game Dev';
  image: string;
  bio: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  images: string[];
  technologies: string[];
  teamMembers: string[];
  status: 'completed' | 'in-progress' | 'planned';
  itchUrl?: string;
  githubUrl?: string;
  awards?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'competition' | 'recognition' | 'milestone';
  placement?: string;
  competition?: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'competition' | 'meeting' | 'social';
  registrationUrl?: string;
  images?: string[];
}

export interface ApplicationForm {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    year: string;
    department: string;
    registrationNumber: string;
  };
  experience: {
    programmingLanguages: string[];
    gameEngines: string[];
    previousProjects: string;
    portfolioUrl?: string;
  };
  motivation: {
    whyJoin: string;
    goals: string;
    availability: string;
  };
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'collaboration' | 'recruitment';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'news' | 'event' | 'achievement' | 'recruitment';
  isNew?: boolean;
}

export interface AlumniMember {
  id: string;
  name: string;
  graduationYear: string;
  currentPosition: string;
  currentCompany: string;
  image: string;
  bio: string;
  contributions: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  category: 'events' | 'workshops' | 'competitions' | 'social' | 'projects';
  date: string;
  tags?: string[];
}

// Navigation and UI types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

// Three.js related types
export interface ParticleSystemConfig {
  count: number;
  colors: string[];
  size: number;
  speed: number;
}

export interface ThreeBackgroundProps {
  particleConfig?: ParticleSystemConfig;
  enableInteraction?: boolean;
  enableParallax?: boolean;
}

// Animation and interaction types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface ScrollTriggerConfig {
  threshold: number;
  rootMargin?: string;
}