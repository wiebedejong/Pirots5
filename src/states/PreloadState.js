/**
 * PIROTS 5 - Preload State
 * Loads all game assets (sprites, sounds, music, fonts)
 */

import Phaser from 'phaser';
import { COLORS } from '../core/constants.js';

export default class PreloadState extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadState' });
        this.loadingBar = null;
        this.loadingText = null;
    }

    preload() {
        console.log('📦 PreloadState: Loading all assets...');

        // Create loading UI
        this.createLoadingUI();

        // Setup loading events
        this.setupLoadingEvents();

        // Load all assets
        this.loadAssets();
    }

    create() {
        console.log('✅ PreloadState: All assets loaded');

        // Small delay before starting main game
        this.time.delayedCall(500, () => {
            this.scene.start('MainGameState');
        });
    }

    createLoadingUI() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x0A0E27, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Title
        this.add.text(centerX, centerY - 100, '🦜 PIROTS 5 💎', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '56px',
            color: COLORS.GOLD_ACCENT,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Loading bar background
        const barWidth = 400;
        const barHeight = 30;
        const barX = centerX - barWidth / 2;
        const barY = centerY;

        const barBg = this.add.graphics();
        barBg.fillStyle(0x222222, 1);
        barBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);

        // Loading bar
        this.loadingBar = this.add.graphics();

        // Loading text
        this.loadingText = this.add.text(centerX, centerY + 60, 'Loading... 0%', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: COLORS.STAR_WHITE
        }).setOrigin(0.5);

        // Store dimensions for progress update
        this.barX = barX;
        this.barY = barY;
        this.barWidth = barWidth;
        this.barHeight = barHeight;
    }

    setupLoadingEvents() {
        // Update progress bar
        this.load.on('progress', (value) => {
            this.updateProgress(value);
        });

        // File loaded
        this.load.on('fileprogress', (file) => {
            console.log(`📄 Loaded: ${file.key}`);
        });

        // All files loaded
        this.load.on('complete', () => {
            console.log('✅ All assets loaded successfully');
        });

        // Error handling
        this.load.on('loaderror', (file) => {
            console.error(`❌ Error loading: ${file.key}`);
        });
    }

    updateProgress(value) {
        const percentage = Math.floor(value * 100);

        // Update bar
        this.loadingBar.clear();
        this.loadingBar.fillStyle(0x5D3FD3, 1);
        this.loadingBar.fillRoundedRect(
            this.barX + 2,
            this.barY + 2,
            (this.barWidth - 4) * value,
            this.barHeight - 4,
            8
        );

        // Update text
        if (this.loadingText) {
            this.loadingText.setText(`Loading... ${percentage}%`);
        }

        // Update HTML loading screen too
        if (window.Pirots5Instance) {
            window.Pirots5Instance.updateLoadingScreen(percentage, `Loading assets... ${percentage}%`);
        }
    }

    loadAssets() {
        // Set base path for assets
        this.load.setPath('assets/');

        console.log('🎨 Loading REAL Pirots 4 assets...');

        // ========================================
        // BACKGROUNDS
        // ========================================
        this.load.image('bg_main', 'sprites/bg_main.jpg');
        this.load.image('bg_bonus', 'sprites/bg_bonus.jpg');

        // ========================================
        // BIRD SPRITES
        // ========================================
        this.load.image('bird_red', 'sprites/Red_Bird.png');
        this.load.image('bird_blue', 'sprites/Blue_Bird.png');
        this.load.image('bird_green', 'sprites/Green_Bird.png');
        this.load.image('bird_purple', 'sprites/Purple_Bird.png');
        // Yellow bird will use green as placeholder (or create custom)
        this.load.image('bird_yellow', 'sprites/Green_Bird.png'); // Placeholder

        // ========================================
        // GEM SYMBOLS (Low tier with 7 levels)
        // ========================================
        // Red gems (Low1)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_red_${i}`, `sprites/Low1_${i}.png`);
        }

        // Blue gems (Low2)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_blue_${i}`, `sprites/Low2_${i}.png`);
        }

        // Green gems (Low3)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_green_${i}`, `sprites/Low3_${i}.png`);
        }

        // Yellow gems (Low4)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_yellow_${i}`, `sprites/Low4_${i}.png`);
        }

        // High tier gems (will use for tiers 8-9)
        this.load.image('gem_high_1', 'sprites/High1.png');
        this.load.image('gem_high_2', 'sprites/High2.png');
        this.load.image('gem_high_3', 'sprites/High3.png');
        this.load.image('gem_high_4', 'sprites/High4.png');

        // Purple gems (use High1 for now)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_purple_${i}`, 'sprites/High1.png');
        }

        // Orange gems (use High2 for now)
        for (let i = 1; i <= 7; i++) {
            this.load.image(`gem_orange_${i}`, 'sprites/High2.png');
        }

        // ========================================
        // FEATURE SYMBOLS
        // ========================================
        this.load.image('symbol_bonus', 'sprites/Bonus.png');
        this.load.image('symbol_super_bonus', 'sprites/SuperBonus.png');
        this.load.image('symbol_wild', 'sprites/Wild.png');
        this.load.image('symbol_transform', 'sprites/Transform.png');
        this.load.image('symbol_levelup', 'sprites/LevelUp.png');
        this.load.image('symbol_black_hole', 'sprites/BlackHole.png');
        this.load.image('symbol_bandit', 'sprites/Bandit.png');
        this.load.image('symbol_multiplier', 'sprites/Multiplier.png');
        this.load.image('symbol_invasion', 'sprites/InvasionTrigger.png');

        // ========================================
        // SOUND EFFECTS (Placeholder - will add later)
        // ========================================
        // this.load.audio('music_main', 'music/main_theme.mp3');
        // this.load.audio('collect', 'sounds/collect.mp3');

        console.log('✅ All asset loading configured');
    }

    createPlaceholderAssets() {
        // This method can create simple colored rectangles as placeholders
        // Will be implemented when we start creating visual elements
        console.log('🎨 Creating placeholder graphics...');
    }
}
