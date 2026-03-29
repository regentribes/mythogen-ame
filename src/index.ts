/**
 * Mythogen AME - Entry Point
 * Affinity Mapping Engine & Field of Trust System
 */

import app from './api/index.js';

// Entry point is the Express server (started in api/index.ts)
console.log('Mythogen AME - Starting...');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  process.exit(0);
});