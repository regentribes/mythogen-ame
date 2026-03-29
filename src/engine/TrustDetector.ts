/**
 * Trust Detector - Calculates Field of Trust emergence
 * Based on 5 concrete indicators and the hologram principle
 */

import type { 
  Community, 
  TrustIndicator, 
  FOTScore,
  UUID 
} from '../models/types.js';

// The Five Trust Indicators
export const TRUST_INDICATOR_TYPES = {
  MUTUAL_SUPPORT: 'mutual-support',
  RESPONSE_VELOCITY: 'response-velocity',
  CONFLICT_ENGAGEMENT: 'conflict-engagement',
  BENEFIT_DISTRIBUTION: 'benefit-distribution',
  PSYCHOLOGICAL_SAFETY: 'psychological-safety',
} as const;

/**
 * Trust Detector calculates FOT emergence based on the hologram principle:
 * Trust manifests only when ALL dimensions align.
 * If one dimension is off, the 3D image doesn't blur — it COMPLETELY FAILS.
 */
export class TrustDetector {
  /**
   * Calculate FOT Score for a community
   * Uses the hologram principle: composite = minimum of all indicators, not average
   */
  calculateFOT(community: Community): FOTScore {
    const { fotScore } = community;
    
    // If no indicators yet, no FOT
    if (!fotScore.indicators || fotScore.indicators.length === 0) {
      return {
        overall: 0,
        indicators: [],
        membraneHealth: 0,
        isPlasmaState: false,
        hologramCoherence: 0,
        lastCalculatedAt: new Date(),
      };
    }
    
    // Calculate composite using hologram principle (minimum, not average)
    const values = fotScore.indicators.map(i => i.currentValue);
    const composite = Math.min(...values);
    
    // Check if all 5 indicators present (full coherence)
    const allPresent = fotScore.indicators.length >= 5;
    
    // Plasma state: all indicators present AND all above threshold (0.7)
    const isPlasmaState = allPresent && composite >= 0.7;
    
    return {
      overall: composite,
      indicators: fotScore.indicators,
      membraneHealth: fotScore.membraneHealth,
      isPlasmaState,
      hologramCoherence: isPlasmaState ? composite : 0, // Only high when plasma
      lastCalculatedAt: new Date(),
    };
  }
  
  /**
   * Analyze a community event and update relevant indicators
   */
  analyzeEvent(event: {
    type: 'support' | 'response' | 'conflict' | 'sharing' | 'vulnerability';
    data: Record<string, unknown>;
  }): Partial<TrustIndicator> {
    switch (event.type) {
      case 'support':
        return this.analyzeMutualSupport(event.data);
      case 'response':
        return this.analyzeResponseVelocity(event.data);
      case 'conflict':
        return this.analyzeConflictEngagement(event.data);
      case 'sharing':
        return this.analyzeBenefitDistribution(event.data);
      case 'vulnerability':
        return this.analyzePsychologicalSafety(event.data);
      default:
        return {};
    }
  }
  
  private analyzeMutualSupport(data: Record<string, unknown>): Partial<TrustIndicator> {
    const spontaneous = data.spontaneous as boolean;
    const frequency = data.frequency as number || 0;
    
    return {
      type: 'mutual-support',
      currentValue: spontaneous 
        ? Math.min(1, frequency / 10) // 10 supports per period = 1.0
        : Math.min(0.5, frequency / 20),
      trend: 'stable',
    };
  }
  
  private analyzeResponseVelocity(data: Record<string, unknown>): Partial<TrustIndicator> {
    const avgResponseTimeMs = data.avgResponseTimeMs as number;
    
    // 0-60 minutes = 1.0, 1-24 hours = 0.7, 1-7 days = 0.4, 7+ days = 0.1
    let value = 0;
    if (avgResponseTimeMs <= 3600000) value = 1.0;
    else if (avgResponseTimeMs <= 86400000) value = 0.7;
    else if (avgResponseTimeMs <= 604800000) value = 0.4;
    else value = 0.1;
    
    return { type: 'response-velocity', currentValue: value, trend: 'stable' };
  }
  
  private analyzeConflictEngagement(data: Record<string, unknown>): Partial<TrustIndicator> {
    const deepenedRelationship = data.deepenedRelationship as boolean;
    const resolutionQuality = data.resolutionQuality as number || 0;
    
    return {
      type: 'conflict-engagement',
      currentValue: deepenedRelationship 
        ? Math.min(1, resolutionQuality)
        : Math.max(0, resolutionQuality - 0.5),
      trend: 'stable',
    };
  }
  
  private analyzeBenefitDistribution(data: Record<string, unknown>): Partial<TrustIndicator> {
    const benefitingMembers = data.benefitingMembers as number;
    const totalMembers = data.totalMembers as number;
    
    // Check if value flows to everyone, not just influencers
    const distribution = benefitingMembers / totalMembers;
    
    return {
      type: 'benefit-distribution',
      currentValue: distribution,
      trend: 'stable',
    };
  }
  
  private analyzePsychologicalSafety(data: Record<string, unknown>): Partial<TrustIndicator> {
    const vulnerableStatements = data.vulnerableStatements as number;
    const weaponizationCount = data.weaponizationCount as number;
    
    // High vulnerability + low weaponization = high safety
    const safetyScore = Math.max(0, (vulnerableStatements - weaponizationCount * 2) / 10);
    
    return {
      type: 'psychological-safety',
      currentValue: Math.min(1, safetyScore),
      trend: 'stable',
    };
  }
  
  /**
   * Determine community phase based on FOT development
   */
  determinePhase(fotScore: FOTScore, communityAge: number): Community['phase'] {
    const daysSinceCreation = (Date.now() - communityAge) / (1000 * 60 * 60 * 24);
    
    if (fotScore.overall < 0.2) return 'forming';
    if (fotScore.overall < 0.4) return 'storming';
    if (fotScore.overall < 0.6) return 'norming';
    if (fotScore.overall < 0.8) return 'performing';
    return 'mature';
  }
  
  /**
   * Calculate membrane health (semi-permeable boundary strength)
   */
  calculateMembraneHealth(community: Community): number {
    // Healthy membrane = high permeability + low threat + strong internal cohesion
    const internalCohesion = community.fotScore.overall;
    const sacredClownBonus = community.sacredClownActive ? 0.1 : 0;
    const transparencyBonus = community.transparencyScore * 0.2;
    
    return Math.min(1, internalCohesion * 0.7 + sacredClownBonus + transparencyBonus);
  }
}

/**
 * Event types for FOT tracking
 */
export interface CommunityEvent {
  communityId: UUID;
  actorId: UUID;
  type: 'support' | 'response' | 'conflict' | 'sharing' | 'vulnerability' | 'boundary';
  data: Record<string, unknown>;
  timestamp: Date;
}

/**
 * FOT History entry for trend analysis
 */
export interface FOTHistory {
  communityId: UUID;
  score: FOTScore;
  events: CommunityEvent[];
  recordedAt: Date;
}