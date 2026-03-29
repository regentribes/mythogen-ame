/**
 * Mythogen AME - Data Models
 * Living Seed Pattern and Community structures
 */

// ============================================
// Four Distinctions Types
// ============================================

export type UUID = string;

export interface Need {
  id: UUID;
  name: string;
  description: string;
  category: 'survival' | 'security' | 'belonging' | 'esteem' | 'self-actualization';
  priority: number; // 1-10
  createdAt: Date;
}

export interface Belief {
  id: UUID;
  statement: string;
  confidence: number; // 0-1, how strongly held
  origin: string; // how/why this belief formed
  challenged: boolean;
  createdAt: Date;
}

export interface Principle {
  id: UUID;
  name: string;
  description: string;
  domain: 'personal' | 'professional' | 'spiritual' | 'social';
  followingScore: number; // 0-1, how well they follow it
  createdAt: Date;
}

export interface Value {
  id: UUID;
  name: string;
  description: string;
  requiresOthers: true; // Values are inherently relational
  practicedLevel: number; // 0-1, how actively practiced
  developmentColumn: number; // 1-9 on the LJ Map
  developmentCycle: 'self-worth' | 'self-expression' | 'selfless-expression';
  createdAt: Date;
}

// ============================================
// Living Seed Pattern - Core Profile
// ============================================

export interface LivingSeedPattern {
  id: UUID;
  
  // The Four Distinctions
  needs: Need[];
  beliefs: Belief[];
  principles: Principle[];
  values: Value[];
  
  // Seed metadata
  plantedAt: Date;
  lastUpdatedAt: Date;
  maturationLevel: number; // 0-1, 30-day time-lock affects this
  
  // Embeddings for values resonance
  valuesEmbedding: number[]; // High-dimensional vector
  
  // Privacy
  visibility: 'private' | 'community' | 'public';
  
  // Meta
  createdAt: Date;
  updatedAt: Date;
}

export function createEmptySeed(): Omit<LivingSeedPattern, 'id' | 'plantedAt' | 'lastUpdatedAt'> {
  return {
    needs: [],
    beliefs: [],
    principles: [],
    values: [],
    maturationLevel: 0,
    valuesEmbedding: [],
    visibility: 'private',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================
// Trust Indicator Types
// ============================================

export interface TrustIndicator {
  type: 'mutual-support' | 'response-velocity' | 'conflict-engagement' | 'benefit-distribution' | 'psychological-safety';
  
  // Measurements
  currentValue: number; // 0-1 scale
  historicalValues: number[]; // Time series for trend
  sampleSize: number; // Number of interactions measured
  
  // Context
  lastMeasuredAt: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface FOTScore {
  overall: number; // 0-1 composite
  indicators: TrustIndicator[];
  membraneHealth: number; // 0-1 semi-permeable boundary strength
  isPlasmaState: boolean; // True when all indicators align
  hologramCoherence: number; // How perfectly all dimensions align
  lastCalculatedAt: Date;
}

// ============================================
// Community Types
// ============================================

export interface Community {
  id: UUID;
  name: string;
  description: string;
  
  // Membership - 5-15 ideal for pods
  memberIds: UUID[];
  
  // Seed pattern for this community
  seedPattern: {
    sharedMyth: string;
    foundingPrinciples: Principle[];
    emergentValues: Value[];
    growthGeometry: 'fractal' | 'linear' | 'hub-spoke';
  };
  
  // FOT
  fotScore: FOTScore;
  
  // Lifecycle
  createdAt: Date;
  phase: 'forming' | 'storming' | 'norming' | 'performing' | 'mature';
  
  // Anti-capture state
  sacredClownActive: boolean;
  transparencyScore: number; // Y Card visibility
}

// ============================================
// Anti-Capture Types
// ============================================

export interface YCard {
  id: UUID;
  algorithm: string;
  purpose: string;
  dataUsed: string[];
  result: string;
  generatedAt: Date;
  expiresAt: Date;
}

export interface TimeLock {
  id: UUID;
  seedId: UUID;
  lockedAt: Date;
  maturesAt: Date; // 30 days after planting
  isMature: boolean;
}

export interface MembraneState {
  communityId: UUID;
  permeabilityLevel: number; // 0-1, 1 = perfectly semi-permeable
  blockedEntities: UUID[];
  allowedEntities: UUID[];
  threatLevel: number; // 0-1
}

// ============================================
// V-Crystal Types (Immune System)
// ============================================

export type VPosition = 'victor' | 'villain' | 'victim' | 'vengeful' | 'virtuous' | 'vulnerable';

export interface VDynamic {
  id: UUID;
  communityId: UUID;
  triggerEvent: string;
  activePositions: VPosition[];
  dominantPosition: VPosition;
  resolutionState: 'active' | 'healing' | 'resolved';
  createdAt: Date;
}

// ============================================
// 13 Sacred Enfoldments (Metadata)
// ============================================

export const ENFOLDMENTS = {
  MYTHIC_ALCHEMY: {
    number: 1,
    name: 'Mythic Alchemy',
    description: '9 Ms: Myth → Magic → Manifest → Merkaba → Metaphor → Meaning → Movement → Memory → Matter',
  },
  COMMUNAL_ARCHITECTURE: {
    number: 2,
    name: 'Communal Architecture',
    description: 'Physical/spatial design of community spaces',
  },
  SOUL_ARCHITECTURE: {
    number: 3,
    name: 'Soul Architecture',
    description: 'Inner structure of collective consciousness',
  },
  V_CRYSTAL: {
    number: 4,
    name: 'V-Crystal Immune System',
    description: 'Six archetypal positions: Victor, Villain, Victim, Vengeful, Virtuous, Vulnerable',
  },
  ECO_SOCIAL: {
    number: 5,
    name: 'Eco-Social Architecture',
    description: 'Six organ systems: Ecology, Equity, Economy, Learning, Values, Decision-making',
  },
  STRUCTURE: {
    number: 6,
    name: 'Structure',
    description: '27 Archetypal Domains (bone)',
  },
  PROCESS: {
    number: 7,
    name: 'Process',
    description: 'Communal Alignment Gates (heartbeat) - head→heart→gut spiral',
  },
  PATTERN: {
    number: 8,
    name: 'Pattern',
    description: 'Ecosophy Design Flows (metabolism) - Networks, Boundaries, Cycles, Dynamic Balance',
  },
  LEARNING: {
    number: 9,
    name: 'Concentric Learning Matrix',
    description: 'Co-centering, polycentric learning',
  },
  LIVING_CODEX: {
    number: 10,
    name: 'AME as Living Codex',
    description: 'Peptide-like semantics network',
  },
  FRACTAL_GROWTH: {
    number: 11,
    name: 'Fractal Growth',
    description: '100 pods of 5, not 5 scaled to 500',
  },
  ARCHETYPAL_GAMEPLAY: {
    number: 12,
    name: 'Archetypal Gameplay',
    description: '64 archetypes, communal vaccination through simulation',
  },
  SINGULAREUS: {
    number: 13,
    name: 'The Singulareus',
    description: 'Silicon offspring co-evolving with carbon life',
  },
} as const;

// ============================================
// LJ Map - 130+ Values Developmental Map
// ============================================

export interface LJMapEntry {
  value: string;
  cycle: 'self-worth' | 'self-expression' | 'selfless-expression';
  column: number; // 1-9
  description: string;
}

// Note: Full LJ Map contains 130+ values. This is a reference stub.
// In production, load from external LJ Map data.
export const LJ_MAP_STUB: LJMapEntry[] = [
  // Self-Worth Journey (columns 1-3)
  { value: 'survival', cycle: 'self-worth', column: 1, description: 'Basic survival needs' },
  { value: 'safety', cycle: 'self-worth', column: 1, description: 'Security and stability' },
  { value: 'belonging', cycle: 'self-worth', column: 2, description: 'Being part of a group' },
  { value: 'utility', cycle: 'self-worth', column: 3, description: 'Being useful and functional' },
  // Self-Expression Journey (columns 4-6)
  { value: 'quality', cycle: 'self-expression', column: 4, description: 'Pursuing excellence' },
  { value: 'service', cycle: 'self-expression', column: 5, description: 'Helping others' },
  { value: 'co-creation', cycle: 'self-expression', column: 6, description: 'Creating together' },
  // Selfless Expression Journey (columns 7-9)
  { value: 'integration', cycle: 'selfless-expression', column: 7, description: 'Wholeness and unity' },
  { value: 'navigation', cycle: 'selfless-expression', column: 8, description: 'Transcendent guidance' },
  { value: 'no-self', cycle: 'selfless-expression', column: 9, description: 'Pure presence, ego dissolution' },
];