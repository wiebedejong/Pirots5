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

        // ========================================
        // PLACEHOLDER ASSETS
        // These will be replaced with actual assets later
        // ========================================

        // For now, we'll create placeholder graphics in code
        // Real assets from Pirots 4 pack will be loaded later

        console.log('⚠️  Loading placeholder assets (real assets will be added later)');

        // Load fonts (if any custom fonts)
        // this.load.font('pirots-font', 'fonts/pirots.ttf');

        // Placeholder sprites will be created programmatically
        // this.createPlaceholderAssets();

        // When ready, we'll load actual assets like:
        // this.load.image('bg_main', 'sprites/background_main.png');
        // this.load.spritesheet('bird_red', 'sprites/bird_red.png', { frameWidth: 64, frameHeight: 64 });
        // this.load.audio('music_main', 'music/main_theme.mp3');

        // For now, just simulate loading with a small delay
        // This prevents immediate completion
    }

    createPlaceholderAssets() {
        // This method can create simple colored rectangles as placeholders
        // Will be implemented when we start creating visual elements
        console.log('🎨 Creating placeholder graphics...');
    }
}
