/**
 * Service exports
 * Main entry point for all backend services
 */

export * from './cliftonStrengthsPDFParser';
export * from './claudeCoachingService';
export * from '../types/clifton-strengths';
export * from '../types/coaching';

// Convenience functions to create service instances
import { CliftonStrengthsPDFParser } from './cliftonStrengthsPDFParser';
import { createClaudeCoachingService } from './claudeCoachingService';

export const createCliftonStrengthsParser = () => new CliftonStrengthsPDFParser();
export { createClaudeCoachingService };