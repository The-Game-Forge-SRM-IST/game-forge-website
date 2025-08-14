# Data Management System

This document describes the data management system for The Game Forge website, including data structure, validation, caching, and content update workflows.

## Overview

The data management system provides:
- **Centralized data loading** with caching for performance
- **Data validation** to ensure integrity
- **API endpoints** for serving data
- **Content update workflows** for easy maintenance
- **Image optimization** for web delivery

## Data Structure

All data is stored in JSON files in the `src/data/` directory:

```
src/data/
├── team.json           # Team member profiles
├── projects.json       # Project portfolio
├── achievements.json   # Awards and recognitions
├── events.json         # Event listings
├── alumni.json         # Alumni profiles
├── announcements.json  # News and updates
└── gallery.json        # Gallery images
```

## Data Loading

### Basic Usage

```typescript
import { 
  getTeamMembers, 
  getProjects, 
  getAchievements 
} from '@/lib/data';

// Load data with caching
const teamMembers = await getTeamMembers();
const projects = await getProjects();
const achievements = await getAchievements();

// Force refresh (bypass cache)
const freshData = await getTeamMembers(true);
```

### Available Functions

- `getTeamMembers(forceRefresh?: boolean): Promise<TeamMember[]>`
- `getProjects(forceRefresh?: boolean): Promise<Project[]>`
- `getAchievements(forceRefresh?: boolean): Promise<Achievement[]>`
- `getEvents(forceRefresh?: boolean): Promise<Event[]>`
- `getAlumniMembers(forceRefresh?: boolean): Promise<AlumniMember[]>`
- `getAnnouncements(forceRefresh?: boolean): Promise<Announcement[]>`
- `getGalleryImages(forceRefresh?: boolean): Promise<GalleryImage[]>`

### Filtering and Search

```typescript
import { 
  filterEventsByType,
  getUpcomingEvents,
  searchTeamMembers,
  filterProjectsByStatus 
} from '@/lib/data';

// Filter events by type
const workshops = filterEventsByType(events, 'workshop');
const upcomingEvents = getUpcomingEvents(events);

// Search team members
const developers = searchTeamMembers(teamMembers, 'developer');

// Filter projects by status
const completedProjects = filterProjectsByStatus(projects, 'completed');
```

## Caching System

The system includes an in-memory cache with the following features:

- **5-minute cache duration** for optimal performance
- **Automatic cache invalidation** when data is stale
- **Fallback to expired cache** if fresh data loading fails
- **Cache management utilities** for debugging

### Cache Management

```typescript
import { clearCache, clearCacheForKey, getCacheStats } from '@/lib/data';

// Clear all cached data
clearCache();

// Clear specific data type
clearCacheForKey('team');

// Get cache statistics
const stats = getCacheStats();
console.log(`Cache size: ${stats.size}, Keys: ${stats.keys.join(', ')}`);
```

## Data Validation

All data is validated using Zod schemas to ensure type safety and data integrity.

### Validation Features

- **Runtime type checking** with detailed error messages
- **Required field validation** for all data types
- **Format validation** for dates, URLs, and enums
- **Batch validation** for arrays of data

### Manual Validation

```typescript
import { validateTeamMember, validateProject } from '@/lib/data/validation';

const result = validateTeamMember(memberData);
if (result.success) {
  console.log('Valid team member:', result.data);
} else {
  console.error('Validation errors:', result.error.issues);
}
```

## Content Update Workflow

Use the content update script for easy data maintenance:

```bash
# Validate all data files
node scripts/update-content.js validate

# Show content statistics
node scripts/update-content.js stats

# Mark old announcements as not new
node scripts/update-content.js mark-old

# Show help
node scripts/update-content.js help
```

### Adding New Content

#### Team Members

```json
{
  "id": "new-member",
  "name": "John Doe",
  "role": "Game Developer",
  "department": "Development",
  "image": "/images/team/john-doe.jpg",
  "bio": "Passionate game developer with expertise in Unity and C#.",
  "skills": ["Unity", "C#", "Game Design"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

#### Projects

```json
{
  "id": "new-project",
  "title": "Amazing Game",
  "description": "A brief description of the game.",
  "longDescription": "A detailed description with features and gameplay.",
  "images": ["/images/projects/amazing-game-1.jpg"],
  "technologies": ["Unity", "C#"],
  "teamMembers": ["1", "2"],
  "status": "in-progress",
  "githubUrl": "https://github.com/gameforge/amazing-game"
}
```

#### Achievements

```json
{
  "id": "new-achievement",
  "title": "First Place - Game Jam 2025",
  "description": "Won first place with innovative puzzle game.",
  "date": "2025-03-15",
  "type": "competition",
  "placement": "1st Place",
  "competition": "Game Jam 2025",
  "image": "/images/achievements/game-jam-2025.jpg"
}
```

## Image Management

### Directory Structure

```
public/images/
├── team/           # Team member photos
├── projects/       # Project screenshots
├── achievements/   # Award certificates
├── events/         # Event photos
├── alumni/         # Alumni photos
└── gallery/        # General gallery images
```

### Image Optimization Guidelines

1. **Format**: Use WebP for modern browsers, with JPEG fallbacks
2. **Sizes**: Provide multiple sizes for responsive images
3. **Compression**: Optimize for web delivery (80-90% quality)
4. **Alt Text**: Always include descriptive alt text
5. **Lazy Loading**: Use Next.js Image component for automatic optimization

### Adding Images

1. Place images in appropriate directory under `public/images/`
2. Update corresponding JSON data file with image paths
3. Use relative paths starting with `/images/`
4. Ensure images are optimized for web delivery

## API Endpoints

The system provides REST API endpoints for all data types:

- `GET /api/data/team` - Team members
- `GET /api/data/projects` - Projects
- `GET /api/data/achievements` - Achievements
- `GET /api/data/events` - Events
- `GET /api/data/alumni` - Alumni members
- `GET /api/data/announcements` - Announcements
- `GET /api/data/gallery` - Gallery images

### Error Handling

All API endpoints include proper error handling:

```json
{
  "error": "Failed to load team data"
}
```

## Best Practices

### Data Updates

1. **Always validate** data before committing changes
2. **Use the update script** for consistency
3. **Test locally** before deploying
4. **Backup data** before major changes
5. **Follow naming conventions** for IDs and file names

### Performance

1. **Use caching** for frequently accessed data
2. **Optimize images** before adding to gallery
3. **Minimize data size** by removing unnecessary fields
4. **Use lazy loading** for large datasets

### Maintenance

1. **Regular validation** of all data files
2. **Update old announcements** monthly
3. **Archive old events** quarterly
4. **Review and update** team member information semester

## Troubleshooting

### Common Issues

**Data not loading:**
- Check API endpoint is accessible
- Verify JSON syntax is valid
- Check browser console for errors

**Validation errors:**
- Run validation script to identify issues
- Check required fields are present
- Verify data types match schema

**Cache issues:**
- Clear cache using utility functions
- Check cache duration settings
- Verify cache key consistency

**Image not displaying:**
- Check image path is correct
- Verify image file exists
- Check image permissions

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=data-management npm run dev
```

This will log cache hits/misses and validation results to the console.