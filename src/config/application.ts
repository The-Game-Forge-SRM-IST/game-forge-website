/**
 * Application Form Configuration
 * 
 * Change APPLICATION_OPEN to control whether the application form is available:
 * - true: Application form is open and accepting submissions
 * - false: Application form is closed with a message to users
 */

export const APPLICATION_CONFIG = {
  // 🎯 CHANGE THIS VALUE TO OPEN/CLOSE APPLICATIONS
  APPLICATION_OPEN: false,
  
  // Message shown when applications are closed
  CLOSED_MESSAGE: {
    title: "Applications Currently Closed",
    description: "Thank you for your interest in joining The Game Forge! Applications are currently closed, but we'll be opening them again soon. Follow our social media or check back later for updates.",
    reopenMessage: "Applications will reopen soon. Stay tuned!"
  },
  
  // Message shown when applications are open
  OPEN_MESSAGE: {
    title: "Join The Game Forge",
    description: "Ready to level up your game development skills? Apply to become part of our creative community."
  }
} as const;