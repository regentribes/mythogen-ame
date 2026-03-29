/**
 * Anti-Capture Mechanisms
 * Protecting the system from becoming a dead siphon
 * The immune system against capture
 */

import { v4 as uuid } from 'uuid';
import type { YCard, TimeLock, MembraneState, Community, VDynamic, VPosition } from '../models/types.js';

// ============================================
// Y Cards - Algorithmic Transparency Engine
// ============================================

export class TransparencyEngine {
  /**
   * Generate a Y Card - complete transparency about algorithm decisions
   * "Y" = Why, How, What
   */
  generateYCard(params: {
    algorithm: string;
    purpose: string;
    dataUsed: string[];
    result: string;
    recipientId: string;
  }): YCard {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    return {
      id: uuid(),
      algorithm: params.algorithm,
      purpose: params.purpose,
      dataUsed: params.dataUsed,
      result: params.result,
      generatedAt: now,
      expiresAt,
    };
  }
  
  /**
   * Format Y Card for human-readable display
   */
  formatYCard(card: YCard): string {
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Y CARD - Algorithmic Transparency
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHY was this algorithm used?
${card.purpose}

HOW does it work?
Algorithm: ${card.algorithm}
Data used: ${card.dataUsed.join(', ')}

WHAT was the result?
${card.result}

Generated: ${card.generatedAt.toISOString()}
Expires: ${card.expiresAt.toISOString()}
ID: ${card.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This card exists so you can question and understand every decision that affects you.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }
  
  /**
   * Calculate community transparency score
   */
  calculateTransparencyScore(cards: YCard[]): number {
    if (cards.length === 0) return 0;
    
    const now = new Date();
    const viewed = cards.filter(c => 
      c.viewedAt && c.expiresAt > now
    ).length;
    
    return viewed / cards.length;
  }
}

// ============================================
// Time Lock - 30-day Maturation
// ============================================

export class TimeLockManager {
  private readonly MATURATION_DAYS = 30;
  private readonly LOCK_DURATION_MS = this.MATURATION_DAYS * 24 * 60 * 60 * 1000;
  
  /**
   * Create a new time lock for a seed
   */
  createTimeLock(seedId: string): TimeLock {
    const now = new Date();
    
    return {
      id: uuid(),
      seedId,
      lockedAt: now,
      maturesAt: new Date(now.getTime() + this.LOCK_DURATION_MS),
      isMature: false,
    };
  }
  
  /**
   * Check if a time lock has matured
   */
  isMature(lock: TimeLock): boolean {
    if (lock.isMature) return true;
    return new Date() >= lock.maturesAt;
  }
  
  /**
   * Get maturation progress (0-1)
   */
  getMaturationProgress(lock: TimeLock): number {
    if (lock.isMature) return 1;
    
    const now = Date.now();
    const start = lock.lockedAt.getTime();
    const end = lock.maturesAt.getTime();
    
    return Math.min(1, (now - start) / (end - start));
  }
  
  /**
   * Mark lock as matured (called externally after verification)
   */
  markMature(lock: TimeLock): TimeLock {
    return { ...lock, isMature: true };
  }
  
  /**
   * Time-lock kills the viral model:
   * - No rapid emotional manipulation (can't exploit moments of weakness)
   * - Forces patience and genuine relationship building
   * - Prevents the "one viral post" manipulation pattern
   */
  canManipulate(lock: TimeLock): boolean {
    return this.isMature(lock);
  }
}

// ============================================
// Sacred Clown - Productive Disruption
// ============================================

export class SacredClown {
  private disruptionHistory: Map<string, Date[]> = new Map();
  
  /**
   * Trigger productive disruption to prevent premature closure
   * "The seed that never gets challenged becomes a dead habit"
   */
  triggerDisruption(communityId: string): {
    type: 'question-assumption' | 'introduce-paradox' | 'surface-shadow' | 'challenge-consensus';
    message: string;
    purpose: string;
  } {
    const disruptions = this.getDisruptions(communityId);
    
    // Don't disrupt too frequently (min 7 days between)
    const lastDisruption = disruptions[disruptions.length - 1];
    if (lastDisruption && 
        Date.now() - lastDisruption.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return {
        type: 'question-assumption',
        message: 'Still processing previous disruption...',
        purpose: 'waiting period',
      };
    }
    
    // Record this disruption
    disruptions.push(new Date());
    this.disruptionHistory.set(communityId, disruptions);
    
    // Return a random disruption type
    const types = [
      {
        type: 'question-assumption' as const,
        message: 'What if the assumption we\'re most certain about is actually what\'s limiting us?',
        purpose: 'Prevent premature closure of understanding',
      },
      {
        type: 'introduce-paradox' as const,
        message: 'Both/and: We can be deeply committed AND open to being wrong. These aren\'t opposites.',
        purpose: 'Hold tension instead of resolving it prematurely',
      },
      {
        type: 'surface-shadow' as const,
        message: 'What pattern are we avoiding looking at because it feels too uncomfortable?',
        purpose: 'Surface what\'s in the shadow',
      },
      {
        type: 'challenge-consensus' as const,
        message: 'The consensus we\'ve built... what would it look like if we\'re actually all slightly wrong?',
        purpose: 'Prevent groupthink and false certainty',
      },
    ];
    
    return types[Math.floor(Math.random() * types.length)];
  }
  
  /**
   * Get disruption history for a community
   */
  getDisruptions(communityId: string): Date[] {
    return this.disruptionHistory.get(communityId) || [];
  }
  
  /**
   * Sacred Clown Principle:
   * "The jester sees what the king refuses to see"
   * Disruption is not destruction - it's a healthy immune response
   */
}

// ============================================
// Living Membrane - Semi-permeable Boundary
// ============================================

export class MembraneController {
  /**
   * Create initial membrane state for a community
   */
  createMembrane(communityId: string): MembraneState {
    return {
      communityId,
      permeabilityLevel: 0.5, // Balanced by default
      blockedEntities: [],
      allowedEntities: [],
      threatLevel: 0,
    };
  }
  
  /**
   * Update membrane based on community health
   */
  updateMembrane(
    membrane: MembraneState,
    communityHealth: number,
    externalThreats: string[]
  ): MembraneState {
    // Healthy community = more permeable (open to growth)
    // Stressed community = less permeable (protective)
    const targetPermeability = 0.3 + communityHealth * 0.7;
    
    // Block known threats
    const blocked = [...new Set([...membrane.blockedEntities, ...externalThreats])];
    
    return {
      ...membrane,
      permeabilityLevel: targetPermeability,
      blockedEntities: blocked,
      threatLevel: externalThreats.length > 0 ? Math.min(1, externalThreats.length * 0.2) : 0,
    };
  }
  
  /**
   * Check if an entity can pass through the membrane
   * Semi-permeable = filters, doesn't block completely
   */
  canPass(membrane: MembraneState, entityId: string): boolean {
    // Explicitly blocked = no
    if (membrane.blockedEntities.includes(entityId)) return false;
    
    // Explicitly allowed = yes
    if (membrane.allowedEntities.includes(entityId)) return true;
    
    // Otherwise, depends on permeability and threat level
    // High permeability + low threat = allow
    // Low permeability OR high threat = block
    return membrane.permeabilityLevel > 0.5 && membrane.threatLevel < 0.3;
  }
  
  /**
   * Block an entity (toxic, extractive, etc.)
   */
  blockEntity(membrane: MembraneState, entityId: string): MembraneState {
    return {
      ...membrane,
      blockedEntities: [...membrane.blockedEntities, entityId],
      allowedEntities: membrane.allowedEntities.filter(id => id !== entityId),
    };
  }
  
  /**
   * Allow an entity (trusted, beneficial)
   */
  allowEntity(membrane: MembraneState, entityId: string): MembraneState {
    return {
      ...membrane,
      allowedEntities: [...membrane.allowedEntities, entityId],
      blockedEntities: membrane.blockedEntities.filter(id => id !== entityId),
    };
  }
}

// ============================================
// V-Crystal Immune System
// ============================================

export class VCrystalSystem {
  /**
   * Detect when V-Dynamics are active (conflict pattern emerging)
   */
  detectVDynamic(communityId: string, event: string): VDynamic | null {
    // Trigger words that indicate V-Dynamic activation
    const triggerPatterns = [
      { pattern: /blame|fault|responsible/i, position: 'victor' },
      { pattern: /wrong|bad|evil|i'm right/i, position: 'villain' },
      { pattern: /hurt|wounded|suffering|poor me/i, position: 'victim' },
      { pattern: /payback|revenge|deserve|eye for eye/i, position: 'vengeful' },
      { pattern: /should|must|always|never|right/i, position: 'virtuous' },
      { pattern: /fear|afraid|vulnerable|exposed/i, position: 'vulnerable' },
    ];
    
    const activePositions: VPosition[] = [];
    let dominantPosition: VPosition = 'vulnerable';
    let maxMatches = 0;
    
    for (const { pattern, position } of triggerPatterns) {
      if (pattern.test(event)) {
        activePositions.push(position);
        maxMatches++;
        dominantPosition = position; // Last match wins
      }
    }
    
    if (activePositions.length === 0) return null;
    
    return {
      id: uuid(),
      communityId,
      triggerEvent: event,
      activePositions,
      dominantPosition,
      resolutionState: 'active',
      createdAt: new Date(),
    };
  }
  
  /**
   * Vengeance is the autoimmune flare
   * Vulnerability is the circuit breaker
   * "Villains don't apologize and admit they were overwhelmed"
   */
  resolveVDynamic(dynamic: VDynamic): VDynamic {
    // Resolution path: active → healing → resolved
    if (dynamic.resolutionState === 'resolved') {
      return dynamic;
    }
    
    const nextState = dynamic.resolutionState === 'active' ? 'healing' : 'resolved';
    
    return {
      ...dynamic,
      resolutionState: nextState,
    };
  }
  
  /**
   * Check if vengeance (autoimmune) is dominant
   */
  isAutoimmuneFlare(dynamic: VDynamic): boolean {
    return dynamic.dominantPosition === 'vengeful' ||
           dynamic.dominantPosition === 'villain';
  }
  
  /**
   * Circuit breaker for V-Dynamics
   * "Vulnerability breaks the cycle"
   */
  canBreakCycle(dynamic: VDynamic): boolean {
    // Only vulnerable position can break the cycle
    return dynamic.dominantPosition === 'vulnerable';
  }
}