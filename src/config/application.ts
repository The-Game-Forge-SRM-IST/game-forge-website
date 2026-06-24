/**
 * Application Form Configuration
 * 
 * Configuration is loaded from application.json.
 * Change APPLICATION_OPEN in application.json to control whether the application form is available:
 * - true: Application form is open and accepting submissions
 * - false: Application form is closed with a message to users
 */

import config from './application.json';

export const APPLICATION_CONFIG = config as {
  readonly APPLICATION_OPEN: boolean;
  readonly CLOSED_MESSAGE: {
    readonly title: string;
    readonly description: string;
    readonly reopenMessage: string;
  };
  readonly OPEN_MESSAGE: {
    readonly title: string;
    readonly description: string;
  };
};