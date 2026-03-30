# Mythogen AME - Usage Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run the server
npm run dev

# Run tests
npm test
```

## API Reference

### Seeds (Profiles)

#### Create a Seed
```bash
curl -X POST http://localhost:3000/api/seeds \
  -H "Content-Type: application/json" \
  -d '{
    "needs": [
      {"name": "community", "description": "Connection with others", "category": "belonging", "priority": 8}
    ],
    "beliefs": [
      {"statement": "Regenerative systems can replace extractive ones", "confidence": 0.9, "origin": "Personal experience"}
    ],
    "values": [
      {"name": "generosity", "description": "Giving without expectation", "practicedLevel": 0.7, "developmentColumn": 5, "developmentCycle": "self-expression"},
      {"name": "integrity", "description": "Being honest even when hard", "practicedLevel": 0.8, "developmentColumn": 7, "developmentCycle": "selfless-expression"}
    ],
    "visibility": "community"
  }'
```

Response:
```json
{
  "seed": { "id": "...", "needs": [...], "values": [...] },
  "timeLock": { "id": "...", "seedId": "...", "maturesAt": "..." }
}
```

#### Get a Seed
```bash
curl http://localhost:3000/api/seeds/:id
```

#### Get Y Card (Transparency)
```bash
curl http://localhost:3000/api/seeds/:id/y-cards
```

Returns full algorithmic transparency: why the algorithm was used, how it works, what data was used, and what the result was.

### Communities

#### Create a Community
```bash
curl -X POST http://localhost:3000/api/communities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RegenTribe Core",
    "description": "A regenerative neighborhood collective",
    "memberIds": ["seed-1", "seed-2", "seed-3"],
    "sharedMyth": "We grow together like mycelium, connecting and nourishing"
  }'
```

#### Get FOT Score
```bash
curl http://localhost:3000/api/communities/:id/fot
```

Response:
```json
{
  "overall": 0.75,
  "indicators": [
    {"type": "mutual-support", "currentValue": 0.8, ...},
    {"type": "response-velocity", "currentValue": 0.9, ...},
    {"type": "conflict-engagement", "currentValue": 0.7, ...},
    {"type": "benefit-distribution", "currentValue": 0.75, ...},
    {"type": "psychological-safety", "currentValue": 0.85, ...}
  ],
  "isPlasmaState": true,
  "hologramCoherence": 0.7,
  "membraneHealth": 0.82,
  "phase": "performing"
}
```

### Trust Events

Record events to build FOT indicators:

#### Record Mutual Support
```bash
curl -X POST http://localhost:3000/api/communities/:id/trust-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "support",
    "data": {
      "spontaneous": true,
      "frequency": 5,
      "from": "member-2",
      "to": "member-1"
    }
  }'
```

#### Record Response Velocity
```bash
curl -X POST http://localhost:3000/api/communities/:id/trust-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "response",
    "data": {
      "avgResponseTimeMs": 1800000,
      "situation": "member needed help with project"
    }
  }'
```

#### Record Conflict Engagement
```bash
curl -X POST http://localhost:3000/api/communities/:id/trust-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "conflict",
    "data": {
      "deepenedRelationship": true,
      "resolutionQuality": 0.85,
      "topic": "resource allocation"
    }
  }'
```

#### Record Vulnerability
```bash
curl -X POST http://localhost:3000/api/communities/:id/trust-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "vulnerability",
    "data": {
      "vulnerableStatements": 3,
      "weaponizationCount": 0,
      "topic": "personal struggle"
    }
  }'
```

### Anti-Capture

#### Trigger Sacred Clown
```bash
curl -X POST http://localhost:3000/api/communities/:id/sacred-clown
```

Response:
```json
{
  "disruption": {
    "type": "question-assumption",
    "message": "What if the assumption we're most certain about is actually what's limiting us?",
    "purpose": "Prevent premature closure of understanding"
  },
  "sacredClownActive": true
}
```

#### Get Membrane State
```bash
curl http://localhost:3000/api/communities/:id/membrane
```

### LJ Map (Values Developmental Map)

#### Get All Values
```bash
curl http://localhost:3000/api/lj-map
```

Returns 50+ values across three cycles:
- **Self-Worth** (Columns 1-3): Safety → Belonging → Utility
- **Self-Expression** (Columns 4-6): Quality → Service → Co-Creation
- **Selfless Expression** (Columns 7-9): Integration → Navigation → No Self

### WebSocket (Real-time FOT)

Connect to `ws://localhost:8080` and send:

```json
{
  "type": "subscribe",
  "communityId": "community-123"
}
```

Receive real-time FOT updates:

```json
{
  "type": "fot-update",
  "communityId": "community-123",
  "fot": {
    "overall": 0.75,
    "isPlasmaState": true,
    ...
  }
}
```

## Key Concepts

### Hologram Principle

FOT only manifests when ALL five indicators align. The composite is the **minimum** of all indicators, not the average. If one dimension is off, trust completely fails — not blurry, completely gone.

**Example:**
- Mutual support: 0.9 ✓
- Response velocity: 0.5 ✗
- Conflict engagement: 0.8 ✓
- Benefit distribution: 0.7 ✓
- Psychological safety: 0.9 ✓

→ FOT = 0.5 (lowest wins)

### Desert Island Test

Values require others to practice. Ask for any claimed value: "Can you practice this alone on a desert island?"

- **Need:** "I need food" → YES, you can have this alone
- **Belief:** "I believe in karma" → YES, you can hold this alone
- **Principle:** "I follow non-violence" → YES, you can follow this alone
- **Value:** "I value generosity" → NO, you need someone to receive

This separates the Four Distinctions rigorously.

### Fractal Growth

Communities grow by **multiplying**, not scaling. A pod of 5 → 100 pods of 5. Each pod retains the relational depth of the original.

Scaling a pod of 5 into 500 = dilution.
Multiplying to 100 pods of 5 = growth.

## Health Check

```bash
curl http://localhost:3000/health
```

Returns:
```json
{
  "status": "healthy",
  "seeds": 3,
  "communities": 1,
  "uptime": 3600
}
```