/**
 * Mythogen AME - Test Suite
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AffinityMapper } from '../src/engine/AffinityMapper.js';
import { TrustDetector, TRUST_INDICATOR_TYPES } from '../src/engine/TrustDetector.js';
import { 
  TransparencyEngine, 
  TimeLockManager, 
  SacredClown, 
  MembraneController,
  VCrystalSystem 
} from '../src/anticapture/index.js';
import type { LivingSeedPattern, Community, TrustIndicator } from '../src/models/types.js';

// ============================================
// AffinityMapper Tests
// ============================================

describe('AffinityMapper', () => {
  const mapper = new AffinityMapper();
  
  it('should get LJ Map with values', () => {
    const ljMap = mapper.getLJMap();
    expect(ljMap.length).toBeGreaterThan(0);
  });
  
  it('should filter values by cycle', () => {
    const selfWorthValues = mapper.findValues('self-worth');
    expect(selfWorthValues.length).toBeGreaterThan(0);
    selfWorthValues.forEach(v => {
      expect(v.cycle).toBe('self-worth');
    });
  });
  
  it('should filter values by column', () => {
    const column3Values = mapper.findValues(undefined, 3);
    expect(column3Values.length).toBeGreaterThan(0);
    column3Values.forEach(v => {
      expect(v.column).toBe(3);
    });
  });
  
  it('should calculate resonance between two seeds', () => {
    const seedA: LivingSeedPattern = {
      id: 'seed-a',
      needs: [],
      beliefs: [],
      principles: [],
      values: [{
        id: 'v1',
        name: 'generosity',
        description: 'Giving without expectation',
        requiresOthers: true,
        practicedLevel: 0.8,
        developmentColumn: 5,
        developmentCycle: 'self-expression',
        createdAt: new Date(),
      }],
      plantedAt: new Date(),
      lastUpdatedAt: new Date(),
      maturationLevel: 1,
      valuesEmbedding: [],
      visibility: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const seedB: LivingSeedPattern = {
      ...seedA,
      id: 'seed-b',
      values: [{
        ...seedA.values[0],
        id: 'v2',
      }],
    };
    
    const resonance = mapper.calculateResonance(seedA, seedB);
    expect(resonance).toBe(1.0); // Exact match
  });
  
  it('should return low resonance for different values', () => {
    const seedA: LivingSeedPattern = {
      id: 'seed-a',
      needs: [],
      beliefs: [],
      principles: [],
      values: [{
        id: 'v1',
        name: 'survival',
        description: 'Basic needs',
        requiresOthers: true,
        practicedLevel: 0.8,
        developmentColumn: 1,
        developmentCycle: 'self-worth',
        createdAt: new Date(),
      }],
      plantedAt: new Date(),
      lastUpdatedAt: new Date(),
      maturationLevel: 1,
      valuesEmbedding: [],
      visibility: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const seedB: LivingSeedPattern = {
      ...seedA,
      id: 'seed-b',
      values: [{
        id: 'v2',
        name: 'presence',
        description: 'Pure awareness',
        requiresOthers: true,
        practicedLevel: 0.8,
        developmentColumn: 9,
        developmentCycle: 'selfless-expression',
        createdAt: new Date(),
      }],
    };
    
    const resonance = mapper.calculateResonance(seedA, seedB);
    expect(resonance).toBeLessThan(1.0);
  });
  
  it('should identify desert island testable values', () => {
    expect(mapper.isDesertIslandTestable({ name: 'generosity' })).toBe(true);
    expect(mapper.isDesertIslandTestable({ name: 'justice' })).toBe(true);
    expect(mapper.isDesertIslandTestable({ name: 'something-else' })).toBe(false);
  });
});

// ============================================
// TrustDetector Tests
// ============================================

describe('TrustDetector', () => {
  const detector = new TrustDetector();
  
  const createMockCommunity = (indicators: Partial<TrustIndicator>[]): Community => ({
    id: 'community-1',
    name: 'Test Community',
    description: 'A test community',
    memberIds: ['member-1', 'member-2', 'member-3'],
    seedPattern: {
      sharedMyth: 'Test myth',
      foundingPrinciples: [],
      emergentValues: [],
      growthGeometry: 'fractal',
    },
    fotScore: {
      overall: 0,
      indicators: indicators.map((i, idx) => ({
        type: TRUST_INDICATOR_TYPES.MUTUAL_SUPPORT,
        currentValue: 0.5,
        historicalValues: [0.5],
        sampleSize: 1,
        lastMeasuredAt: new Date(),
        trend: 'stable',
        ...i,
      })),
      membraneHealth: 0.5,
      isPlasmaState: false,
      hologramCoherence: 0,
      lastCalculatedAt: new Date(),
    },
    createdAt: new Date(),
    phase: 'forming',
    sacredClownActive: false,
    transparencyScore: 1,
  });
  
  it('should return zero FOT for empty community', () => {
    const community = createMockCommunity([]);
    const fot = detector.calculateFOT(community);
    expect(fot.overall).toBe(0);
    expect(fot.isPlasmaState).toBe(false);
  });
  
  it('should apply hologram principle (minimum, not average)', () => {
    const community = createMockCommunity([
      { type: 'mutual-support', currentValue: 0.9 },
      { type: 'response-velocity', currentValue: 0.5 }, // Lowest
      { type: 'conflict-engagement', currentValue: 0.8 },
      { type: 'benefit-distribution', currentValue: 0.7 },
      { type: 'psychological-safety', currentValue: 0.9 },
    ]);
    
    const fot = detector.calculateFOT(community);
    expect(fot.overall).toBe(0.5); // Minimum, not average
    expect(fot.hologramCoherence).toBe(0);
    expect(fot.isPlasmaState).toBe(false); // Below 0.7
  });
  
  it('should detect plasma state when all indicators above 0.7', () => {
    const community = createMockCommunity([
      { type: 'mutual-support', currentValue: 0.8 },
      { type: 'response-velocity', currentValue: 0.9 },
      { type: 'conflict-engagement', currentValue: 0.85 },
      { type: 'benefit-distribution', currentValue: 0.75 },
      { type: 'psychological-safety', currentValue: 0.9 },
    ]);
    
    const fot = detector.calculateFOT(community);
    expect(fot.overall).toBe(0.75);
    expect(fot.isPlasmaState).toBe(true);
    expect(fot.hologramCoherence).toBe(0.75);
  });
  
  it('should analyze mutual support events', () => {
    const result = detector.analyzeEvent({
      type: 'support',
      data: { spontaneous: true, frequency: 8 },
    });
    
    expect(result.type).toBe('mutual-support');
    expect(result.currentValue).toBeGreaterThan(0.5);
  });
  
  it('should analyze response velocity events', () => {
    const result = detector.analyzeEvent({
      type: 'response',
      data: { avgResponseTimeMs: 1800000 }, // 30 minutes
    });
    
    expect(result.type).toBe('response-velocity');
    expect(result.currentValue).toBe(1.0); // Within 60 minutes = 1.0
  });
  
  it('should analyze conflict engagement events', () => {
    const result = detector.analyzeEvent({
      type: 'conflict',
      data: { deepenedRelationship: true, resolutionQuality: 0.8 },
    });
    
    expect(result.type).toBe('conflict-engagement');
    expect(result.currentValue).toBeGreaterThan(0.5);
  });
  
  it('should determine community phase based on FOT', () => {
    const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
    
    expect(detector.determinePhase({ overall: 0.1 } as any, oldDate.getTime())).toBe('forming');
    expect(detector.determinePhase({ overall: 0.3 } as any, oldDate.getTime())).toBe('storming');
    expect(detector.determinePhase({ overall: 0.5 } as any, oldDate.getTime())).toBe('norming');
    expect(detector.determinePhase({ overall: 0.7 } as any, oldDate.getTime())).toBe('performing');
    expect(detector.determinePhase({ overall: 0.9 } as any, oldDate.getTime())).toBe('mature');
  });
});

// ============================================
// Anti-Capture Tests
// ============================================

describe('TransparencyEngine', () => {
  const engine = new TransparencyEngine();
  
  it('should generate Y Cards', () => {
    const card = engine.generateYCard({
      algorithm: 'test-algo',
      purpose: 'Testing transparency',
      dataUsed: ['name', 'email'],
      result: 'Profile created',
      recipientId: 'user-123',
    });
    
    expect(card.id).toBeDefined();
    expect(card.algorithm).toBe('test-algo');
    expect(card.dataUsed).toEqual(['name', 'email']);
    expect(card.generatedAt).toBeDefined();
  });
  
  it('should format Y Cards for display', () => {
    const card = {
      id: 'card-1',
      algorithm: 'test-algo',
      purpose: 'Testing',
      dataUsed: ['field-1'],
      result: 'Done',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    
    const formatted = engine.formatYCard(card);
    expect(formatted).toContain('Y CARD');
    expect(formatted).toContain('test-algo');
    expect(formatted).toContain('Testing');
  });
});

describe('TimeLockManager', () => {
  const manager = new TimeLockManager();
  
  it('should create time locks', () => {
    const lock = manager.createTimeLock('seed-123');
    
    expect(lock.seedId).toBe('seed-123');
    expect(lock.isMature).toBe(false);
    expect(lock.maturesAt.getTime()).toBeGreaterThan(Date.now());
  });
  
  it('should report immature status correctly', () => {
    const lock = manager.createTimeLock('seed-123');
    
    expect(manager.isMature(lock)).toBe(false);
    expect(manager.getMaturationProgress(lock)).toBeLessThan(1);
  });
  
  it('should not allow manipulation before maturation', () => {
    const lock = manager.createTimeLock('seed-123');
    
    expect(manager.canManipulate(lock)).toBe(false); // Returns false if NOT mature
  });
});

describe('SacredClown', () => {
  const clown = new SacredClown();
  
  it('should trigger disruptions', () => {
    const disruption = clown.triggerDisruption('community-1');
    
    expect(disruption.type).toBeDefined();
    expect(disruption.message).toBeDefined();
    expect(disruption.purpose).toBeDefined();
  });
  
  it('should track disruption history', () => {
    clown.triggerDisruption('community-2');
    const history = clown.getDisruptions('community-2');
    
    expect(history.length).toBe(1);
  });
});

describe('MembraneController', () => {
  const controller = new MembraneController();
  
  it('should create membrane state', () => {
    const membrane = controller.createMembrane('community-1');
    
    expect(membrane.communityId).toBe('community-1');
    expect(membrane.permeabilityLevel).toBe(0.5);
    expect(membrane.blockedEntities).toEqual([]);
  });
  
  it('should update membrane based on health', () => {
    const membrane = controller.createMembrane('community-1');
    const updated = controller.updateMembrane(membrane, 0.9, []);
    
    expect(updated.permeabilityLevel).toBeGreaterThan(0.5);
  });
  
  it('should block entities', () => {
    const membrane = controller.createMembrane('community-1');
    const blocked = controller.blockEntity(membrane, 'bad-actor');
    
    expect(blocked.blockedEntities).toContain('bad-actor');
    expect(controller.canPass(blocked, 'bad-actor')).toBe(false);
  });
  
  it('should allow trusted entities', () => {
    const membrane = controller.createMembrane('community-1');
    const allowed = controller.allowEntity(membrane, 'trusted-member');
    
    expect(allowed.allowedEntities).toContain('trusted-member');
    expect(controller.canPass(allowed, 'trusted-member')).toBe(true);
  });
});

describe('VCrystalSystem', () => {
  const system = new VCrystalSystem();
  
  it('should detect V-Dynamics from trigger words', () => {
    const dynamic = system.detectVDynamic('community-1', 'This is their fault!');
    
    expect(dynamic).not.toBeNull();
    expect(dynamic?.dominantPosition).toBe('victor');
  });
  
  it('should detect vengeance patterns', () => {
    const dynamic = system.detectVDynamic('community-1', 'They deserve payback!');
    
    expect(dynamic?.dominantPosition).toBe('vengeful');
    expect(system.isAutoimmuneFlare(dynamic!)).toBe(true);
  });
  
  it('should resolve V-Dynamics through states', () => {
    const dynamic = system.detectVDynamic('community-1', 'I feel hurt');
    
    if (dynamic) {
      const healing = system.resolveVDynamic(dynamic);
      expect(healing.resolutionState).toBe('healing');
      
      const resolved = system.resolveVDynamic(healing);
      expect(resolved.resolutionState).toBe('resolved');
    }
  });
  
  it('should identify vulnerability as circuit breaker', () => {
    const dynamic = system.detectVDynamic('community-1', 'I feel vulnerable and exposed');
    
    expect(dynamic?.dominantPosition).toBe('vulnerable');
    expect(system.canBreakCycle(dynamic!)).toBe(true);
  });
  
  it('should return null for non-triggering events', () => {
    const dynamic = system.detectVDynamic('community-1', 'Hello everyone!');
    
    expect(dynamic).toBeNull();
  });
});