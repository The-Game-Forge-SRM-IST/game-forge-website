/**
 * Data validation utilities for Game Forge website
 * Ensures data integrity and provides helpful error messages
 */

import { z } from 'zod';

// Zod schemas for runtime validation
export const TeamMemberSchema = z.object({
  id: z.string().min(1, 'Team member ID is required'),
  name: z.string().min(1, 'Team member name is required'),
  role: z.string().min(1, 'Team member role is required'),
  department: z.enum(['Development', 'Design', 'Management', 'Art', 'AI For Game Dev'], {
    message: 'Department must be Development, Design, Management, Art, or AI For Game Dev'
  }),
  image: z.string().url('Team member image must be a valid URL'),
  bio: z.string().min(10, 'Team member bio must be at least 10 characters'),
  skills: z.array(z.string()).min(1, 'Team member must have at least one skill'),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  })
});

export const ProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Project description must be at least 10 characters'),
  longDescription: z.string().min(50, 'Project long description must be at least 50 characters'),
  images: z.array(z.string().url()).min(1, 'Project must have at least one image'),
  technologies: z.array(z.string()).min(1, 'Project must use at least one technology'),
  teamMembers: z.array(z.string()).min(1, 'Project must have at least one team member'),
  status: z.enum(['completed', 'in-progress', 'planned'], {
    message: 'Status must be completed, in-progress, or planned'
  }),
  itchUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  awards: z.array(z.string()).optional(),
});

export const AchievementSchema = z.object({
  id: z.string().min(1, 'Achievement ID is required'),
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().min(10, 'Achievement description must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: z.enum(['competition', 'recognition', 'milestone'], {
    message: 'Type must be competition, recognition, or milestone'
  }),
  placement: z.string().optional(),
  competition: z.string().optional(),
  image: z.string().url().optional(),
});

export const EventSchema = z.object({
  id: z.string().min(1, 'Event ID is required'),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().min(10, 'Event description must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  location: z.string().min(1, 'Event location is required'),
  type: z.enum(['workshop', 'competition', 'meeting', 'social'], {
    message: 'Type must be workshop, competition, meeting, or social'
  }),
  registrationUrl: z.string().url().optional(),
  images: z.array(z.string()).optional(),
});

export const AlumniMemberSchema = z.object({
  id: z.string().min(1, 'Alumni ID is required'),
  name: z.string().min(1, 'Alumni name is required'),
  graduationYear: z.string().regex(/^\d{4}$/, 'Graduation year must be a 4-digit year'),
  currentPosition: z.string().min(1, 'Current position is required'),
  currentCompany: z.string().min(1, 'Current company is required'),
  image: z.string().min(1, 'Alumni image is required'),
  bio: z.string().min(10, 'Alumni bio must be at least 10 characters'),
  contributions: z.array(z.string()).min(1, 'Alumni must have at least one contribution'),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    portfolio: z.string().url().optional(),
  })
});

export const AnnouncementSchema = z.object({
  id: z.string().min(1, 'Announcement ID is required'),
  title: z.string().min(1, 'Announcement title is required'),
  content: z.string().min(10, 'Announcement content must be at least 10 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: z.enum(['news', 'event', 'achievement', 'recruitment'], {
    message: 'Type must be news, event, achievement, or recruitment'
  }),
  isNew: z.boolean().optional(),
});

export const GalleryImageSchema = z.object({
  id: z.string().min(1, 'Gallery image ID is required'),
  src: z.string().min(1, 'Gallery image source is required'),
  alt: z.string().min(1, 'Gallery image alt text is required'),
  title: z.string().min(1, 'Gallery image title is required'),
  description: z.string().optional(),
  category: z.enum(['events', 'workshops', 'competitions', 'social', 'projects'], {
    message: 'Category must be events, workshops, competitions, social, or projects'
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  tags: z.array(z.string()).optional(),
});

// Validation functions
export function validateTeamMember(data: unknown) {
  return TeamMemberSchema.safeParse(data);
}

export function validateProject(data: unknown) {
  return ProjectSchema.safeParse(data);
}

export function validateAchievement(data: unknown) {
  return AchievementSchema.safeParse(data);
}

export function validateEvent(data: unknown) {
  return EventSchema.safeParse(data);
}

export function validateAlumniMember(data: unknown) {
  return AlumniMemberSchema.safeParse(data);
}

export function validateAnnouncement(data: unknown) {
  return AnnouncementSchema.safeParse(data);
}

export function validateGalleryImage(data: unknown) {
  return GalleryImageSchema.safeParse(data);
}

// Batch validation functions
export function validateTeamMembers(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateTeamMember(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateProjects(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateProject(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateAchievements(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateAchievement(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateEvents(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateEvent(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateAlumniMembers(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateAlumniMember(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateAnnouncements(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateAnnouncement(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}

export function validateGalleryImages(data: unknown[]) {
  const results = data.map((item, index) => ({
    index,
    result: validateGalleryImage(item)
  }));
  
  const valid = results.filter(r => r.result.success).map(r => r.result.data);
  const invalid = results.filter(r => !r.result.success);
  
  return { valid, invalid };
}