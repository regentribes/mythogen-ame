# AME Profiler — Implementation Guide

## Version 0.2 | 2026-03-30

This document provides the technical specification for building the AME (Affinity Mapping Engine) Profiler.

---

## 1. Core Data Model

### 1.1 Profile Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- State tracking
  matter_state TEXT CHECK (matter_state IN ('gas','liquid','solid','plasma')) DEFAULT 'gas',
  gate_position INTEGER CHECK (gate_position BETWEEN 0 AND 8) DEFAULT 0,
  confidence FLOAT CHECK (confidence BETWEEN 0 AND 1) DEFAULT 0.0,
  
  -- V-Crystal
  v_crystal JSONB DEFAULT '{"primary_position": "vulnerable", "position_scores": {}}',
  
  -- FOT readiness
  fot_indicators JSONB DEFAULT '{"values_expressed": false, "resonance_detected": false, "emotional_density_sufficient": false, "time_lock_satisfied": false}',
  fot_readiness_score FLOAT DEFAULT 0.0,
  
  -- Preferences
  conversation_mode TEXT CHECK (conversation_mode IN ('voice','chat')) DEFAULT 'chat'
);

CREATE INDEX idx_profiles_gate ON profiles(gate_position);
CREATE INDEX idx_profiles_fot ON profiles(fot_readiness_score);
```

### 1.2 Seeds Table

```sql
CREATE TABLE seeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Content
  text TEXT NOT NULL,
  canonical_value VARCHAR(255),
  
  -- Classification
  foundation_type TEXT CHECK (foundation_type IN ('need','belief','principle','value')) NOT NULL,
  confidence FLOAT CHECK (confidence BETWEEN 0 AND 1) DEFAULT 0.0,
  emotional_density FLOAT CHECK (emotional_density BETWEEN 0 AND 1) DEFAULT 0.0,
  matter_state TEXT CHECK (matter_state IN ('gas','liquid','solid','plasma')) DEFAULT 'gas',
  
  -- Position tracking (for VALUE seeds)
  gate_position INTEGER CHECK (gate_position BETWEEN 0 AND 8),
  ljmap_column INTEGER CHECK (ljmap_column BETWEEN 1 AND 9),
  ljmap_cycle INTEGER CHECK (ljmap_cycle BETWEEN 1 AND 3),
  
  -- Embedding for coherence matching
  embedding VECTOR(1536),
  
  -- Evidence
  evidence_messages TEXT[] DEFAULT '{}',
  expression_count INTEGER DEFAULT 1,
  
  -- Time lock (prevents gaming)
  original_detected_at TIMESTAMP DEFAULT NOW(),
  time_lock_satisfied BOOLEAN GENERATED AS 
    (NOW() - original_detected_at > INTERVAL '30 days') STORED
);

CREATE INDEX idx_seeds_profile ON seeds(profile_id);
CREATE INDEX idx_seeds_foundation ON seeds(foundation_type);
CREATE INDEX idx_seeds_embedding ON seeds USING vector(embedding);
```

### 1.3 Conversations Table

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Content
  role TEXT CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('voice','chat')),
  
  -- Classification results (from AI)
  foundation_detected TEXT CHECK (foundation_detected IN ('need','belief','principle','value')),
  gate_position INTEGER,
  confidence FLOAT,
  emotional_density FLOAT
);

CREATE INDEX idx_conversations_profile ON conversations(profile_id);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);
```

### 1.4 Communities Table

```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- FOT tracking
  fot_score FLOAT DEFAULT 0.0,
  mutual_support FLOAT DEFAULT 0.0,
  response_velocity FLOAT DEFAULT 0.0,
  difficult_topic FLOAT DEFAULT 0.0,
  benefit_distribution FLOAT DEFAULT 0.0,
  psychological_safety FLOAT DEFAULT 0.0,
  
  -- State
  matter_state TEXT DEFAULT 'gas',
  member_count INTEGER DEFAULT 0
);

CREATE TABLE community_members (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (community_id, profile_id)
);
```

---

## 2. Trust Formula & FOT

### 2.1 Trust Formula
```
Authentic Expression + Witnessed Resonance + Emotional Density = Trust Field
```

### 2.2 FOT Composite (Hologram Principle)
```typescript
function calculateFOT(indicators: FOTIndicators): number {
  return Math.min(
    indicators.mutualSupport,
    indicators.responseVelocity,
    indicators.difficultTopic,
    indicators.benefitDistribution,
    indicators.psychologicalSafety
  );
}
```

### 2.3 FOT Indicators

| Indicator | Description | Measurement |
|-----------|------------|------------|
| Mutual Support | Spontaneous help | Count of unprompted help events |
| Response Velocity | Rally speed | Time from request to response |
| Difficult Topic | Conflict handling | Topics raised + resolution rate |
| Benefit Distribution | Value flow | Gini coefficient of value distribution |
| Psychological Safety | Vulnerability tolerance | Unsafe disclosures / safe responses |

### 2.4 FOT Calculation Per Community

```sql
CREATE OR REPLACE FUNCTION calculate_fot(community_id UUID)
RETURNS FLOAT AS $$
DECLARE
  v_mutual_support FLOAT;
  v_response_velocity FLOAT;
  v_difficult_topic FLOAT;
  v_benefit_distribution FLOAT;
  v_psychological_safety FLOAT;
BEGIN
  -- Aggregate indicators from events table
  SELECT AVG(mutual_support_score) INTO v_mutual_support FROM community_events 
    WHERE community_id = community_id AND created_at > NOW() - INTERVAL '30 days';
  
  -- ... similar for other indicators
  
  RETURN LEAST(v_mutual_support, v_response_velocity, v_difficult_topic, 
           v_benefit_distribution, v_psychological_safety);
END;
$$ LANGUAGE plpgsql;
```

---

## 3. AI Conversation Engine

### 3.1 Four Questions

| Question | Dimension | What It Learns |
|----------|-----------|-------------|
| "Who am I becoming?" | Identity | Self-understanding, growth awareness |
| "Who are my people?" | Relationship | Affinity, resonant connections |
| "Where do I belong?" | Place/Community | Community matching |
| "Where do I put my energy?" | Action | Passion, Purpose, Collaboration |

### 3.2 Opening Questions Rule

Every question MUST use opening words: `What`, `Why`, `How`, `When`, `Where`, `Who`

NEVER use: `Does`, `Do`, `Are`, `Is`, `Can`, `Will`, `Should`, `Would`, `Could`, `Have`

### 3.3 AI Persona

System prompt must include:

> "This conversation is different from most online experiences. We're not here to extract data from you — we're here to help you understand yourself better and find your people and to determine your service(s) to humanity. Everything we discover together will be transparent to you, and you'll always see why we think what we think."

### 3.4 Four Foundations Classification

```typescript
enum Foundation {
  NEED = "need",        // Biological/Psychological requirements
  BELIEF = "belief",      // Epistemological claims
  PRINCIPLE = "principle", // Operational rules
  VALUE = "value"         // Relational, requires others
}

// Priority: ONLY VALUES GENERATE TRUST
```

### 3.5 Gate Advancement Criteria

- Minimum 3 substantive responses within current gate
- At least one VALUE-classified statement detected
- Member affirms synthesis (Why-Card)

---

## 4. Matter States

| State | Conversations | Confidence | Enables |
|-------|-------------|-----------|---------|
| Gas | < 3 | < 0.40 | Exploratory questions |
| Liquid | 3-7 | 0.40-0.75 | Pattern reflection |
| Solid | ≥7 | ≥0.75 | Reliable matching |
| Plasma | Ongoing | Any | System learning |

**Time Lock:** Patterns detected < 30 days ago NOT used for matching.

---

## 5. V-Crystal

### 5.1 Positions

- **Victim** — Feels powerless
- **Villain** — Causes harm
- **Victor** — Wins/succeeds
- **Virtuous** — Judges morally
- **Vengeful** — Seeks retaliation
- **Vulnerable** — Circuit breaker

### 5.2 Key Distinction (FROM VIC)

> **Vulnerability is the AXIS (not a point), with Virtuous and Vengeful as the POLES, and Victor, Villain, Victim spinning around the axis — dynamic and alive, every aspect part of every human.**

### 5.3 Implementation

```typescript
interface VCrystal {
  primary_position: string;
  position_scores: {
    victim: number;
    villain: number;
    victor: number;
    virtuous: number;
    vengeful: number;
    vulnerable: number;
  };
  trajectory: string;
}
```

---

## 6. Values Map (LJMAP)

### 6.1 130+ Values, 9 Columns, 3 Cycles

| Cycle | Columns | Description |
|-------|---------|-------------|
| 1 | 1-3 | Self-Worth (Foundation → Belonging → Utility) |
| 2 | 4-6 | Self-Expression (Quality → Service → Co-Creation) |
| 3 | 7-9 | Selfless Expression (Integration → Navigation → No-Self) |

### 6.2 FOT Contribution by Column

- Cycle 1 (1-3): Prerequisite, cannot generate FOT alone
- Cycle 2 (4-6): Generator, forming trust field
- Cycle 3 (7-9): Sustainer, active FOT

---

## 7. API Endpoints

### 7.1 Profiles

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /profiles | Create profile, start conversation |
| GET | /profiles/:id | Get profile state |
| PUT | /profiles/:id | Update preferences |

### 7.2 Conversations

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /conversations/:profile_id/message | Send message, get AI response |

### 7.3 Seeds

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /seeds/:profile_id | Get profile seeds |
| GET | /seeds/:profile_id/values | Get values only |

### 7.4 Matching

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | /matches/:profile_id | Get compatible profiles |
| GET | /communities/:id/fot | Get community FOT |

---

## 8. Anti-Capture Mechanisms

### 8.1 Time-Lock

- 30-day maturation before matching
- Cannot be bypassed

### 8.2 Why-Cards

Generated when:
- Value pattern detected in ≥2 messages
- Gate synthesis triggered
- User asks for explanation

Structure:
```json
{
  "type": "why_card",
  "detected": "value",
  "evidence": "...",
  "confidence": 0.65,
  "explanation": "We detected..."
}
```

### 8.3 Transparency

All pattern detections visible to user.

---

## 9. Tech Stack

| Component | Technology |
|-----------|-----------|
| Database | PostgreSQL + pgvector |
| API | Node.js / Fastify |
| AI | OpenAI GPT (realtime-mini / 5-mini) |
| Auth | Supabase |
| Frontend | Vue 3 |

---

## 10. Phased Implementation

### Phase 1: Seed & Profile (Modules 0-6)
- Database schema
- Profile CRUD
- AI conversation (4 Questions)
- Seed detection

### Phase 2: Matching (Modules 7-9)
- Vector embeddings (OpenAI)
- Coherence-based matching
- Community formation

### Phase 3: Community (Modules 10-14)
- FOT visualization
- Why-Cards
- Testing & reporting

---

## 11. Source Documents

- `ai-profiler-spec.pdf` — Implementation spec v0.2
- `architecture-of-conscious-patterning-v13.pdf` — Framework
- `mythogen-codex.docx` — 15 modules
- `singularius-trust-field-as-technology-creator.md` — Theory
- `SINGULARIUS_SUMMARY.md` ��� Core concepts
