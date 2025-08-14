/**
 * Data Management System for Game Forge Website
 * Provides centralized data loading, caching, and validation
 */

import { 
  TeamMember, 
  Project, 
  Achievement, 
  Event, 
  AlumniMember, 
  Announcement, 
  GalleryImage 
} from '@/types';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * Generic data loader with caching
 */
async function loadData<T>(
  key: string, 
  loader: () => Promise<T>,
  forceRefresh = false
): Promise<T> {
  // Check cache first
  if (!forceRefresh && cache.has(key)) {
    const cached = cache.get(key)!;
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T;
    }
  }

  try {
    const data = await loader();
    
    // Update cache
    cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error(`Failed to load data for key: ${key}`, error);
    
    // Return cached data if available, even if expired
    if (cache.has(key)) {
      console.warn(`Using expired cache for key: ${key}`);
      return cache.get(key)!.data as T;
    }
    
    throw error;
  }
}

/**
 * Data validation utilities
 */
function validateTeamMember(member: unknown): member is TeamMember {
  if (typeof member !== 'object' || member === null) return false;
  const m = member as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.role === 'string' &&
    ['Development', 'Design', 'Management', 'Art', 'AI For Game Dev'].includes(m.department as string) &&
    typeof m.image === 'string' &&
    typeof m.bio === 'string' &&
    Array.isArray(m.skills) &&
    typeof m.socialLinks === 'object'
  );
}

function validateProject(project: unknown): project is Project {
  if (typeof project !== 'object' || project === null) return false;
  const p = project as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    typeof p.description === 'string' &&
    typeof p.longDescription === 'string' &&
    Array.isArray(p.images) &&
    Array.isArray(p.technologies) &&
    Array.isArray(p.teamMembers) &&
    ['completed', 'in-progress', 'planned'].includes(p.status as string)
  );
}

function validateAchievement(achievement: unknown): achievement is Achievement {
  if (typeof achievement !== 'object' || achievement === null) return false;
  const a = achievement as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.title === 'string' &&
    typeof a.description === 'string' &&
    typeof a.date === 'string' &&
    ['competition', 'recognition', 'milestone'].includes(a.type as string)
  );
}

function validateEvent(event: unknown): event is Event {
  if (typeof event !== 'object' || event === null) return false;
  const e = event as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.title === 'string' &&
    typeof e.description === 'string' &&
    typeof e.date === 'string' &&
    typeof e.time === 'string' &&
    typeof e.location === 'string' &&
    ['workshop', 'competition', 'meeting', 'social'].includes(e.type as string)
  );
}

function validateAlumniMember(alumni: unknown): alumni is AlumniMember {
  if (typeof alumni !== 'object' || alumni === null) return false;
  const a = alumni as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.graduationYear === 'string' &&
    typeof a.currentPosition === 'string' &&
    typeof a.currentCompany === 'string' &&
    typeof a.image === 'string' &&
    typeof a.bio === 'string' &&
    Array.isArray(a.contributions)
  );
}

function validateAnnouncement(announcement: unknown): announcement is Announcement {
  if (typeof announcement !== 'object' || announcement === null) return false;
  const a = announcement as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.title === 'string' &&
    typeof a.content === 'string' &&
    typeof a.date === 'string' &&
    ['news', 'event', 'achievement', 'recruitment'].includes(a.type as string)
  );
}

function validateGalleryImage(image: unknown): image is GalleryImage {
  if (typeof image !== 'object' || image === null) return false;
  const i = image as Record<string, unknown>;
  return (
    typeof i.id === 'string' &&
    typeof i.src === 'string' &&
    typeof i.alt === 'string' &&
    typeof i.title === 'string' &&
    ['events', 'workshops', 'competitions', 'social', 'projects'].includes(i.category as string) &&
    typeof i.date === 'string'
  );
}

/**
 * Data loading functions
 */
export async function getTeamMembers(forceRefresh = false): Promise<TeamMember[]> {
  return loadData('team', async () => {
    const response = await fetch('/api/data/team');
    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Validate data
    if (!Array.isArray(data)) {
      throw new Error('Team data must be an array');
    }
    
    const validMembers = data.filter(validateTeamMember);
    if (validMembers.length !== data.length) {
      console.warn(`${data.length - validMembers.length} invalid team members filtered out`);
    }
    
    return validMembers;
  }, forceRefresh);
}

export async function getProjects(forceRefresh = false): Promise<Project[]> {
  return loadData('projects', async () => {
    const response = await fetch('/api/data/projects');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Projects data must be an array');
    }
    
    const validProjects = data.filter(validateProject);
    if (validProjects.length !== data.length) {
      console.warn(`${data.length - validProjects.length} invalid projects filtered out`);
    }
    
    return validProjects;
  }, forceRefresh);
}

export async function getAchievements(forceRefresh = false): Promise<Achievement[]> {
  return loadData('achievements', async () => {
    const response = await fetch('/api/data/achievements');
    if (!response.ok) {
      throw new Error(`Failed to fetch achievements data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Achievements data must be an array');
    }
    
    const validAchievements = data.filter(validateAchievement);
    if (validAchievements.length !== data.length) {
      console.warn(`${data.length - validAchievements.length} invalid achievements filtered out`);
    }
    
    // Sort by date (newest first)
    return validAchievements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, forceRefresh);
}

export async function getEvents(forceRefresh = false): Promise<Event[]> {
  return loadData('events', async () => {
    const response = await fetch('/api/data/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Events data must be an array');
    }
    
    const validEvents = data.filter(validateEvent);
    if (validEvents.length !== data.length) {
      console.warn(`${data.length - validEvents.length} invalid events filtered out`);
    }
    
    // Sort by date (upcoming first, then past events)
    const now = new Date();
    return validEvents.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Upcoming events first, sorted by date ascending
      if (dateA >= now && dateB >= now) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // Past events last, sorted by date descending
      if (dateA < now && dateB < now) {
        return dateB.getTime() - dateA.getTime();
      }
      
      // Upcoming events before past events
      return dateA >= now ? -1 : 1;
    });
  }, forceRefresh);
}

export async function getAlumniMembers(forceRefresh = false): Promise<AlumniMember[]> {
  return loadData('alumni', async () => {
    const response = await fetch('/api/data/alumni');
    if (!response.ok) {
      throw new Error(`Failed to fetch alumni data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Alumni data must be an array');
    }
    
    const validAlumni = data.filter(validateAlumniMember);
    if (validAlumni.length !== data.length) {
      console.warn(`${data.length - validAlumni.length} invalid alumni filtered out`);
    }
    
    // Sort by graduation year (newest first)
    return validAlumni.sort((a, b) => parseInt(b.graduationYear) - parseInt(a.graduationYear));
  }, forceRefresh);
}

export async function getAnnouncements(forceRefresh = false): Promise<Announcement[]> {
  return loadData('announcements', async () => {
    const response = await fetch('/api/data/announcements');
    if (!response.ok) {
      throw new Error(`Failed to fetch announcements data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Announcements data must be an array');
    }
    
    const validAnnouncements = data.filter(validateAnnouncement);
    if (validAnnouncements.length !== data.length) {
      console.warn(`${data.length - validAnnouncements.length} invalid announcements filtered out`);
    }
    
    // Sort by date (newest first)
    return validAnnouncements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, forceRefresh);
}

export async function getGalleryImages(forceRefresh = false): Promise<GalleryImage[]> {
  return loadData('gallery', async () => {
    const response = await fetch('/api/data/gallery');
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery data: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Gallery data must be an array');
    }
    
    const validImages = data.filter(validateGalleryImage);
    if (validImages.length !== data.length) {
      console.warn(`${data.length - validImages.length} invalid gallery images filtered out`);
    }
    
    // Sort by date (newest first)
    return validImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, forceRefresh);
}

/**
 * Utility functions for data filtering and searching
 */
export function filterEventsByType(events: Event[], type: Event['type']): Event[] {
  return events.filter(event => event.type === type);
}

export function getUpcomingEvents(events: Event[]): Event[] {
  const now = new Date();
  return events.filter(event => new Date(event.date) >= now);
}

export function getPastEvents(events: Event[]): Event[] {
  const now = new Date();
  return events.filter(event => new Date(event.date) < now);
}

export function filterProjectsByStatus(projects: Project[], status: Project['status']): Project[] {
  return projects.filter(project => project.status === status);
}

export function filterAchievementsByType(achievements: Achievement[], type: Achievement['type']): Achievement[] {
  return achievements.filter(achievement => achievement.type === type);
}

export function filterGalleryByCategory(images: GalleryImage[], category: GalleryImage['category']): GalleryImage[] {
  return images.filter(image => image.category === category);
}

export function searchTeamMembers(members: TeamMember[], query: string): TeamMember[] {
  const lowercaseQuery = query.toLowerCase();
  return members.filter(member => 
    member.name.toLowerCase().includes(lowercaseQuery) ||
    member.role.toLowerCase().includes(lowercaseQuery) ||
    member.department.toLowerCase().includes(lowercaseQuery) ||
    member.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
  );
}

export function searchProjects(projects: Project[], query: string): Project[] {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Cache management utilities
 */
export function clearCache(): void {
  cache.clear();
}

export function clearCacheForKey(key: string): void {
  cache.delete(key);
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}