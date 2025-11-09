/**
 * PIROTS 5 - Boot State
 * Initial boot state that sets up the game basics
 */

import Phaser from 'phaser';
import { COLORS } from '../core/constants.js';

export default class BootState extends Phaser.Scene {
    constructor() {
        super({ key: 'BootState' });
    }

    preload() {
        console.log('🔧 BootState: Preloading boot assets...');

        // Create simple loading graphics
        this.createLoadingGraphics();
    }

    create() {
        console.log('✅ BootState: Boot complete');

        // Setup game-wide settings
        this.setupGame();

        // Move to preload state
        this.scene.start('PreloadState');
    }

    createLoadingGraphics() {
        // Simple graphics for boot screen
        const graphics = this.add.graphics();
        graphics.fillStyle(0x0A0E27, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Add "PIROTS 5" text
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            '🦜 PIROTS 5 💎',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '64px',
                color: COLORS.GOLD_ACCENT,
                fontStyle: 'bold'
            }
        );
        titleText.setOrigin(0.5);

        // Add subtitle
        const subtitleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 30,
            'The Ultimate Treasure Hunt',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                color: COLORS.STAR_WHITE
            }
        );
        subtitleText.setOrigin(0.5);
    }

    setupGame() {
        // Disable right-click context menu
        this.input.mouse.disableContextMenu();

        // Setup scale mode for responsive design
        this.scale.on('resize', this.resize, this);

        // Initial resize
        this.resize();

        console.log('🎮 Game setup complete');
    }

    resize() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        console.log(`📐 Resize: ${width}x${height}`);

        // Adjust camera if needed
        this.cameras.resize(width, height);
    }
}
