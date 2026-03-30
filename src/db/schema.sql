-- Mythogen AME - PostgreSQL Schema with PG Vector
-- Field of Trust & Affinity Mapping Engine

-- Enable PG Vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Core Tables
-- ============================================

-- Living Seed Patterns (Profiles)
CREATE TABLE seed_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The Four Distinctions stored as JSONB
    needs JSONB NOT NULL DEFAULT '[]',
    beliefs JSONB NOT NULL DEFAULT '[]',
    principles JSONB NOT NULL DEFAULT '[]',
    "values" JSONB NOT NULL DEFAULT '[]',
    
    -- Seed metadata
    planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    maturation_level DECIMAL(3,2) NOT NULL DEFAULT 0,
    
    -- Values embedding for resonance detection
    values_embedding vector(1536), -- OpenAI ada-002 compatible
    
    -- Privacy
    visibility VARCHAR(20) NOT NULL DEFAULT 'private',
    CHECK (visibility IN ('private', 'community', 'public')),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX idx_seed_values_embedding ON seed_patterns 
    USING ivfflat (values_embedding vector_cosine_ops)
    WITH (lists = 100);

-- ============================================
-- Trust Indicator Tracking
-- ============================================

CREATE TABLE trust_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Context
    community_id UUID NOT NULL REFERENCES seed_patterns(id),
    indicator_type VARCHAR(50) NOT NULL,
    CHECK (indicator_type IN (
        'mutual-support', 'response-velocity', 'conflict-engagement',
        'benefit-distribution', 'psychological-safety'
    )),
    
    -- Value (0-1 scale)
    value DECIMAL(3,2) NOT NULL,
    sample_size INTEGER NOT NULL DEFAULT 1,
    
    -- Metadata
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure we track trends over time
    UNIQUE(community_id, indicator_type, measured_at)
);

-- Index for time-series queries
CREATE INDEX idx_trust_measurements_time ON trust_measurements 
    (community_id, indicator_type, measured_at DESC);

-- ============================================
-- Community (Pod) Structure
-- ============================================

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Membership (5-15 ideal)
    member_ids UUID[] NOT NULL DEFAULT '{}',
    
    -- Seed pattern for this community
    seed_pattern JSONB NOT NULL DEFAULT '{}',
    
    -- FOT Score (current composite)
    fot_score DECIMAL(3,2) NOT NULL DEFAULT 0,
    membrane_health DECIMAL(3,2) NOT NULL DEFAULT 0,
    is_plasma_state BOOLEAN NOT NULL DEFAULT FALSE,
    hologram_coherence DECIMAL(3,2) NOT NULL DEFAULT 0,
    
    -- Lifecycle
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    phase VARCHAR(20) NOT NULL DEFAULT 'forming',
    CHECK (phase IN ('forming', 'storming', 'norming', 'performing', 'mature')),
    
    -- Anti-capture state
    sacred_clown_active BOOLEAN NOT NULL DEFAULT FALSE,
    transparency_score DECIMAL(3,2) NOT NULL DEFAULT 1,
    
    -- Updated timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Anti-Capture Mechanisms
-- ============================================

-- Y Cards (Algorithmic Transparency)
CREATE TABLE y_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What algorithm was used
    algorithm VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    data_used TEXT[] NOT NULL,
    result TEXT NOT NULL,
    
    -- Timestamps
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    viewed_at TIMESTAMPTZ,
    
    -- Ownership
    owner_id UUID REFERENCES seed_patterns(id),
    
    CONSTRAINT y_card_not_expired CHECK (expires_at > NOW())
);

-- Time Locks (30-day maturation)
CREATE TABLE time_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    seed_id UUID NOT NULL REFERENCES seed_patterns(id) ON DELETE CASCADE,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    matures_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    is_mature BOOLEAN NOT NULL DEFAULT FALSE,
    
    UNIQUE(seed_id)
);

-- Membrane State (Semi-permeable boundary)
CREATE TABLE membrane_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    
    permeability_level DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    blocked_entities UUID[] NOT NULL DEFAULT '{}',
    allowed_entities UUID[] NOT NULL DEFAULT '{}',
    threat_level DECIMAL(3,2) NOT NULL DEFAULT 0,
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(community_id)
);

-- ============================================
-- V-Crystal Immune System
-- ============================================

CREATE TABLE v_dynamics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    trigger_event TEXT NOT NULL,
    active_positions VARCHAR(20)[] NOT NULL,
    dominant_position VARCHAR(20) NOT NULL,
    CHECK (dominant_position IN ('victor', 'villain', 'victim', 'vengeful', 'virtuous', 'vulnerable')),
    
    resolution_state VARCHAR(20) NOT NULL DEFAULT 'active',
    CHECK (resolution_state IN ('active', 'healing', 'resolved')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ============================================
-- LJ Map Values (Reference table)
-- ============================================

CREATE TABLE lj_map_values (
    id SERIAL PRIMARY KEY,
    
    value VARCHAR(255) NOT NULL UNIQUE,
    cycle VARCHAR(30) NOT NULL,
    CHECK (cycle IN ('self-worth', 'self-expression', 'selfless-expression')),
    
    column_number INTEGER NOT NULL CHECK (column_number BETWEEN 1 AND 9),
    description TEXT NOT NULL,
    
    -- Embedding for semantic search
    embedding vector(1536)
);

CREATE INDEX idx_lj_values_embedding ON lj_map_values 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10);

-- ============================================
-- Events for behavioral tracking
-- ============================================

CREATE TABLE community_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES seed_patterns(id),
    
    -- Event data
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    
    -- For trust calculations
    is_supportive BOOLEAN, -- Did this event provide support?
    response_time_ms INTEGER, -- How quickly did others respond?
    involves_conflict BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_community ON community_events 
    (community_id, created_at DESC);
CREATE INDEX idx_events_supportive ON community_events 
    (community_id, is_supportive) WHERE is_supportive = TRUE;

-- ============================================
-- Utility Functions
-- ============================================

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_seed_patterns_updated
    BEFORE UPDATE ON seed_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_communities_updated
    BEFORE UPDATE ON communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to check if time lock has matured
CREATE OR REPLACE FUNCTION is_seed_mature(p_seed_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_matured BOOLEAN;
BEGIN
    SELECT is_mature INTO v_matured
    FROM time_locks
    WHERE seed_id = p_seed_id;
    
    RETURN COALESCE(v_matured, FALSE);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate FOT score from indicators
CREATE OR REPLACE FUNCTION calculate_fot_score(p_community_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_indicators JSONB;
    v_composite DECIMAL(3,2);
    v_min DECIMAL(3,2);
    v_all_present BOOLEAN;
BEGIN
    -- Get recent measurements for all 5 indicators
    SELECT jsonb_agg(jsonb_build_object(
        'type', indicator_type,
        'value', value,
        'sample_size', sample_size,
        'measured_at', measured_at
    )) INTO v_indicators
    FROM (
        SELECT DISTINCT ON (indicator_type) 
            indicator_type, value, sample_size, measured_at
        FROM trust_measurements
        WHERE community_id = p_community_id
        ORDER BY indicator_type, measured_at DESC
    ) recent;
    
    -- Calculate composite (hologram = min of all, not sum)
    IF v_indicators IS NULL THEN
        RETURN jsonb_build_object(
            'overall', 0,
            'indicators', '[]'::jsonb,
            'is_plasma_state', FALSE,
            'hologram_coherence', 0
        );
    END IF;
    
    -- FOT only manifests when ALL dimensions align (hologram principle)
    SELECT MIN((v->>'value')::DECIMAL) INTO v_min FROM jsonb_array_elements(v_indicators) v;
    v_composite := v_min; -- Use minimum, not average (hologram model)
    
    -- Check if all 5 indicators present (full coherence)
    SELECT (SELECT COUNT(DISTINCT v->>'type') FROM jsonb_array_elements(v_indicators) v) = 5 INTO v_all_present;
    
    RETURN jsonb_build_object(
        'overall', v_composite,
        'indicators', v_indicators,
        'is_plasma_state', v_all_present AND v_min > 0.7,
        'hologram_coherence', v_min -- coherence = weakest link
    );
END;
$$ LANGUAGE plpgsql;