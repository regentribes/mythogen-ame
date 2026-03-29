/**
 * Affinity Mapper - Maps individuals to the LJ Map values developmental system
 */

import { v4 as uuid } from 'uuid';
import type { 
  LivingSeedPattern, 
  Value, 
  LJMapEntry,
  UUID 
} from '../models/types.js';

// 130+ LJ Map entries (abbreviated - full version would include all values)
const LJ_MAP: LJMapEntry[] = [
  // Journey 1: Self-Worth (Columns 1-3)
  // Column 1: Safety
  { value: 'survival', cycle: 'self-worth', column: 1, description: 'Basic survival needs' },
  { value: 'safety', cycle: 'self-worth', column: 1, description: 'Security and stability' },
  { value: 'protection', cycle: 'self-worth', column: 1, description: 'Being shielded from harm' },
  { value: 'stability', cycle: 'self-worth', column: 1, description: 'Predictable environment' },
  { value: 'shelter', cycle: 'self-worth', column: 1, description: 'Physical and psychological safety' },
  
  // Column 2: Belonging
  { value: 'belonging', cycle: 'self-worth', column: 2, description: 'Being part of a group' },
  { value: 'acceptance', cycle: 'self-worth', column: 2, description: 'Being welcomed as you are' },
  { value: 'connection', cycle: 'self-worth', column: 2, description: 'Meaningful relationships' },
  { value: 'community', cycle: 'self-worth', column: 2, description: 'Part of something larger' },
  { value: 'companionship', cycle: 'self-worth', column: 2, description: 'Having others alongside' },
  
  // Column 3: Utility
  { value: 'utility', cycle: 'self-worth', column: 3, description: 'Being useful and functional' },
  { value: 'contribution', cycle: 'self-worth', column: 3, description: 'Making a difference' },
  { value: 'productivity', cycle: 'self-worth', column: 3, description: 'Getting things done' },
  { value: 'efficiency', cycle: 'self-worth', column: 3, description: 'Optimizing resources' },
  { value: 'competence', cycle: 'self-worth', column: 3, description: 'Skill and capability' },
  
  // Journey 2: Self-Expression (Columns 4-6)
  // Column 4: Quality
  { value: 'quality', cycle: 'self-expression', column: 4, description: 'Pursuing excellence' },
  { value: 'beauty', cycle: 'self-expression', column: 4, description: 'Aesthetic appreciation' },
  { value: 'craftsmanship', cycle: 'self-expression', column: 4, description: 'Mastery of skill' },
  { value: 'elegance', cycle: 'self-expression', column: 4, description: 'Simplicity and grace' },
  { value: 'excellence', cycle: 'self-expression', column: 4, description: 'High standards' },
  
  // Column 5: Service
  { value: 'compassion', cycle: 'self-expression', column: 5, description: 'Deep empathy for others' },
  { value: 'generosity', cycle: 'self-expression', column: 5, description: 'Giving without expectation' },
  { value: 'healing', cycle: 'self-expression', column: 5, description: 'Making others whole' },
  { value: 'nurturing', cycle: 'self-expression', column: 5, description: 'Supporting growth' },
  { value: 'empathy', cycle: 'self-expression', column: 5, description: 'Understanding others deeply' },
  
  // Column 6: Co-Creation
  { value: 'collaboration', cycle: 'self-expression', column: 6, description: 'Creating together' },
  { value: 'creativity', cycle: 'self-expression', column: 6, description: 'Generating new things' },
  { value: 'innovation', cycle: 'self-expression', column: 6, description: 'Novel solutions' },
  { value: 'synergy', cycle: 'self-expression', column: 6, description: 'Whole greater than parts' },
  { value: 'co-creation', cycle: 'self-expression', column: 6, description: 'Joint creation' },
  
  // Journey 3: Selfless Expression (Columns 7-9)
  // Column 7: Integration
  { value: 'integration', cycle: 'selfless-expression', column: 7, description: 'Wholeness and unity' },
  { value: 'harmony', cycle: 'selfless-expression', column: 7, description: 'Balance and peace' },
  { value: 'interdependence', cycle: 'selfless-expression', column: 7, description: 'Mutual reliance' },
  { value: 'systems-thinking', cycle: 'selfless-expression', column: 7, description: 'Seeing the whole' },
  { value: 'wholeness', cycle: 'selfless-expression', column: 7, description: 'Complete picture' },
  
  // Column 8: Navigation
  { value: 'wisdom', cycle: 'selfless-expression', column: 8, description: 'Deep understanding' },
  { value: 'vision', cycle: 'selfless-expression', column: 8, description: 'Seeing possibilities' },
  { value: 'guidance', cycle: 'selfless-expression', column: 8, description: 'Showing the way' },
  { value: 'transcendence', cycle: 'selfless-expression', column: 8, description: 'Beyond the self' },
  { value: 'awakening', cycle: 'selfless-expression', column: 8, description: 'Consciousness expansion' },
  
  // Column 9: No Self
  { value: 'presence', cycle: 'selfless-expression', column: 9, description: 'Pure awareness' },
  { value: 'flow', cycle: 'selfless-expression', column: 9, description: 'Effortless action' },
  { value: 'surrender', cycle: 'selfless-expression', column: 9, description: 'Letting go' },
  { value: 'no-self', cycle: 'selfless-expression', column: 9, description: 'Ego dissolution' },
  { value: 'vitality', cycle: 'selfless-expression', column: 9, description: 'Pure life force' },
];

export class AffinityMapper {
  /**
   * Map a raw text/behavior to LJ Map values
   * This is a simplified embedding-based approach
   */
  async mapToValues(
    seed: LivingSeedPattern,
    observedBehavior?: string
  ): Promise<{
    mappedValues: Value[];
    dominantCycle: string;
    dominantColumn: number;
    developmentalTrajectory: string;
  }> {
    const values = seed.values;
    
    // Find dominant cycle and column (most practiced values)
    const cycleCounts = { 'self-worth': 0, 'self-expression': 0, 'selfless-expression': 0 };
    const columnCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    
    for (const v of values) {
      if (v.practicedLevel > 0.3) {
        cycleCounts[v.developmentCycle]++;
        columnCounts[v.developmentColumn]++;
      }
    }
    
    const dominantCycle = Object.entries(cycleCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'self-worth';
    
    const dominantColumn = Object.entries(columnCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 1;
    
    // Calculate developmental trajectory
    const trajectory = this.calculateTrajectory(values);
    
    return {
      mappedValues: values,
      dominantCycle,
      dominantColumn: parseInt(String(dominantColumn)),
      developmentalTrajectory: trajectory,
    };
  }
  
  /**
   * Calculate where a person is on their developmental journey
   */
  calculateTrajectory(values: Value[]): string {
    const avgPractice = values.reduce((sum, v) => sum + v.practicedLevel, 0) / (values.length || 1);
    const avgColumn = values.reduce((sum, v) => sum + v.developmentColumn, 0) / (values.length || 1);
    
    if (avgPractice < 0.3) return 'exploring';
    if (avgColumn <= 3) return 'establishing';
    if (avgColumn <= 6) return 'expressing';
    if (avgColumn <= 8) return 'integrating';
    return 'transcending';
  }
  
  /**
   * Check value resonance between two seeds (hologram alignment)
   */
  calculateResonance(seedA: LivingSeedPattern, seedB: LivingSeedPattern): number {
    // Only values can resonate (Desert Island Test)
    const aValues = seedA.values.filter(v => v.practicedLevel > 0.5);
    const bValues = seedB.values.filter(v => v.practicedLevel > 0.5);
    
    if (aValues.length === 0 || bValues.length === 0) return 0;
    
    // Find shared values and their column distance
    let resonanceSum = 0;
    let comparisons = 0;
    
    for (const aVal of aValues) {
      for (const bVal of bValues) {
        if (aVal.name === bVal.name) {
          // Exact match = 1.0
          resonanceSum += 1.0;
        } else if (aVal.developmentCycle === bVal.developmentCycle) {
          // Same cycle, different column - proximity matters
          const columnDist = Math.abs(aVal.developmentColumn - bVal.developmentColumn);
          resonanceSum += Math.max(0, 1 - columnDist / 9);
        } else {
          // Different cycles - still possible but lower
          resonanceSum += 0.2;
        }
        comparisons++;
      }
    }
    
    return comparisons > 0 ? resonanceSum / comparisons : 0;
  }
  
  /**
   * The Desert Island Test: Is this a Value or just a Need/Belief/Principle?
   * Values require others to practice - you cannot be generous alone.
   */
  isDesertIslandTestable(entry: { name: string; requiresOthers?: true }): boolean {
    // Values that are inherently relational
    const relationalValues = [
      'generosity', 'justice', 'compassion', 'fairness', 'honesty',
      'loyalty', 'trust', 'reciprocity', 'forgiveness', 'gratitude',
      'courage', 'integrity', 'humility', 'patience', 'wisdom',
    ];
    
    return relationalValues.some(rv => entry.name.toLowerCase().includes(rv));
  }
  
  /**
   * Get the full LJ Map
   */
  getLJMap(): LJMapEntry[] {
    return LJ_MAP;
  }
  
  /**
   * Find values by cycle or column
   */
  findValues(cycle?: string, column?: number): LJMapEntry[] {
    return LJ_MAP.filter(entry => {
      if (cycle && entry.cycle !== cycle) return false;
      if (column && entry.column !== column) return false;
      return true;
    });
  }
}