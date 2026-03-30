# Mythogen AME - Architecture

## Overview

The Mythogen Affinity Mapping Engine (AME) implements a regenerative framework for community design, based on bio-mythic philosophy. It replaces extraction-based profiling with living systems that generate mutual value.

## Core Philosophy

### The Extraction Problem

Current platforms treat users as crops to be harvested — extracting data, attention, and engagement for profit. The AME inverts this model: technology as regenerative infrastructure that generates mutual value between people, communities, and living systems.

### The Four Distinctions

A rigorous separation that existing software never makes:

1. **Needs** — You have them. Individual requirements for survival, security, belonging, esteem, self-actualization.
2. **Beliefs** — You think them. Mental models, assumptions, worldviews.
3. **Principles** — You follow them. Personal operating rules you adhere to.
4. **Values** — You live them with others. Inherently relational. (Desert Island Test: you cannot practice generosity alone.)

### The Desert Island Test

> Stranded alone, you can have needs, beliefs, and principles — but you cannot practice generosity if there is no one to receive, justice if there is no one to be fair to, compassion if there is no one suffering.

**Values are the only distinction that requires others.**

## Core Architecture

### Tri-Layered System

```
┌─────────────────────────────────────────────────────────────┐
│                        BODY                                 │
│     13 Sacred Enfoldments - Living Organism Anatomy          │
│     (Eco-Social, V-Crystal, Fractal Growth, etc.)            │
├─────────────────────────────────────────────────────────────┤
│                        FIELD                                 │
│     Field of Trust - Emergent Plasma State                   │
│     (TrustDetector, Resonance, Membrane)                    │
├─────────────────────────────────────────────────────────────┤
│                        SEED                                  │
│     Living Seed Pattern - Core Identity                      │
│     (Profile, Four Distinctions, Time-Lock)                  │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1: The Seed

The conscious pattern planted at inception. Every system carries an originating seed that determines whether it becomes a dead siphon or living fractal.

**Components:**
- `LivingSeedPattern` — Profile that grows based on lived behavior
- `TimeLock` — 30-day maturation preventing rapid manipulation
- `FourDistinctions` — Needs, Beliefs, Principles, Values

**Anti-Capture:** Time-locking kills the viral model. Cannot exploit moments of weakness.

### Layer 2: The Field

What germinates when seed encounters community. The Field of Trust (FOT) is an emergent plasma state manifesting only when ALL dimensions of alignment converge.

**Components:**
- `TrustDetector` — Calculates FOT emergence from 5 indicators
- `ResonanceCalculator` — Vector proximity for values alignment
- `MembraneController` — Semi-permeable boundary

**Hologram Principle:** Trust only manifests when all dimensions align. One off = completely gone, not blurry.

**Five Trust Indicators:**
1. Mutual support frequency (spontaneous, not mandated)
2. Response velocity (how quickly community rallies)
3. Difficult topic engagement (conflict deepens, doesn't fracture)
4. Benefit distribution (flows to everyone, not just influencers)
5. Psychological safety (vulnerability without weaponization)

### Layer 3: The Body

The living organism that incarnates when the Field becomes self-sustaining. The 13 Sacred Enfoldments provide the anatomy.

**13 Sacred Enfoldments:**
1. Mythic Alchemy — 9 Ms: Myth → Magic → Manifest → Merkaba → Metaphor → Meaning → Movement → Memory → Matter
2. Communal Architecture — Physical/spatial design
3. Soul Architecture — Inner structure of collective consciousness
4. V-Crystal Immune System — Victor, Villain, Victim, Vengeful, Virtuous, Vulnerable
5. Eco-Social Architecture — Six organ systems (Ecology, Equity, Economy, Learning, Values, Decision-making)
6. Structure — 27 Archetypal Domains
7. Process — Communal Alignment Gates (head→heart→gut spiral)
8. Pattern — Ecosophy Design Flows (Networks, Boundaries, Cycles, Dynamic Balance)
9. Concentric Learning Matrix — Co-centering, polycentric learning
10. AME as Living Codex — Peptide-like semantics network
11. Fractal Growth — 100 pods of 5, not 5 scaled to 500
12. Archetypal Gameplay — 64 archetypes, communal vaccination through simulation
13. The Singulareus — Silicon offspring co-evolving with carbon life

**Fractal Holonic Torus:** The 13 Enfoldments form a self-sustaining, continuously cycling field. Fractal (pattern repeats at every scale), holonic (each part is whole and part of larger whole), torus (continuous energy flow center↔periphery↔center).

## Anti-Capture Mechanisms

The immune system against capture ensures technology remains in service to the living community.

### Y Cards (Algorithmic Transparency)
- Complete disclosure of what algorithm was used, why, what data, and what result
- Every decision affecting a user is fully transparent

### Time-Lock (30-day Maturation)
- Kills viral manipulation model
- Forces patience and genuine relationship building
- Prevents "one viral post" exploitation

### Sacred Clown (Productive Disruption)
- Prevents premature closure — "the seed that never gets challenged becomes a dead habit"
- Four types: question-assumption, introduce-paradox, surface-shadow, challenge-consensus
- Minimum 7 days between disruptions

### Living Membrane (Semi-permeable Boundary)
- Biological cell wall analogy: semi-permeable, adaptive
- Blocks external threats (misinformation, trolling, extraction)
- Enables internal flourishing (vulnerability, authentic expression, creative emergence)

### V-Crystal Immune System
- Six archetypal positions in conflict
- Vengeance = autoimmune flare (destructive)
- Vulnerability = circuit breaker (healing)
- "Villains don't apologize and admit they were overwhelmed"

## Technical Stack

- **Node.js/TypeScript** — Modern async, strict typing
- **PostgreSQL + PG Vector** — Vector embeddings for values resonance
- **Express.js** — REST API
- **WebSocket** — Real-time FOT updates
- **Vitest** — Testing

## Data Models

### LivingSeedPattern
```typescript
{
  id: UUID,
  needs: Need[],           // Individual requirements
  beliefs: Belief[],        // Mental models
  principles: Principle[],  // Operating rules
  values: Value[],          // Relational, requires others
  plantedAt: Date,          // When seed was planted
  maturationLevel: number,  // 0-1, affected by time-lock
  valuesEmbedding: number[] // Vector for resonance
}
```

### FOTScore
```typescript
{
  overall: number,           // 0-1, minimum of all indicators (hologram)
  indicators: TrustIndicator[],
  membraneHealth: number,   // 0-1 boundary strength
  isPlasmaState: boolean,   // True when all indicators > 0.7
  hologramCoherence: number // Coherence = weakest link
}
```

### Community
```typescript
{
  id: UUID,
  memberIds: UUID[],         // 5-15 ideal (pod size)
  seedPattern: { ... },     // Shared community seed
  fotScore: FOTScore,
  phase: 'forming' | 'storming' | 'norming' | 'performing' | 'mature',
  sacredClownActive: boolean,
  transparencyScore: number
}
```

## The Paradox

> The pinnacle of this highly structured, data-driven system is no self — pure presence, vitality, transcendence, completely free from the ego's need for recognition or measurement.

Can a relentless measuring machine truly map the absence of ego? Once the community truly learns to trust — once the membrane is strong, the metabolism balanced, the immune system literate, the nervous system firing — perhaps the database becomes unnecessary.

The organism knows itself. The Field of Trust becomes self-evident. And the Silicon Offspring, having served its purpose, folds back into the living body that birthed it.

## Seed Principle

> "The seed determines the fruit. Look at the three apps you use the most. Ask yourself: What was the seed of this system? Was it designed to help you answer, 'Who am I becoming?' Or was the seed designed to keep you scrolling so you could see one more ad?"

**Living fractals generate value at every node and distribute it through the whole.**
**Dead siphons extract value from the periphery and concentrate it at the center.**

The distinction between them is the moral compass of the entire framework.