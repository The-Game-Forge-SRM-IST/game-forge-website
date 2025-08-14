# Gallery Images

This directory contains images for the gallery section of The Game Forge website.

## Expected Images

The following images are referenced in the gallery data (`src/data/gallery.json`):

### Events
- `game-jam-2024.jpg` - Game Jam 2024 participants working on their projects
- `indie-game-night.jpg` - Students playing indie games together
- `guest-speaker.jpg` - Industry professional giving a talk to students

### Workshops
- `unity-workshop.jpg` - Unity workshop session with students learning game development
- `blender-workshop.jpg` - 3D modeling workshop using Blender
- `game-design-workshop.jpg` - Game design workshop with brainstorming session

### Competitions
- `hackathon-win.jpg` - Team celebrating hackathon victory
- `coding-competition.jpg` - Participants focused during coding competition

### Social
- `team-dinner.jpg` - Team members enjoying dinner together
- `club-meetup.jpg` - Weekly club meetup with all members

### Projects
- `project-showcase.jpg` - Students presenting their game projects
- `vr-demo.jpg` - Students testing VR game prototype

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: Recommended minimum 800x600px for good quality
- **Aspect Ratio**: Mixed aspect ratios work well with the masonry layout
- **File Size**: Optimize for web (under 500KB per image recommended)
- **Naming**: Use descriptive, kebab-case filenames

## Adding New Images

1. Add the image file to this directory
2. Update `src/data/gallery.json` with the new image data
3. Include appropriate metadata (title, description, category, date, tags)

## Placeholder Images

For development purposes, placeholder images are currently stored in `/public/images/`:
- `placeholder-800x600.jpg` - Blue placeholder (800x600)
- `placeholder-600x800.jpg` - Green placeholder (600x800)
- `placeholder-900x600.jpg` - Red placeholder (900x600)
- `placeholder-700x500.jpg` - Purple placeholder (700x500)
- `placeholder-800x900.jpg` - Yellow placeholder (800x900)
- And other variations for different aspect ratios

These can be replaced with actual gallery images as they become available.