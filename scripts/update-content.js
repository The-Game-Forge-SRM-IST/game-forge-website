#!/usr/bin/env node

/**
 * Content Update Workflow Script
 * Provides utilities for updating and validating content data
 */

const fs = require('fs');
const path = require('path');

// Data file paths
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const DATA_FILES = {
  team: path.join(DATA_DIR, 'team.json'),
  projects: path.join(DATA_DIR, 'projects.json'),
  achievements: path.join(DATA_DIR, 'achievements.json'),
  events: path.join(DATA_DIR, 'events.json'),
  alumni: path.join(DATA_DIR, 'alumni.json'),
  announcements: path.join(DATA_DIR, 'announcements.json'),
  gallery: path.join(DATA_DIR, 'gallery.json'),
};

// Utility functions
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully updated ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    return false;
  }
}

function validateDataStructure(data, type) {
  const requiredFields = {
    team: ['id', 'name', 'role', 'department', 'image', 'bio', 'skills', 'socialLinks'],
    projects: ['id', 'title', 'description', 'longDescription', 'images', 'technologies', 'teamMembers', 'status'],
    achievements: ['id', 'title', 'description', 'date', 'type'],
    events: ['id', 'title', 'description', 'date', 'time', 'location', 'type'],
    alumni: ['id', 'name', 'graduationYear', 'currentPosition', 'currentCompany', 'image', 'bio', 'contributions', 'socialLinks'],
    announcements: ['id', 'title', 'content', 'date', 'type'],
    gallery: ['id', 'src', 'alt', 'title', 'category', 'date'],
  };

  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Data must be an array'] };
  }

  const errors = [];
  const fields = requiredFields[type];

  data.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) {
      errors.push(`Item ${index}: Must be an object`);
      return;
    }

    fields.forEach(field => {
      if (!(field in item)) {
        errors.push(`Item ${index}: Missing required field '${field}'`);
      }
    });

    // Type-specific validations
    if (type === 'team' && item.department && !['Development', 'Design', 'Management', 'Art', 'AI For Game Dev'].includes(item.department)) {
      errors.push(`Item ${index}: Invalid department '${item.department}'`);
    }

    if (type === 'projects' && item.status && !['completed', 'in-progress', 'planned'].includes(item.status)) {
      errors.push(`Item ${index}: Invalid status '${item.status}'`);
    }

    if (type === 'achievements' && item.type && !['competition', 'recognition', 'milestone'].includes(item.type)) {
      errors.push(`Item ${index}: Invalid type '${item.type}'`);
    }

    if (type === 'events' && item.type && !['workshop', 'competition', 'meeting', 'social'].includes(item.type)) {
      errors.push(`Item ${index}: Invalid type '${item.type}'`);
    }

    if (type === 'announcements' && item.type && !['news', 'event', 'achievement', 'recruitment'].includes(item.type)) {
      errors.push(`Item ${index}: Invalid type '${item.type}'`);
    }

    if (type === 'gallery' && item.category && !['events', 'workshops', 'competitions', 'social', 'projects'].includes(item.category)) {
      errors.push(`Item ${index}: Invalid category '${item.category}'`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Command functions
function validateAll() {
  console.log('🔍 Validating all data files...\n');
  
  let allValid = true;
  
  Object.entries(DATA_FILES).forEach(([type, filePath]) => {
    console.log(`Validating ${type}...`);
    const data = readJsonFile(filePath);
    
    if (!data) {
      allValid = false;
      return;
    }
    
    const validation = validateDataStructure(data, type);
    
    if (validation.valid) {
      console.log(`✅ ${type} data is valid (${data.length} items)`);
    } else {
      console.log(`❌ ${type} data has errors:`);
      validation.errors.forEach(error => console.log(`   - ${error}`));
      allValid = false;
    }
    console.log('');
  });
  
  if (allValid) {
    console.log('🎉 All data files are valid!');
  } else {
    console.log('⚠️  Some data files have validation errors. Please fix them before deploying.');
    process.exit(1);
  }
}

function addTeamMember(memberData) {
  const data = readJsonFile(DATA_FILES.team);
  if (!data) return;
  
  // Generate ID if not provided
  if (!memberData.id) {
    const maxId = Math.max(...data.map(m => parseInt(m.id) || 0));
    memberData.id = (maxId + 1).toString();
  }
  
  // Add default values
  memberData.socialLinks = memberData.socialLinks || {};
  
  data.push(memberData);
  writeJsonFile(DATA_FILES.team, data);
}

function addProject(projectData) {
  const data = readJsonFile(DATA_FILES.projects);
  if (!data) return;
  
  // Add default values
  projectData.images = projectData.images || [];
  projectData.technologies = projectData.technologies || [];
  projectData.teamMembers = projectData.teamMembers || [];
  projectData.status = projectData.status || 'planned';
  
  data.push(projectData);
  writeJsonFile(DATA_FILES.projects, data);
}

function addAchievement(achievementData) {
  const data = readJsonFile(DATA_FILES.achievements);
  if (!data) return;
  
  // Generate ID if not provided
  if (!achievementData.id) {
    const maxId = Math.max(...data.map(a => parseInt(a.id) || 0));
    achievementData.id = (maxId + 1).toString();
  }
  
  data.push(achievementData);
  
  // Sort by date (newest first)
  data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  writeJsonFile(DATA_FILES.achievements, data);
}

function addEvent(eventData) {
  const data = readJsonFile(DATA_FILES.events);
  if (!data) return;
  
  // Generate ID if not provided
  if (!eventData.id) {
    const maxId = Math.max(...data.map(e => parseInt(e.id) || 0));
    eventData.id = (maxId + 1).toString();
  }
  
  // Add default values
  eventData.images = eventData.images || [];
  
  data.push(eventData);
  writeJsonFile(DATA_FILES.events, data);
}

function addAnnouncement(announcementData) {
  const data = readJsonFile(DATA_FILES.announcements);
  if (!data) return;
  
  // Generate ID if not provided
  if (!announcementData.id) {
    const maxId = Math.max(...data.map(a => parseInt(a.id) || 0));
    announcementData.id = (maxId + 1).toString();
  }
  
  // Set as new by default
  announcementData.isNew = announcementData.isNew !== false;
  
  data.push(announcementData);
  
  // Sort by date (newest first)
  data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  writeJsonFile(DATA_FILES.announcements, data);
}

function markAnnouncementsAsOld() {
  const data = readJsonFile(DATA_FILES.announcements);
  if (!data) return;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let updated = false;
  data.forEach(announcement => {
    const announcementDate = new Date(announcement.date);
    if (announcementDate < thirtyDaysAgo && announcement.isNew) {
      announcement.isNew = false;
      updated = true;
    }
  });
  
  if (updated) {
    writeJsonFile(DATA_FILES.announcements, data);
    console.log('✅ Updated old announcements');
  } else {
    console.log('ℹ️  No announcements needed updating');
  }
}

function showStats() {
  console.log('📊 Content Statistics:\n');
  
  Object.entries(DATA_FILES).forEach(([type, filePath]) => {
    const data = readJsonFile(filePath);
    if (data) {
      console.log(`${type.padEnd(15)}: ${data.length} items`);
    }
  });
  
  console.log('');
}

// CLI interface
function showHelp() {
  console.log(`
Game Forge Content Update Tool

Usage: node update-content.js <command> [options]

Commands:
  validate              Validate all data files
  stats                 Show content statistics
  mark-old              Mark announcements older than 30 days as not new
  help                  Show this help message

Examples:
  node update-content.js validate
  node update-content.js stats
  node update-content.js mark-old
`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'validate':
    validateAll();
    break;
  case 'stats':
    showStats();
    break;
  case 'mark-old':
    markAnnouncementsAsOld();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.log('❌ Unknown command. Use "help" to see available commands.');
    process.exit(1);
}