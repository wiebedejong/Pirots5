/**
 * PIROTS 5 - Audio Manager
 * Manages all sounds, music, and spatial audio
 */

import { Howl, Howler } from 'howler';
import { AUDIO_CONFIG, COLORS } from '../core/constants.js';

export default class AudioManager {
    constructor(scene) {
        this.scene = scene;

        // Sound pools
        this.sounds = new Map();
        this.musicLayers = [];
        this.activeSounds = [];

        // Volume settings
        this.masterVolume = AUDIO_CONFIG.MASTER_VOLUME;
        this.sfxVolume = AUDIO_CONFIG.SFX_VOLUME;
        this.musicVolume = AUDIO_CONFIG.MUSIC_VOLUME;

        // Music state
        this.currentExcitement = 0;
        this.activeLayers = [];

        // Sound pooling
        this.maxSimultaneousSounds = AUDIO_CONFIG.MAX_SIMULTANEOUS_SOUNDS;

        // Initialize
        this.init();
    }

    /**
     * Initialize audio system
     */
    init() {
        console.log('🔊 Initializing Audio Manager...');

        // Set global Howler settings
        Howler.volume(this.masterVolume);

        // Load sounds (placeholder - real sounds will be loaded later)
        this.loadPlaceholderSounds();

        // Setup music layers
        this.setupMusicLayers();

        console.log('✅ Audio Manager initialized');
    }

    /**
     * Load placeholder sounds
     * Real sounds will be loaded from assets later
     */
    loadPlaceholderSounds() {
        console.log('⚠️  Loading placeholder audio (silent for now)');

        // For now, we'll just register sound keys without loading actual files
        // This prevents errors when trying to play sounds

        const soundKeys = [
            // Bird sounds
            'red_collect', 'blue_collect', 'green_collect', 'yellow_collect',
            'purple_collect', 'orange_collect',
            'bird_victory', 'bird_damaged',

            // Gem sounds
            'gem_collect_bronze', 'gem_collect_silver', 'gem_collect_gold', 'gem_collect_legendary',
            'gem_upgrade', 'gem_transform', 'gem_explode_small', 'gem_explode_large',

            // Combo sounds
            'combo_3', 'combo_5', 'combo_7', 'combo_10',

            // Feature sounds
            'blackhole_appear', 'blackhole_absorb', 'portal_warp', 'weather_warning',

            // UI sounds
            'spin_button_click', 'balance_update', 'bonus_trigger',

            // Win sounds
            'win_small', 'win_medium', 'win_big', 'win_mega', 'win_legendary'
        ];

        soundKeys.forEach(key => {
            // Register as placeholder (no actual audio file yet)
            this.sounds.set(key, {
                placeholder: true,
                key: key
            });
        });

        console.log(`📝 Registered ${soundKeys.length} sound placeholders`);
    }

    /**
     * Setup adaptive music layers
     */
    setupMusicLayers() {
        console.log('🎵 Setting up music layers (placeholder)');

        // Placeholder for 6 music layers
        // Real implementation will load actual music files

        this.musicLayers = [
            { name: 'ambient', active: true, volume: 1.0 },
            { name: 'theme', active: true, volume: 0.8 },
            { name: 'percussion', active: false, volume: 0.6 },
            { name: 'bass', active: false, volume: 0.7 },
            { name: 'synth', active: false, volume: 0.5 },
            { name: 'orchestral', active: false, volume: 0.8 }
        ];

        // Start with calm layers (1 & 2)
        this.activeLayers = [0, 1];
    }

    /**
     * Play a sound effect
     */
    play(key, options = {}) {
        const sound = this.sounds.get(key);

        if (!sound) {
            // console.warn(`⚠️  Sound not found: ${key}`);
            return null;
        }

        if (sound.placeholder) {
            // Silent placeholder - just log for now
            console.log(`🔇 [PLACEHOLDER] Playing: ${key}`);
            return null;
        }

        // Real sound playback would happen here
        // For now, just return a mock sound object

        return {
            key: key,
            stop: () => {},
            setVolume: (vol) => {},
            setPitch: (pitch) => {}
        };
    }

    /**
     * Play collection sound with variation
     */
    playCollectSound(bird, gemCount) {
        const birdColor = bird.colorName;
        const variant = Math.min(gemCount, 20);

        // Calculate pitch based on combo
        const pitch = 1.0 + (bird.comboStreak * 0.05);

        // Calculate volume based on excitement
        const volume = 0.7 + (this.currentExcitement / 100) * 0.3;

        // Calculate spatial pan based on bird position
        const pan = this.calculateSpatialPan(bird.sprite.x);

        console.log(`🔊 Collect sound: ${birdColor} (variant ${variant}, pitch ${pitch.toFixed(2)}, pan ${pan.toFixed(2)})`);

        this.play(`${birdColor}_collect`, {
            pitch: pitch,
            volume: volume,
            pan: pan
        });

        // Harmonic overlay for large collections
        if (gemCount > 5) {
            this.play('harmonic_chime', {
                volume: 0.3,
                delay: 0.1
            });
        }
    }

    /**
     * Calculate spatial pan for stereo positioning
     * @param {number} worldX - World X position
     * @returns {number} Pan value from -1 (left) to 1 (right)
     */
    calculateSpatialPan(worldX) {
        const gameWidth = this.scene.cameras.main.width;
        const centerX = gameWidth / 2;

        // Map worldX to pan range -1 to 1
        const pan = (worldX - centerX) / (gameWidth / 2);

        return Phaser.Math.Clamp(pan, -1, 1);
    }

    /**
     * Update music based on excitement level
     * @param {number} excitement - Excitement level 0-100
     */
    updateMusic(excitement) {
        this.currentExcitement = excitement;

        // Determine which layers should be active
        let layersToActivate = [];

        if (excitement < AUDIO_CONFIG.EXCITEMENT_LEVELS.CALM) {
            layersToActivate = [0, 1]; // Ambient + Theme
        } else if (excitement < AUDIO_CONFIG.EXCITEMENT_LEVELS.BUILDING) {
            layersToActivate = [0, 1, 2]; // + Percussion
        } else if (excitement < AUDIO_CONFIG.EXCITEMENT_LEVELS.EXCITING) {
            layersToActivate = [0, 1, 2, 3]; // + Bass
        } else if (excitement < AUDIO_CONFIG.EXCITEMENT_LEVELS.INTENSE) {
            layersToActivate = [0, 1, 2, 3, 4]; // + Synth
        } else {
            layersToActivate = [0, 1, 2, 3, 4, 5]; // ALL LAYERS (EPIC!)
        }

        // Crossfade layers
        this.crossfadeLayers(layersToActivate);

        console.log(`🎵 Music updated: Excitement ${excitement} → Layers: ${layersToActivate.join(', ')}`);
    }

    /**
     * Crossfade music layers
     */
    crossfadeLayers(targetLayers) {
        // Smooth crossfade over 2 seconds
        const fadeDuration = 2000;

        this.musicLayers.forEach((layer, index) => {
            const shouldBeActive = targetLayers.includes(index);

            if (shouldBeActive && !this.activeLayers.includes(index)) {
                // Fade in
                console.log(`🎵 Fading in layer: ${layer.name}`);
                // layer.fadeIn(fadeDuration);
            } else if (!shouldBeActive && this.activeLayers.includes(index)) {
                // Fade out
                console.log(`🎵 Fading out layer: ${layer.name}`);
                // layer.fadeOut(fadeDuration);
            }
        });

        this.activeLayers = targetLayers;
    }

    /**
     * Calculate excitement level based on game state
     */
    calculateExcitement(gameData) {
        const {
            birdsActive = 0,
            featuresActive = 0,
            currentMultiplier = 1,
            gemsCollected = 0
        } = gameData;

        // Simple formula - can be refined
        let excitement = 0;

        excitement += birdsActive * 10;           // Up to 60 (6 birds)
        excitement += featuresActive * 15;        // Variable
        excitement += (currentMultiplier - 1) * 20; // Multipliers add excitement
        excitement += Math.min(gemsCollected, 20); // Up to 20

        return Math.min(excitement, 100);
    }

    /**
     * Play combo sound based on streak
     */
    playComboSound(streak) {
        let soundKey = 'combo_3';

        if (streak >= 10) {
            soundKey = 'combo_10';
        } else if (streak >= 7) {
            soundKey = 'combo_7';
        } else if (streak >= 5) {
            soundKey = 'combo_5';
        }

        console.log(`🔥 COMBO SOUND: ${streak}x → ${soundKey}`);
        this.play(soundKey, { volume: 1.0 });
    }

    /**
     * Play win celebration sound
     */
    playWinSound(winAmount, betAmount) {
        const multiplier = winAmount / betAmount;

        let soundKey = 'win_small';

        if (multiplier >= 500) {
            soundKey = 'win_legendary'; // 8 seconds epic
        } else if (multiplier >= 100) {
            soundKey = 'win_mega';      // 5 seconds
        } else if (multiplier >= 50) {
            soundKey = 'win_big';       // 2 seconds
        } else if (multiplier >= 10) {
            soundKey = 'win_medium';    // 1 second
        }

        console.log(`🏆 WIN SOUND: ${multiplier.toFixed(1)}x → ${soundKey}`);
        this.play(soundKey);
    }

    /**
     * Duck music volume (for important sounds/voice)
     */
    duckMusic(amount = 0.4, duration = 500) {
        console.log(`🔉 Ducking music by ${amount * 100}%`);

        // Lower music volume temporarily
        this.musicLayers.forEach(layer => {
            if (layer.active) {
                // layer.fadeVolume(layer.volume * (1 - amount), duration);
            }
        });

        // Restore after duration
        setTimeout(() => {
            this.restoreMusic(duration);
        }, duration);
    }

    /**
     * Restore music volume
     */
    restoreMusic(duration = 500) {
        console.log('🔊 Restoring music volume');

        this.musicLayers.forEach(layer => {
            if (layer.active) {
                // layer.fadeVolume(layer.volume, duration);
            }
        });
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        console.log('🔇 Stopping all sounds');

        this.activeSounds.forEach(sound => {
            if (sound && sound.stop) {
                sound.stop();
            }
        });

        this.activeSounds = [];
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.masterVolume = Phaser.Math.Clamp(volume, 0, 1);
        Howler.volume(this.masterVolume);

        console.log(`🔊 Master volume set to ${(this.masterVolume * 100).toFixed(0)}%`);
    }

    /**
     * Set SFX volume
     */
    setSFXVolume(volume) {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
        console.log(`🔊 SFX volume set to ${(this.sfxVolume * 100).toFixed(0)}%`);
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);

        this.musicLayers.forEach(layer => {
            // layer.setVolume(layer.volume * this.musicVolume);
        });

        console.log(`🎵 Music volume set to ${(this.musicVolume * 100).toFixed(0)}%`);
    }

    /**
     * Get audio info
     */
    getInfo() {
        return {
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            excitement: this.currentExcitement,
            activeLayers: this.activeLayers,
            activeSounds: this.activeSounds.length
        };
    }
}
