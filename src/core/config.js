/**
 * PIROTS 5 - Phaser Game Configuration
 */

import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from './constants.js';

// Import game states (will be created)
import BootState from '../states/BootState.js';
import PreloadState from '../states/PreloadState.js';
import MainGameState from '../states/MainGameState.js';

/**
 * Main Phaser game configuration
 */
export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    backgroundColor: COLORS.DEEP_SPACE_BLUE,

    // Physics not needed for slot game, but available if needed
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    // Rendering options
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    },

    // Scale configuration for responsive design
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
        min: {
            width: 800,
            height: 450
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // FPS configuration
    fps: {
        target: GAME_CONFIG.TARGET_FPS,
        min: GAME_CONFIG.MIN_FPS,
        forceSetTimeOut: false
    },

    // Audio configuration
    audio: {
        disableWebAudio: false,
        context: null,
        noAudio: false
    },

    // Input configuration
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false
    },

    // Banner configuration
    banner: {
        hidePhaser: false,
        text: COLORS.GOLD_ACCENT,
        background: [
            COLORS.COSMIC_PURPLE,
            COLORS.NEBULA_PINK,
            COLORS.DEEP_SPACE_BLUE
        ]
    },

    // Game scenes
    scene: [
        BootState,
        PreloadState,
        MainGameState
        // More states will be added as we build them
    ]
};

export default gameConfig;
