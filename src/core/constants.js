/**
 * PIROTS 5 - Game Constants
 * All game-wide constants and configuration values
 */

// Game Configuration
export const GAME_CONFIG = {
    WIDTH: 1600,
    HEIGHT: 900,
    TARGET_FPS: 60,
    MIN_FPS: 30,
    ASPECT_RATIO: 16 / 9
};

// Grid Configuration
export const GRID_CONFIG = {
    START_WIDTH: 6,
    START_HEIGHT: 6,
    MAX_WIDTH: 8,
    MAX_HEIGHT: 8,
    CELL_SIZE: 80,
    CELL_SPACING: 4,
    GRID_OFFSET_X: 400,
    GRID_OFFSET_Y: 150
};

// Bird Types
export const BIRD_TYPES = {
    RED: {
        name: 'Captain',
        color: 'red',
        colorHex: '#E60000',
        specialAbility: 'speed',
        speedMultiplier: 1.2,
        description: 'Collects red gems with 1.2x speed'
    },
    BLUE: {
        name: 'Navigator',
        color: 'blue',
        colorHex: '#0066CC',
        specialAbility: 'teleport',
        teleportRange: 1.5,
        description: 'Collects blue gems with extra teleport range'
    },
    GREEN: {
        name: 'Engineer',
        color: 'green',
        colorHex: '#00AA00',
        specialAbility: 'bombs',
        description: 'Collects green gems and can activate bombs'
    },
    YELLOW: {
        name: 'Scout',
        color: 'yellow',
        colorHex: '#FFCC00',
        specialAbility: 'reveal',
        description: 'Collects yellow gems and reveals hidden features'
    },
    PURPLE: {
        name: 'Mystic',
        color: 'purple',
        colorHex: '#AA00FF',
        specialAbility: 'wild',
        spawnChance: 0.05,
        description: 'Collects all colors (5% spawn chance)'
    },
    ORANGE: {
        name: 'Berserker',
        color: 'orange',
        colorHex: '#FF6600',
        specialAbility: 'chaos',
        collectSpeed: 2.0,
        description: 'Collects 2x faster but chaotically'
    }
};

// Gem Configuration
export const GEM_TYPES = {
    RED: { color: 'red', colorHex: '#E60000', maxTier: 9, maxPayout: 40 },
    BLUE: { color: 'blue', colorHex: '#0066CC', maxTier: 9, maxPayout: 35 },
    GREEN: { color: 'green', colorHex: '#00AA00', maxTier: 9, maxPayout: 35 },
    YELLOW: { color: 'yellow', colorHex: '#FFCC00', maxTier: 9, maxPayout: 30 },
    PURPLE: { color: 'purple', colorHex: '#AA00FF', maxTier: 9, maxPayout: 45 },
    ORANGE: { color: 'orange', colorHex: '#FF6600', maxTier: 9, maxPayout: 50 }
};

// Gem Tier Payouts
export const GEM_PAYOUTS = {
    2: 1,
    3: 2,
    4: 4,
    5: 8,
    6: 12,
    7: 18,
    8: 26,
    9: 40  // Max for most colors
};

// Feature Symbols
export const FEATURE_SYMBOLS = {
    UPGRADE: { type: 'upgrade', symbol: '↑', rarity: 0.15 },
    SUPER_UPGRADE: { type: 'super_upgrade', symbol: '⇈', rarity: 0.02 },
    TRANSFORM: { type: 'transform', symbol: '🔄', rarity: 0.12 },
    RAINBOW_TRANSFORM: { type: 'rainbow_transform', symbol: '🌈', rarity: 0.03 },
    WILD: { type: 'wild', symbol: '⭐', rarity: 0.10 },
    EXPANDING_WILD: { type: 'expanding_wild', symbol: '✨', rarity: 0.05 },
    WALKING_WILD: { type: 'walking_wild', symbol: '💫', rarity: 0.04 },
    BONUS: { type: 'bonus', symbol: '💎', rarity: 0.08 },
    MEGA_BONUS: { type: 'mega_bonus', symbol: '💠', rarity: 0.02 },
    MULTIPLIER_2X: { type: 'multiplier', symbol: '×2', value: 2, rarity: 0.08 },
    MULTIPLIER_3X: { type: 'multiplier', symbol: '×3', value: 3, rarity: 0.05 },
    MULTIPLIER_5X: { type: 'multiplier', symbol: '×5', value: 5, rarity: 0.02 },
    TIME_FREEZE: { type: 'time_freeze', symbol: '⏸️', rarity: 0.04 },
    MAGNET: { type: 'magnet', symbol: '🧲', rarity: 0.06 }
};

// Movement Types
export const MOVEMENT_TYPES = {
    STANDARD: { speed: 1, name: 'standard' },
    SPRINT: { speed: 2, name: 'sprint', requirement: 3 },  // 3+ gems needed
    DASH: { speed: 3, name: 'dash', requirement: 5 },      // 5+ gems needed
    ORBIT: { speed: 1.5, name: 'orbit' }
};

// Animation Timings (in milliseconds)
export const ANIMATION_TIMINGS = {
    GEM_SPAWN: 100,           // Per row
    GEM_COLLECT: 150,         // Per gem (faster than P4's 200ms)
    GEM_EXPLODE: 600,
    GEM_UPGRADE: 500,
    GEM_TRANSFORM: 700,
    BIRD_MOVE: 300,
    BIRD_COLLECT: 400,
    BIRD_TELEPORT: 600,
    BIRD_TRANSFORM: 1200,
    CASCADE_DROP: 600,
    CASCADE_FILL: 400,
    GRID_EXPAND: 600,
    PORTAL_WARP: 1000,
    BLACK_HOLE_ABSORB: 2000,
    FEATURE_ACTIVATE: 500,
    COMBO_POPUP: 400,
    WIN_SMALL: 800,
    WIN_BIG: 2000,
    WIN_MEGA: 5000
};

// Weather System
export const WEATHER_TYPES = {
    METEOR_SHOWER: {
        name: 'Meteor Shower',
        duration: 5,
        effect: 'gem_rain',
        spawnRate: 1.5,
        probability: 0.06
    },
    SOLAR_STORM: {
        name: 'Solar Storm',
        duration: 3,
        effect: 'payout_boost',
        multiplier: 1.5,
        probability: 0.04
    },
    NEBULA_CLOUD: {
        name: 'Nebula Cloud',
        duration: 4,
        effect: 'transform',
        probability: 0.03
    },
    COSMIC_WIND: {
        name: 'Cosmic Wind',
        duration: 3,
        effect: 'speed_boost',
        speedMultiplier: 2.0,
        probability: 0.04
    },
    STARDUST_RAIN: {
        name: 'Stardust Rain',
        duration: 6,
        effect: 'wild_spawn',
        spawnRate: 2,
        probability: 0.05
    },
    DARK_MATTER: {
        name: 'Dark Matter Phase',
        duration: 4,
        effect: 'black_hole',
        blackHoleChance: 0.5,
        probability: 0.03
    }
};

// Portal Types
export const PORTAL_TYPES = {
    STANDARD: {
        name: 'Standard Portal',
        color: '#00FF00',
        pairs: true,
        probability: 0.12
    },
    QUANTUM: {
        name: 'Quantum Portal',
        color: '#AA00FF',
        exits: 3,
        probability: 0.06
    },
    WORMHOLE: {
        name: 'Wormhole Tunnel',
        color: '#0066CC',
        tunnel: true,
        probability: 0.04
    },
    GRAVITY_WELL: {
        name: 'Gravity Well',
        color: '#FF6600',
        pull: true,
        probability: 0.05
    }
};

// Feature Trigger Probabilities
export const FEATURE_PROBABILITIES = {
    BONUS_GAME: 1 / 250,           // 0.4%
    SUPER_BONUS: 1 / 800,          // 0.125%
    BLACK_HOLE: 1 / 50,            // 2%
    ALIEN_INVASION: 1 / 80,        // 1.25%
    LOST_IN_SPACE: 1 / 400,        // 0.25%
    WEATHER_EVENT: 0.15,           // 15%
    MEGA_FEATURE: 1 / 150,         // 0.67%
    MEGA_JACKPOT: 0.001            // 0.1%
};

// Math Model
export const MATH_MODEL = {
    RTP: 0.96,                     // 96% Return to Player
    VOLATILITY: 9,                 // High (9/10)
    HIT_FREQUENCY: 0.32,           // 32%
    MAX_WIN: 15000,                // 15,000x
    MIN_BET: 0.20,
    MAX_BET: 200,
    DEFAULT_BET: 1.00
};

// Combo System
export const COMBO_CONFIG = {
    COMBO_WINDOW: 1000,            // 1 second between collections
    COMBO_3_MULTIPLIER: 1.1,
    COMBO_5_MULTIPLIER: 1.25,
    COMBO_7_MULTIPLIER: 1.5,
    COMBO_10_MULTIPLIER: 2.0,
    MAX_COMBO: 20
};

// Cascade System
export const CASCADE_CONFIG = {
    MAX_CASCADES: 5,
    CASCADE_DELAY: 600,
    DROP_SPEED: 400,
    FILL_DELAY: 200
};

// Audio Configuration
export const AUDIO_CONFIG = {
    MASTER_VOLUME: 1.0,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.6,
    MAX_SIMULTANEOUS_SOUNDS: 32,
    MUSIC_LAYERS: 6,
    SPATIAL_AUDIO: true,
    EXCITEMENT_LEVELS: {
        CALM: 20,
        BUILDING: 40,
        EXCITING: 60,
        INTENSE: 80,
        EPIC: 100
    }
};

// Color Palette
export const COLORS = {
    DEEP_SPACE_BLUE: '#0A0E27',
    COSMIC_PURPLE: '#5D3FD3',
    NEBULA_PINK: '#FF006E',
    STAR_WHITE: '#FFFFFF',
    GOLD_ACCENT: '#FFD700',
    RUBY_RED: '#E60000',
    SAPPHIRE_BLUE: '#0066CC',
    EMERALD_GREEN: '#00AA00',
    TOPAZ_YELLOW: '#FFCC00',
    AMETHYST_PURPLE: '#AA00FF',
    CITRINE_ORANGE: '#FF6600'
};

// UI Configuration
export const UI_CONFIG = {
    METER_WIDTH: 200,
    METER_HEIGHT: 20,
    METER_SPACING: 10,
    BUTTON_WIDTH: 120,
    BUTTON_HEIGHT: 50,
    FONT_FAMILY: 'Arial, sans-serif',
    FONT_SIZE_SMALL: 14,
    FONT_SIZE_MEDIUM: 18,
    FONT_SIZE_LARGE: 24,
    FONT_SIZE_HUGE: 48
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
    MAX_PARTICLES: 1000,
    MAX_PARTICLES_MOBILE: 500,
    TEXTURE_QUALITY: 'high',      // high, medium, low
    ENABLE_SHADOWS: true,
    ENABLE_GLOW: true,
    ENABLE_SCREEN_SHAKE: true
};

// State Names
export const STATES = {
    BOOT: 'BootState',
    PRELOAD: 'PreloadState',
    MAIN_MENU: 'MainMenuState',
    MAIN_GAME: 'MainGameState',
    BONUS_GAME: 'BonusGameState',
    SUPER_BONUS: 'SuperBonusState',
    LOST_IN_SPACE: 'LostInSpaceState',
    MEGA_JACKPOT: 'MegaJackpotState'
};

// X-iter Feature Buy Options
export const XITER_OPTIONS = {
    BONUS_HUNT: { cost: 3, effect: 'bonus_hunt', multiplier: 4 },
    ALIEN_INVASION: { cost: 25, effect: 'alien_invasion' },
    LOST_IN_SPACE: { cost: 50, effect: 'lost_in_space' },
    BONUS_GAME: { cost: 100, effect: 'bonus_game' },
    SUPER_BONUS: { cost: 500, effect: 'super_bonus' },
    MEGA_FEATURE: { cost: 150, effect: 'mega_feature' },
    ULTIMATE_MODE: { cost: 1000, effect: 'ultimate', multiplier: 3 }
};

export default {
    GAME_CONFIG,
    GRID_CONFIG,
    BIRD_TYPES,
    GEM_TYPES,
    GEM_PAYOUTS,
    FEATURE_SYMBOLS,
    MOVEMENT_TYPES,
    ANIMATION_TIMINGS,
    WEATHER_TYPES,
    PORTAL_TYPES,
    FEATURE_PROBABILITIES,
    MATH_MODEL,
    COMBO_CONFIG,
    CASCADE_CONFIG,
    AUDIO_CONFIG,
    COLORS,
    UI_CONFIG,
    PERFORMANCE_CONFIG,
    STATES,
    XITER_OPTIONS
};
