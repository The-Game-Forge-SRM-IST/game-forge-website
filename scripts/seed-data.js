#!/usr/bin/env node

/**
 * Data Seeding Script
 * Populates the data files with comprehensive, realistic content
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Enhanced team data with proper image paths
const teamData = [
  {
    "id": "alex-chen",
    "name": "Alex Chen",
    "role": "Club President",
    "department": "Management",
    "image": "/images/team/alex-chen.jpg",
    "bio": "Passionate game developer with 3+ years of experience in Unity and Unreal Engine. Leading The Game Forge towards innovative game development projects and fostering a collaborative learning environment.",
    "skills": ["Unity", "C#", "Project Management", "Game Design", "Leadership", "Agile Development"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/alexchen-gamedev",
      "github": "https://github.com/alexchen-dev",
      "portfolio": "https://alexchen.dev"
    }
  },
  {
    "id": "priya-sharma",
    "name": "Priya Sharma",
    "role": "Lead Developer",
    "department": "Development",
    "image": "/images/team/priya-sharma.jpg",
    "bio": "Full-stack developer specializing in game mechanics and backend systems. Expert in multiple programming languages and game engines with a focus on performance optimization.",
    "skills": ["Unity", "Unreal Engine", "C++", "Python", "JavaScript", "Node.js", "Database Design", "API Development"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/priyasharma-dev",
      "github": "https://github.com/priyasharma-code"
    }
  },
  {
    "id": "rahul-gupta",
    "name": "Rahul Gupta",
    "role": "UI/UX Designer",
    "department": "Design",
    "image": "/images/team/rahul-gupta.jpg",
    "bio": "Creative designer focused on user experience and interface design for games. Passionate about creating intuitive and engaging game interfaces that enhance player experience.",
    "skills": ["Figma", "Adobe Creative Suite", "UI/UX Design", "Prototyping", "User Research", "Wireframing", "Design Systems"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/rahulgupta-design",
      "portfolio": "https://rahulgupta.design"
    }
  },
  {
    "id": "sarah-johnson",
    "name": "Sarah Johnson",
    "role": "3D Artist",
    "department": "Design",
    "image": "/images/team/sarah-johnson.jpg",
    "bio": "3D artist and animator with expertise in character modeling and environment design. Brings game worlds to life with stunning visuals and immersive environments.",
    "skills": ["Blender", "Maya", "3D Modeling", "Animation", "Texturing", "Substance Painter", "ZBrush", "Rigging"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/sarahjohnson-3d",
      "github": "https://github.com/sarahjohnson-art",
      "portfolio": "https://sarahjohnson.art"
    }
  },
  {
    "id": "arjun-patel",
    "name": "Arjun Patel",
    "role": "Game Developer",
    "department": "Development",
    "image": "/images/team/arjun-patel.jpg",
    "bio": "Gameplay programmer with a focus on AI systems and game mechanics. Enjoys creating challenging and engaging gameplay experiences with innovative mechanics.",
    "skills": ["Unity", "C#", "AI Programming", "Game Physics", "Optimization", "Gameplay Programming", "State Machines"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/arjunpatel-gamedev",
      "github": "https://github.com/arjunpatel-dev"
    }
  },
  {
    "id": "maya-singh",
    "name": "Maya Singh",
    "role": "Marketing Lead",
    "department": "Management",
    "image": "/images/team/maya-singh.jpg",
    "bio": "Marketing strategist helping promote The Game Forge and its projects. Expert in social media marketing, community building, and brand development.",
    "skills": ["Digital Marketing", "Social Media", "Content Creation", "Community Management", "Analytics", "Brand Strategy", "Event Planning"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/mayasingh-marketing",
      "portfolio": "https://mayasingh.marketing"
    }
  },
  {
    "id": "dev-kumar",
    "name": "Dev Kumar",
    "role": "Backend Developer",
    "department": "Development",
    "image": "/images/team/dev-kumar.jpg",
    "bio": "Backend specialist focusing on server architecture and multiplayer systems. Passionate about creating scalable solutions for online gaming experiences.",
    "skills": ["Node.js", "Python", "MongoDB", "PostgreSQL", "Docker", "AWS", "Multiplayer Networking", "API Design"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/devkumar-backend",
      "github": "https://github.com/devkumar-server"
    }
  },
  {
    "id": "ananya-reddy",
    "name": "Ananya Reddy",
    "role": "Game Designer",
    "department": "Design",
    "image": "/images/team/ananya-reddy.jpg",
    "bio": "Game designer with expertise in level design and narrative systems. Creates compelling gameplay experiences through thoughtful design and player psychology.",
    "skills": ["Game Design", "Level Design", "Narrative Design", "Balancing", "Player Psychology", "Prototyping", "Documentation"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/ananyareddy-design",
      "portfolio": "https://ananyareddy.games"
    }
  }
];

// Enhanced projects data
const projectsData = [
  {
    "id": "pixel-quest",
    "title": "Pixel Quest",
    "description": "A retro-style 2D platformer with pixel art graphics and challenging gameplay mechanics.",
    "longDescription": "Pixel Quest is an ambitious 2D platformer that combines classic gameplay mechanics with modern design principles. Players navigate through beautifully crafted pixel art environments, solving puzzles and defeating enemies. The game features multiple worlds, each with unique mechanics and visual themes. Built using Unity and C#, the project showcases advanced animation systems, procedural level generation, and a custom physics engine optimized for precise platforming controls. The game includes a compelling storyline, collectible items, and boss battles that test player skills.",
    "images": [
      "/images/projects/pixel-quest-1.jpg",
      "/images/projects/pixel-quest-2.jpg",
      "/images/projects/pixel-quest-3.jpg"
    ],
    "technologies": ["Unity", "C#", "Photoshop", "Aseprite", "FMOD"],
    "teamMembers": ["alex-chen", "priya-sharma", "sarah-johnson"],
    "status": "completed",
    "demoUrl": "https://gameforge.itch.io/pixel-quest",
    "githubUrl": "https://github.com/gameforge/pixel-quest",
    "awards": ["Best Indie Game - SRM Game Jam 2023", "People's Choice Award - Chennai Indie Fest"]
  },
  {
    "id": "cyber-runner",
    "title": "Cyber Runner",
    "description": "A futuristic endless runner with cyberpunk aesthetics and dynamic obstacle generation.",
    "longDescription": "Cyber Runner immerses players in a neon-lit cyberpunk world where they must navigate through an endless cityscape filled with dynamic obstacles. The game features procedurally generated levels, ensuring each run feels unique. With its synthwave soundtrack and stunning visual effects, Cyber Runner has become one of our most popular projects. The game includes power-ups, character customization, global leaderboards for competitive play, and social features for sharing achievements.",
    "images": [
      "/images/projects/cyber-runner-1.jpg",
      "/images/projects/cyber-runner-2.jpg"
    ],
    "technologies": ["Unreal Engine", "Blueprint", "Blender", "Substance Painter", "Wwise"],
    "teamMembers": ["alex-chen", "sarah-johnson", "dev-kumar"],
    "status": "completed",
    "demoUrl": "https://gameforge.itch.io/cyber-runner",
    "githubUrl": "https://github.com/gameforge/cyber-runner",
    "awards": ["People's Choice Award - Chennai Game Dev Meetup 2023"]
  },
  {
    "id": "mystic-realms",
    "title": "Mystic Realms",
    "description": "An immersive RPG with branching storylines and magical combat systems.",
    "longDescription": "Mystic Realms is an ambitious role-playing game that combines traditional RPG elements with innovative storytelling mechanics. Players embark on an epic journey through multiple realms, each with its own unique magic system and inhabitants. The game features a complex dialogue system with meaningful choices that affect the story outcome, turn-based combat with elemental magic, and a crafting system for creating powerful artifacts. With over 40 hours of gameplay, multiple endings, and rich character development, this project represents our most ambitious undertaking.",
    "images": [
      "/images/projects/mystic-realms-1.jpg",
      "/images/projects/mystic-realms-2.jpg",
      "/images/projects/mystic-realms-3.jpg",
      "/images/projects/mystic-realms-4.jpg"
    ],
    "technologies": ["Unity", "C#", "Yarn Spinner", "FMOD", "SQLite"],
    "teamMembers": ["priya-sharma", "rahul-gupta", "arjun-patel", "ananya-reddy"],
    "status": "in-progress",
    "githubUrl": "https://github.com/gameforge/mystic-realms"
  },
  {
    "id": "space-colony",
    "title": "Space Colony Simulator",
    "description": "A strategic simulation game about building and managing colonies on alien planets.",
    "longDescription": "Space Colony Simulator challenges players to establish thriving colonies on distant planets. The game combines resource management, strategic planning, and survival elements as players must balance the needs of their colonists while dealing with alien environments, limited resources, and unexpected challenges. Features include a complex economy system, research trees, dynamic weather patterns that affect colony operations, and multiplayer cooperation modes for building joint colonies.",
    "images": [
      "/images/projects/space-colony-1.jpg",
      "/images/projects/space-colony-2.jpg"
    ],
    "technologies": ["Godot", "GDScript", "Blender", "Krita", "PostgreSQL"],
    "teamMembers": ["sarah-johnson", "arjun-patel", "dev-kumar"],
    "status": "in-progress"
  },
  {
    "id": "puzzle-dimension",
    "title": "Puzzle Dimension",
    "description": "A mind-bending 3D puzzle game that plays with perspective and spatial reasoning.",
    "longDescription": "Puzzle Dimension is an innovative 3D puzzle game that challenges players' spatial reasoning and perspective manipulation skills. Each level presents a unique three-dimensional puzzle that can be rotated, scaled, and viewed from different angles to reveal hidden solutions. The game features minimalist aesthetics, ambient soundscapes, and increasingly complex puzzles that introduce new mechanics and concepts. With over 100 handcrafted levels and a level editor for community content, the game offers endless puzzle-solving possibilities.",
    "images": [
      "/images/projects/puzzle-dimension-1.jpg"
    ],
    "technologies": ["Unity", "C#", "Blender", "Audacity"],
    "teamMembers": ["priya-sharma", "ananya-reddy"],
    "status": "planned"
  },
  {
    "id": "battle-arena-vr",
    "title": "Battle Arena VR",
    "description": "A virtual reality fighting game with immersive combat mechanics.",
    "longDescription": "Battle Arena VR brings fighting games into the virtual reality space with intuitive motion controls and immersive combat mechanics. Players can choose from various fighting styles and weapons, engaging in intense battles in detailed arenas. The game features realistic physics-based combat, multiplayer support for up to 8 players, a training mode with AI opponents of varying difficulty levels, and a tournament system for competitive play. The immersive VR experience makes every punch, block, and dodge feel authentic.",
    "images": [
      "/images/projects/battle-arena-vr-1.jpg",
      "/images/projects/battle-arena-vr-2.jpg",
      "/images/projects/battle-arena-vr-3.jpg"
    ],
    "technologies": ["Unity", "C#", "SteamVR", "Blender", "Photon Networking"],
    "teamMembers": ["alex-chen", "maya-singh", "dev-kumar"],
    "status": "completed",
    "demoUrl": "https://store.steampowered.com/app/battlearenavr",
    "awards": ["Best VR Experience - Tech Fest 2023"]
  }
];

// Enhanced achievements data
const achievementsData = [
  {
    "id": "srm-game-jam-2024-first",
    "title": "First Place - SRM Game Jam 2024",
    "description": "Won first place in the annual SRM Game Jam with our innovative puzzle-platformer game 'Quantum Leap', competing against 50+ teams.",
    "date": "2024-03-15",
    "type": "competition",
    "placement": "1st Place",
    "competition": "SRM Game Jam 2024",
    "image": "/images/achievements/srm-game-jam-2024-first.jpg"
  },
  {
    "id": "chennai-gamedev-innovation",
    "title": "Best Innovation Award - Chennai Game Dev Fest",
    "description": "Recognized for innovative use of AI in game mechanics at Chennai's premier game development festival, showcasing our AI-driven NPC behavior system.",
    "date": "2024-02-20",
    "type": "competition",
    "placement": "Best Innovation",
    "competition": "Chennai Game Dev Fest 2024",
    "image": "/images/achievements/chennai-gamedev-innovation.jpg"
  },
  {
    "id": "club-of-year-2023",
    "title": "Club of the Year - SRM IST KTR",
    "description": "Awarded Club of the Year for outstanding contribution to student development and technical excellence, recognizing our impact on the campus community.",
    "date": "2023-12-10",
    "type": "recognition",
    "placement": "Club of the Year",
    "competition": "SRM IST KTR Annual Awards",
    "image": "/images/achievements/club-of-year-2023.jpg"
  },
  {
    "id": "national-gamedev-third",
    "title": "Third Place - National Game Development Championship",
    "description": "Secured third place in the national championship with our multiplayer strategy game 'Empire Builders', competing against top universities across India.",
    "date": "2023-11-25",
    "type": "competition",
    "placement": "3rd Place",
    "competition": "National Game Development Championship 2023",
    "image": "/images/achievements/national-gamedev-third.jpg"
  },
  {
    "id": "members-milestone-100",
    "title": "100+ Members Milestone",
    "description": "Reached the significant milestone of 100+ active members, making us one of the largest and most active tech clubs at SRM IST KTR.",
    "date": "2023-10-01",
    "type": "milestone",
    "placement": "100+ Members",
    "competition": "Club Growth",
    "image": "/images/achievements/members-milestone-100.jpg"
  },
  {
    "id": "techfest-presentation-2023",
    "title": "Best Technical Presentation - TechFest 2023",
    "description": "Won best technical presentation award for our showcase on 'Future of Game Development with AI', demonstrating cutting-edge AI integration in games.",
    "date": "2023-09-18",
    "type": "competition",
    "placement": "Best Presentation",
    "competition": "SRM TechFest 2023",
    "image": "/images/achievements/techfest-presentation-2023.jpg"
  },
  {
    "id": "community-impact-2023",
    "title": "Community Impact Award",
    "description": "Recognized for organizing free game development workshops for underprivileged students, reaching over 200 students from local schools.",
    "date": "2023-08-05",
    "type": "recognition",
    "placement": "Community Impact",
    "competition": "Social Service Awards",
    "image": "/images/achievements/community-impact-2023.jpg"
  },
  {
    "id": "unity-jam-second-2023",
    "title": "Second Place - Unity Game Jam",
    "description": "Achieved second place in the 48-hour Unity Game Jam with our atmospheric horror game 'Shadows', praised for its innovative use of lighting and sound.",
    "date": "2023-07-12",
    "type": "competition",
    "placement": "2nd Place",
    "competition": "Unity Game Jam 2023",
    "image": "/images/achievements/unity-jam-second-2023.jpg"
  },
  {
    "id": "indie-showcase-winner-2023",
    "title": "Best Indie Game - Chennai Indie Showcase",
    "description": "Our game 'Pixel Quest' won the best indie game award at Chennai's largest independent game showcase, competing against 30+ indie developers.",
    "date": "2023-06-20",
    "type": "competition",
    "placement": "Best Indie Game",
    "competition": "Chennai Indie Showcase 2023",
    "image": "/images/achievements/indie-showcase-winner-2023.jpg"
  },
  {
    "id": "hackathon-winner-2023",
    "title": "First Place - Code for Change Hackathon",
    "description": "Won the Code for Change hackathon with our educational game prototype that teaches programming concepts through interactive gameplay.",
    "date": "2023-05-15",
    "type": "competition",
    "placement": "1st Place",
    "competition": "Code for Change Hackathon 2023",
    "image": "/images/achievements/hackathon-winner-2023.jpg"
  }
];

// Write all data files
function writeDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const content = JSON.stringify(data, null, 2);
  
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully updated ${filename} with ${data.length} items`);
  } catch (error) {
    console.error(`❌ Error writing ${filename}:`, error.message);
  }
}

console.log('🌱 Seeding data files with enhanced content...\n');

// Write enhanced data
writeDataFile('team.json', teamData);
writeDataFile('projects.json', projectsData);
writeDataFile('achievements.json', achievementsData);

console.log('\n🎉 Data seeding completed successfully!');
console.log('\nNext steps:');
console.log('1. Run validation: node scripts/update-content.js validate');
console.log('2. Check stats: node scripts/update-content.js stats');
console.log('3. Add actual images to /public/images/ directories');
console.log('4. Test the website to ensure all data loads correctly');