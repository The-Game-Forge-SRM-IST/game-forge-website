/**
 * Custom hooks for data loading with caching and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import {
  TeamMember,
  Project,
  Achievement,
  Event,
  AlumniMember,
  Announcement,
  GalleryImage
} from '@/types';
import {
  getTeamMembers,
  getProjects,
  getAchievements,
  getEvents,
  getAlumniMembers,
  getAnnouncements,
  getGalleryImages,
  clearCache,
  clearCacheForKey
} from '@/lib/data';

// Generic data loading hook
function useDataLoader<T>(
  loader: (forceRefresh?: boolean) => Promise<T>,
  cacheKey: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const result = await loader(forceRefresh);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error(`Error loading ${cacheKey}:`, err);
    } finally {
      setLoading(false);
    }
  }, [loader, cacheKey]);

  const refresh = useCallback(() => {
    clearCacheForKey(cacheKey);
    loadData(true);
  }, [loadData, cacheKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refresh,
    reload: () => loadData(false)
  };
}

// Specific hooks for each data type
export function useTeamMembers() {
  return useDataLoader<TeamMember[]>(getTeamMembers, 'team');
}

export function useProjects() {
  return useDataLoader<Project[]>(getProjects, 'projects');
}

export function useAchievements() {
  return useDataLoader<Achievement[]>(getAchievements, 'achievements');
}

export function useEvents() {
  return useDataLoader<Event[]>(getEvents, 'events');
}

export function useAlumniMembers() {
  return useDataLoader<AlumniMember[]>(getAlumniMembers, 'alumni');
}

export function useAnnouncements() {
  return useDataLoader<Announcement[]>(getAnnouncements, 'announcements');
}

export function useGalleryImages() {
  return useDataLoader<GalleryImage[]>(getGalleryImages, 'gallery');
}

// Combined data hook for dashboard/overview pages
export function useAllData() {
  const teamMembers = useTeamMembers();
  const projects = useProjects();
  const achievements = useAchievements();
  const events = useEvents();
  const alumni = useAlumniMembers();
  const announcements = useAnnouncements();
  const gallery = useGalleryImages();

  const loading = [
    teamMembers.loading,
    projects.loading,
    achievements.loading,
    events.loading,
    alumni.loading,
    announcements.loading,
    gallery.loading
  ].some(Boolean);

  const error = [
    teamMembers.error,
    projects.error,
    achievements.error,
    events.error,
    alumni.error,
    announcements.error,
    gallery.error
  ].find(Boolean);

  const refreshAll = useCallback(() => {
    clearCache();
    teamMembers.refresh();
    projects.refresh();
    achievements.refresh();
    events.refresh();
    alumni.refresh();
    announcements.refresh();
    gallery.refresh();
  }, [
    teamMembers.refresh,
    projects.refresh,
    achievements.refresh,
    events.refresh,
    alumni.refresh,
    announcements.refresh,
    gallery.refresh
  ]);

  return {
    data: {
      teamMembers: teamMembers.data,
      projects: projects.data,
      achievements: achievements.data,
      events: events.data,
      alumni: alumni.data,
      announcements: announcements.data,
      gallery: gallery.data
    },
    loading,
    error,
    refreshAll,
    individual: {
      teamMembers,
      projects,
      achievements,
      events,
      alumni,
      announcements,
      gallery
    }
  };
}

// Filtered data hooks
export function useUpcomingEvents() {
  const { data: events, loading, error, refresh } = useEvents();
  
  const upcomingEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate >= now;
  }) || [];

  return {
    data: upcomingEvents,
    loading,
    error,
    refresh
  };
}

export function usePastEvents() {
  const { data: events, loading, error, refresh } = useEvents();
  
  const pastEvents = events?.filter(event => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate < now;
  }) || [];

  return {
    data: pastEvents,
    loading,
    error,
    refresh
  };
}

export function useCompletedProjects() {
  const { data: projects, loading, error, refresh } = useProjects();
  
  const completedProjects = projects?.filter(project => 
    project.status === 'completed'
  ) || [];

  return {
    data: completedProjects,
    loading,
    error,
    refresh
  };
}

export function useInProgressProjects() {
  const { data: projects, loading, error, refresh } = useProjects();
  
  const inProgressProjects = projects?.filter(project => 
    project.status === 'in-progress'
  ) || [];

  return {
    data: inProgressProjects,
    loading,
    error,
    refresh
  };
}

export function useRecentAchievements(limit = 5) {
  const { data: achievements, loading, error, refresh } = useAchievements();
  
  const recentAchievements = achievements?.slice(0, limit) || [];

  return {
    data: recentAchievements,
    loading,
    error,
    refresh
  };
}

export function useNewAnnouncements() {
  const { data: announcements, loading, error, refresh } = useAnnouncements();
  
  const newAnnouncements = announcements?.filter(announcement => 
    announcement.isNew
  ) || [];

  return {
    data: newAnnouncements,
    loading,
    error,
    refresh
  };
}

export function useTeamMembersByDepartment(department: TeamMember['department']) {
  const { data: teamMembers, loading, error, refresh } = useTeamMembers();
  
  const filteredMembers = teamMembers?.filter(member => 
    member.department === department
  ) || [];

  return {
    data: filteredMembers,
    loading,
    error,
    refresh
  };
}

export function useGalleryByCategory(category: GalleryImage['category']) {
  const { data: gallery, loading, error, refresh } = useGalleryImages();
  
  const filteredImages = gallery?.filter(image => 
    image.category === category
  ) || [];

  return {
    data: filteredImages,
    loading,
    error,
    refresh
  };
}

// Search hooks
export function useSearchTeamMembers(query: string) {
  const { data: teamMembers, loading, error, refresh } = useTeamMembers();
  
  const searchResults = teamMembers?.filter(member => {
    const searchTerm = query.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchTerm) ||
      member.role.toLowerCase().includes(searchTerm) ||
      member.department.toLowerCase().includes(searchTerm) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  }) || [];

  return {
    data: searchResults,
    loading,
    error,
    refresh,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length
  };
}

export function useSearchProjects(query: string) {
  const { data: projects, loading, error, refresh } = useProjects();
  
  const searchResults = projects?.filter(project => {
    const searchTerm = query.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }) || [];

  return {
    data: searchResults,
    loading,
    error,
    refresh,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length
  };
}

// Statistics hooks
export function useDataStatistics() {
  const allData = useAllData();
  
  const statistics = {
    totalTeamMembers: allData.data.teamMembers?.length || 0,
    totalProjects: allData.data.projects?.length || 0,
    completedProjects: allData.data.projects?.filter(p => p.status === 'completed').length || 0,
    inProgressProjects: allData.data.projects?.filter(p => p.status === 'in-progress').length || 0,
    totalAchievements: allData.data.achievements?.length || 0,
    competitionAchievements: allData.data.achievements?.filter(a => a.type === 'competition').length || 0,
    upcomingEvents: allData.data.events?.filter(e => new Date(e.date) >= new Date()).length || 0,
    totalAlumni: allData.data.alumni?.length || 0,
    newAnnouncements: allData.data.announcements?.filter(a => a.isNew).length || 0,
    totalGalleryImages: allData.data.gallery?.length || 0,
    departmentBreakdown: {
      development: allData.data.teamMembers?.filter(m => m.department === 'Development').length || 0,
      design: allData.data.teamMembers?.filter(m => m.department === 'Design').length || 0,
      management: allData.data.teamMembers?.filter(m => m.department === 'Management').length || 0
    }
  };

  return {
    statistics,
    loading: allData.loading,
    error: allData.error,
    refresh: allData.refreshAll
  };
}