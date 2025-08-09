/**
 * CliftonStrengths Types
 * Defines the structure for CliftonStrengths assessment data
 */

export enum StrengthDomain {
  EXECUTING = 'Executing',
  INFLUENCING = 'Influencing',
  RELATIONSHIP_BUILDING = 'Relationship Building',
  STRATEGIC_THINKING = 'Strategic Thinking'
}

export enum StrengthFormat {
  TOP_5 = 'top5',
  TOP_10 = 'top10',
  FULL_34 = 'full34'
}

export interface Strength {
  /** Strength name (e.g., "Restorative", "Connectedness") */
  name: string;
  
  /** Ranking from 1-34 (1 being strongest) */
  rank: number;
  
  /** The domain this strength belongs to */
  domain: StrengthDomain;
  
  /** Short description of what this strength means */
  description?: string;
  
  /** Whether this strength includes trademark symbol */
  hasTrademarkSymbol?: boolean;
}

export interface DomainSummary {
  domain: StrengthDomain;
  count: number;
  strengths: Strength[];
}

export interface UserProfile {
  /** User's full name as extracted from PDF */
  name: string;
  
  /** Date the assessment was taken */
  assessmentDate: Date;
  
  /** Format of the assessment (Top 5, Top 10, or Full 34) */
  format: StrengthFormat;
  
  /** All strengths in order of ranking */
  strengths: Strength[];
  
  /** Top 5 strengths (always present) */
  topFive: Strength[];
  
  /** Top 10 strengths (present for top10 and full34 formats) */
  topTen?: Strength[];
  
  /** Summary by domain */
  domainSummary: DomainSummary[];
  
  /** Leading domain based on top strengths */
  leadingDomain: StrengthDomain;
}

export interface ParsedPDFResult {
  success: boolean;
  data?: UserProfile;
  error?: string;
  warnings?: string[];
}

export interface PDFProcessingError extends Error {
  code: 'INVALID_PDF' | 'PARSE_ERROR' | 'UNSUPPORTED_FORMAT' | 'EXTRACTION_FAILED';
  details?: any;
}

/**
 * Mapping of strength names to their domains
 * Based on the CliftonStrengths framework
 */
export const STRENGTH_DOMAIN_MAP: Record<string, StrengthDomain> = {
  // EXECUTING
  'Achiever': StrengthDomain.EXECUTING,
  'Arranger': StrengthDomain.EXECUTING,
  'Belief': StrengthDomain.EXECUTING,
  'Consistency': StrengthDomain.EXECUTING,
  'Deliberative': StrengthDomain.EXECUTING,
  'Discipline': StrengthDomain.EXECUTING,
  'Focus': StrengthDomain.EXECUTING,
  'Responsibility': StrengthDomain.EXECUTING,
  'Restorative': StrengthDomain.EXECUTING,

  // INFLUENCING
  'Activator': StrengthDomain.INFLUENCING,
  'Command': StrengthDomain.INFLUENCING,
  'Communication': StrengthDomain.INFLUENCING,
  'Competition': StrengthDomain.INFLUENCING,
  'Maximizer': StrengthDomain.INFLUENCING,
  'Self-Assurance': StrengthDomain.INFLUENCING,
  'Significance': StrengthDomain.INFLUENCING,
  'Woo': StrengthDomain.INFLUENCING,

  // RELATIONSHIP BUILDING
  'Adaptability': StrengthDomain.RELATIONSHIP_BUILDING,
  'Connectedness': StrengthDomain.RELATIONSHIP_BUILDING,
  'Developer': StrengthDomain.RELATIONSHIP_BUILDING,
  'Empathy': StrengthDomain.RELATIONSHIP_BUILDING,
  'Harmony': StrengthDomain.RELATIONSHIP_BUILDING,
  'Includer': StrengthDomain.RELATIONSHIP_BUILDING,
  'Individualization': StrengthDomain.RELATIONSHIP_BUILDING,
  'Positivity': StrengthDomain.RELATIONSHIP_BUILDING,
  'Relator': StrengthDomain.RELATIONSHIP_BUILDING,

  // STRATEGIC THINKING
  'Analytical': StrengthDomain.STRATEGIC_THINKING,
  'Context': StrengthDomain.STRATEGIC_THINKING,
  'Futuristic': StrengthDomain.STRATEGIC_THINKING,
  'Ideation': StrengthDomain.STRATEGIC_THINKING,
  'Input': StrengthDomain.STRATEGIC_THINKING,
  'Intellection': StrengthDomain.STRATEGIC_THINKING,
  'Learner': StrengthDomain.STRATEGIC_THINKING,
  'Strategic': StrengthDomain.STRATEGIC_THINKING,
};

/**
 * All 34 CliftonStrengths with their descriptions
 */
export const ALL_STRENGTHS_INFO: Record<string, string> = {
  'Achiever': 'You work hard and possess a great deal of stamina. You take immense satisfaction in being busy and productive.',
  'Activator': 'You can make things happen by turning thoughts into action. You want to do things now, rather than simply talk about them.',
  'Adaptability': 'You prefer to go with the flow. You tend to be "now" people who take things as they come and discover the future one day at a time.',
  'Analytical': 'You search for reasons and causes. You have the ability to think about all of the factors that might affect a situation.',
  'Arranger': 'You can organize, but you also have a flexibility that complements this ability. You like to determine how all of the pieces and resources can be arranged for maximum productivity.',
  'Belief': 'You have certain core values that are unchanging. Out of these values emerges a defined purpose for your life.',
  'Command': 'You have presence. You can take control of a situation and make decisions.',
  'Communication': 'You generally find it easy to put your thoughts into words. You are good conversationalists and presenters.',
  'Competition': 'You measure your progress against the performance of others. You strive to win first place and revel in contests.',
  'Connectedness': 'You have faith in the links among all things. You believe there are few coincidences and that almost every event has meaning.',
  'Consistency': 'You are keenly aware of the need to treat people the same. You crave stable routines and clear rules and procedures that everyone can follow.',
  'Context': 'You enjoy thinking about the past. You understand the present by researching its history.',
  'Deliberative': 'You are best described by the serious care you take in making decisions or choices. You anticipate obstacles.',
  'Developer': 'You recognize and cultivate the potential in others. You spot the signs of each small improvement and derive satisfaction from evidence of progress.',
  'Discipline': 'You enjoy routine and structure. Your world is best described by the order you create.',
  'Empathy': 'You can sense other people\'s feelings by imagining themselves in others\' lives or situations.',
  'Focus': 'You can take a direction, follow through and make the corrections necessary to stay on track. You prioritize, then act.',
  'Futuristic': 'You are inspired by the future and what could be. You energize others with your visions of the future.',
  'Harmony': 'You look for consensus. You don\'t enjoy conflict; rather, you seek areas of agreement.',
  'Ideation': 'You are fascinated by ideas. You are able to find connections between seemingly disparate phenomena.',
  'Includer': 'You accept others. You show awareness of those who feel left out and make an effort to include them.',
  'Individualization': 'You are intrigued with the unique qualities of each person. You have a gift for figuring out how different people can work together productively.',
  'Input': 'You have a need to collect and archive. You may accumulate information, ideas, artifacts or even relationships.',
  'Intellection': 'You are characterized by your intellectual activity. You are introspective and appreciate intellectual discussions.',
  'Learner': 'You have a great desire to learn and want to continuously improve. The process of learning, rather than the outcome, excites you.',
  'Maximizer': 'You focus on strengths as a way to stimulate personal and group excellence. You seek to transform something strong into something superb.',
  'Positivity': 'You have contagious enthusiasm. You are upbeat and can get others excited about what they are going to do.',
  'Relator': 'You enjoy close relationships with others. You find deep satisfaction in working hard with friends to achieve a goal.',
  'Responsibility': 'You take psychological ownership of what you say they will do. You are committed to stable values such as honesty and loyalty.',
  'Restorative': 'You are adept at dealing with problems. You are good at figuring out what is wrong and resolving it.',
  'Self-Assurance': 'You feel confident in your ability to take risks and manage your own lives. You have an inner compass that gives them certainty in their decisions.',
  'Significance': 'You want to make a big impact. You are independent and prioritize projects based on how much influence they will have on their organization or people around them.',
  'Strategic': 'You create alternative ways to proceed. Faced with any given scenario, you can quickly spot the relevant patterns and issues.',
  'Woo': 'You love the challenge of meeting new people and winning them over. You derive satisfaction from breaking the ice and making a connection with someone.'
};