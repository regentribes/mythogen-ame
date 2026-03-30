/**
 * Mythogen AME - REST API Server
 * Express-based API for profile CRUD, community management, trust queries
 */

import express, { Request, Response, NextFunction } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

// Import engines
import { AffinityMapper } from '../engine/AffinityMapper.js';
import { TrustDetector, TRUST_INDICATOR_TYPES } from '../engine/TrustDetector.js';
import { 
  TransparencyEngine, 
  TimeLockManager, 
  SacredClown, 
  MembraneController,
  VCrystalSystem 
} from '../anticapture/index.js';

// Import types
import type { 
  LivingSeedPattern, 
  Community, 
  TrustIndicator, 
  FOTScore,
  Need,
  Belief,
  Principle,
  Value,
} from '../models/types.js';
import { createEmptySeed } from '../models/types.js';

// ============================================
// Validation Schemas
// ============================================

const NeedSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.enum(['survival', 'security', 'belonging', 'esteem', 'self-actualization']),
  priority: z.number().min(1).max(10),
});

const BeliefSchema = z.object({
  statement: z.string().min(1),
  confidence: z.number().min(0).max(1),
  origin: z.string(),
});

const PrincipleSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  domain: z.enum(['personal', 'professional', 'spiritual', 'social']),
});

const ValueSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  practicedLevel: z.number().min(0).max(1),
  developmentColumn: z.number().min(1).max(9),
  developmentCycle: z.enum(['self-worth', 'self-expression', 'selfless-expression']),
});

const CreateSeedSchema = z.object({
  needs: z.array(NeedSchema).optional(),
  beliefs: z.array(BeliefSchema).optional(),
  principles: z.array(PrincipleSchema).optional(),
  values: z.array(ValueSchema).optional(),
  visibility: z.enum(['private', 'community', 'public']).optional(),
});

const CreateCommunitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  memberIds: z.array(z.string()).min(1).max(15),
  sharedMyth: z.string().optional(),
});

const TrustEventSchema = z.object({
  type: z.enum(['support', 'response', 'conflict', 'sharing', 'vulnerability']),
  data: z.record(z.any()),
});

// ============================================
// In-Memory Store (production would use PostgreSQL)
// ============================================

const seeds = new Map<string, LivingSeedPattern>();
const communities = new Map<string, Community>();
const trustMeasurements = new Map<string, TrustIndicator[]>();

// ============================================
// Initialize Engines
// ============================================

const affinityMapper = new AffinityMapper();
const trustDetector = new TrustDetector();
const transparencyEngine = new TransparencyEngine();
const timeLockManager = new TimeLockManager();
const sacredClown = new SacredClown();
const membraneController = new MembraneController();
const vCrystalSystem = new VCrystalSystem();

// ============================================
// Express App
// ============================================

const app = express();
app.use(express.json());

// Error handler
const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
};

// ============================================
// Seed Pattern Routes
// ============================================

// Create a new seed
app.post('/api/seeds', async (req, res, next) => {
  try {
    const body = CreateSeedSchema.parse(req.body);
    
    const now = new Date();
    const id = uuid();
    
    // Create needs with IDs
    const needs: Need[] = (body.needs || []).map(n => ({
      id: uuid(),
      ...n,
      createdAt: now,
    }));
    
    // Create beliefs with IDs
    const beliefs: Belief[] = (body.beliefs || []).map(b => ({
      id: uuid(),
      ...b,
      challenged: false,
      createdAt: now,
    }));
    
    // Create principles with IDs
    const principles: Principle[] = (body.principles || []).map(p => ({
      id: uuid(),
      ...p,
      followingScore: 0.5, // Start neutral
      createdAt: now,
    }));
    
    // Create values with IDs
    const values: Value[] = (body.values || []).map(v => ({
      id: uuid(),
      ...v,
      requiresOthers: true as const, // Values require others
      createdAt: now,
    }));
    
    const seed: LivingSeedPattern = {
      id,
      needs,
      beliefs,
      principles,
      values,
      plantedAt: now,
      lastUpdatedAt: now,
      maturationLevel: 0,
      valuesEmbedding: [],
      visibility: body.visibility || 'private',
      createdAt: now,
      updatedAt: now,
    };
    
    seeds.set(id, seed);
    
    res.status(201).json({ 
      seed,
      timeLock: timeLockManager.createTimeLock(id),
    });
  } catch (err) {
    next(err);
  }
});

// Get a seed
app.get('/api/seeds/:id', (req, res) => {
  const seed = seeds.get(req.params.id);
  if (!seed) {
    return res.status(404).json({ error: 'Seed not found' });
  }
  res.json(seed);
});

// Update a seed (time-locked)
app.patch('/api/seeds/:id', (req, res) => {
  const seed = seeds.get(req.params.id);
  if (!seed) {
    return res.status(404).json({ error: 'Seed not found' });
  }
  
  const updates = req.body;
  const updatedSeed: LivingSeedPattern = {
    ...seed,
    ...updates,
    id: seed.id, // Prevent ID change
    plantedAt: seed.plantedAt, // Prevent planted date change
    updatedAt: new Date(),
  };
  
  seeds.set(seed.id, updatedSeed);
  res.json(updatedSeed);
});

// Get LJ Map values
app.get('/api/lj-map', (_req, res) => {
  res.json(affinityMapper.getLJMap());
});

// ============================================
// Community Routes
// ============================================

// Create a community
app.post('/api/communities', (req, res) => {
  const body = CreateCommunitySchema.parse(req.body);
  
  const now = new Date();
  const id = uuid();
  
  const community: Community = {
    id,
    name: body.name,
    description: body.description || '',
    memberIds: body.memberIds,
    seedPattern: {
      sharedMyth: body.sharedMyth || '',
      foundingPrinciples: [],
      emergentValues: [],
      growthGeometry: 'fractal',
    },
    fotScore: {
      overall: 0,
      indicators: [],
      membraneHealth: 0,
      isPlasmaState: false,
      hologramCoherence: 0,
      lastCalculatedAt: now,
    },
    createdAt: now,
    phase: 'forming',
    sacredClownActive: false,
    transparencyScore: 1, // Start fully transparent
  };
  
  communities.set(id, community);
  trustMeasurements.set(id, []);
  
  res.status(201).json({ 
    community,
    membrane: membraneController.createMembrane(id),
  });
});

// Get a community
app.get('/api/communities/:id', (req, res) => {
  const community = communities.get(req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  
  // Calculate current FOT
  const fotScore = trustDetector.calculateFOT(community);
  community.fotScore = fotScore;
  
  res.json(community);
});

// Get FOT score for a community
app.get('/api/communities/:id/fot', (req, res) => {
  const community = communities.get(req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  
  const fotScore = trustDetector.calculateFOT(community);
  const membraneHealth = trustDetector.calculateMembraneHealth(community);
  
  res.json({
    ...fotScore,
    membraneHealth,
    phase: trustDetector.determinePhase(fotScore, community.createdAt.getTime()),
  });
});

// ============================================
// Trust Event Routes
// ============================================

// Record a trust event
app.post('/api/communities/:id/trust-events', (req, res) => {
  const community = communities.get(req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  
  const body = TrustEventSchema.parse(req.body);
  
  // Analyze the event
  const analysis = trustDetector.analyzeEvent({
    type: body.type,
    data: body.data,
  });
  
  // Update trust measurements
  const measurements = trustMeasurements.get(community.id) || [];
  
  if (analysis.type && analysis.currentValue !== undefined) {
    const indicator: TrustIndicator = {
      type: analysis.type,
      currentValue: analysis.currentValue,
      historicalValues: [analysis.currentValue],
      sampleSize: 1,
      lastMeasuredAt: new Date(),
      trend: 'stable',
    };
    
    // Update or add
    const existingIndex = measurements.findIndex(m => m.type === analysis.type);
    if (existingIndex >= 0) {
      const existing = measurements[existingIndex];
      measurements[existingIndex] = {
        ...existing,
        currentValue: (existing.currentValue + indicator.currentValue) / 2,
        historicalValues: [...existing.historicalValues, indicator.currentValue],
        sampleSize: existing.sampleSize + 1,
        lastMeasuredAt: new Date(),
      };
    } else {
      measurements.push(indicator);
    }
    
    trustMeasurements.set(community.id, measurements);
    
    // Update community FOT
    community.fotScore.indicators = measurements;
    community.fotScore = trustDetector.calculateFOT(community);
    community.fotScore.membraneHealth = trustDetector.calculateMembraneHealth(community);
    
    // Check for V-Dynamics
    const vDynamic = vCrystalSystem.detectVDynamic(community.id, body.data.event as string || '');
    if (vDynamic) {
      res.json({ 
        indicator, 
        vDynamic,
        fotScore: community.fotScore,
      });
      return;
    }
  }
  
  res.json({ indicator: analysis, fotScore: community.fotScore });
});

// ============================================
// Anti-Capture Routes
// ============================================

// Get Y Card for a seed
app.get('/api/seeds/:id/y-cards', (req, res) => {
  const seed = seeds.get(req.params.id);
  if (!seed) {
    return res.status(404).json({ error: 'Seed not found' });
  }
  
  // Generate a Y Card for current state
  const ljMap = affinityMapper.getLJMap();
  const dominantValues = seed.values
    .filter(v => v.practicedLevel > 0.5)
    .map(v => v.name);
  
  const yCard = transparencyEngine.generateYCard({
    algorithm: 'AffinityMapper.mapToValues + TrustDetector.calculateFOT',
    purpose: 'Mapping your values to the LJ Map developmental model and calculating community Field of Trust',
    dataUsed: [
      'Your values (needs, beliefs, principles, values)',
      'Community interaction patterns',
      'Trust indicator measurements',
      `Your dominant values: ${dominantValues.join(', ') || 'not yet mapped'}`,
    ],
    result: seed.values.length > 0 
      ? `Your seed has ${seed.values.length} values mapped to the LJ Map across cycles: self-worth, self-expression, selfless-expression`
      : 'Your seed has no values mapped yet. Add values to see your developmental map.',
    recipientId: seed.id,
  });
  
  res.json({
    yCard,
    formatted: transparencyEngine.formatYCard(yCard),
  });
});

// Trigger Sacred Clown (for testing)
app.post('/api/communities/:id/sacred-clown', (req, res) => {
  const community = communities.get(req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  
  community.sacredClownActive = true;
  
  const disruption = sacredClown.triggerDisruption(community.id);
  
  res.json({
    disruption,
    sacredClownActive: true,
  });
});

// Get membrane state
app.get('/api/communities/:id/membrane', (req, res) => {
  const community = communities.get(req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  
  const membrane = membraneController.createMembrane(community.id);
  const updatedMembrane = membraneController.updateMembrane(
    membrane,
    community.fotScore.overall,
    []
  );
  
  res.json(updatedMembrane);
});

// ============================================
// WebSocket for real-time FOT
// ============================================

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'subscribe' && data.communityId) {
        // Subscribe to FOT updates for a community
        const community = communities.get(data.communityId);
        if (community) {
          const fot = trustDetector.calculateFOT(community);
          ws.send(JSON.stringify({
            type: 'fot-update',
            communityId: data.communityId,
            fot,
          }));
        }
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// ============================================
// Health Check
// ============================================

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy',
    seeds: seeds.size,
    communities: communities.size,
    uptime: process.uptime(),
  });
});

// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 3000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mythogen AME Server running on port ${PORT}

API Endpoints:
  Seeds:
    POST   /api/seeds          - Create seed
    GET    /api/seeds/:id      - Get seed
    PATCH  /api/seeds/:id      - Update seed
    GET    /api/seeds/:id/y-cards - Get transparency card
    GET    /api/lj-map         - Get LJ Map values
    
  Communities:
    POST   /api/communities    - Create community
    GET    /api/communities/:id - Get community
    GET    /api/communities/:id/fot - Get FOT score
    POST   /api/communities/:id/trust-events - Record trust event
    POST   /api/communities/:id/sacred-clown - Trigger disruption
    GET    /api/communities/:id/membrane - Get membrane state
    
  WebSocket:
    ws://localhost:8080 - Real-time FOT updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;