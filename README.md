# Mythogen AME - Affinity Mapping Engine & Field of Trust

A regenerative framework for community design built on bio-mythic philosophy. Where mainstream technology mediates human connection through extraction, the Mythogen framework proposes technology as regenerative infrastructure that generates mutual value between people, communities, and living systems.

## Core Architecture

### The Four Distinctions
A rigorous separation that existing software never makes:
- **Needs** — You have them (individual requirements)
- **Beliefs** — You think them (mental models)
- **Principles** — You follow them (operating rules)
- **Values** — You live them with others (inherently relational)

The Desert Island Test: Stranded alone, you cannot practice generosity if there is no one to receive. Values require others.

### Tri-Layered System
```
┌─────────────────────────────────────────────────────────────┐
│                        BODY                                 │
│     13 Sacred Enfoldments - Living Organism Anatomy        │
├─────────────────────────────────────────────────────────────┤
│                        FIELD                                 │
│     Field of Trust - Emergent Plasma State                  │
│     (TrustDetector, Resonance, Membrane)                    │
├─────────────────────────────────────────────────────────────┤
│                        SEED                                  │
│     Living Seed Pattern - Core Identity                      │
│     (Profile, Four Distinctions, Time-Lock)                │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **Living Seed Patterns** - Profiles that grow based on lived behavior, not static self-declaration
- **Field of Trust Detection** - 5 concrete indicators with hologram principle
- **Anti-Capture Mechanisms** - Y Cards, Time-Lock, Sacred Clown, Living Membrane, V-Crystal
- **LJ Map Integration** - 130+ values mapped to 3 cycles (Self-Worth → Self-Expression → Selfless Expression)
- **REST API + WebSocket** - Real-time FOT monitoring

## Quick Start

```bash
npm install
npm run dev    # Development server
npm run build  # Production build
npm test       # Run tests
```

## API Endpoints

### Seeds
- `POST /api/seeds` - Create seed
- `GET /api/seeds/:id` - Get seed
- `GET /api/seeds/:id/y-cards` - Get transparency card

### Communities
- `POST /api/communities` - Create community
- `GET /api/communities/:id/fot` - Get FOT score
- `POST /api/communities/:id/trust-events` - Record trust event

### Anti-Capture
- `POST /api/communities/:id/sacred-clown` - Trigger disruption
- `GET /api/communities/:id/membrane` - Get membrane state

## Field of Trust Indicators

1. **Mutual Support Frequency** - Spontaneous, not mandated
2. **Response Velocity** - How quickly community rallies
3. **Difficult Topic Engagement** - Conflict deepens rather than fractures
4. **Benefit Distribution** - Value flows to everyone, not just influencers
5. **Psychological Safety** - Vulnerability without fear of weaponization

**Hologram Principle:** Trust manifests only when ALL dimensions align. Composite = minimum of all indicators (not average).

## Anti-Capture Suite

- **Y Cards** - Complete algorithmic transparency
- **Time-Lock** - 30-day maturation (kills viral manipulation)
- **Sacred Clown** - Productive disruption preventing premature closure
- **Living Membrane** - Semi-permeable boundary (blocks threats, enables flourishing)
- **V-Crystal** - Immune system for conflict dynamics

## License

MIT