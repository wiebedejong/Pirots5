/**
 * PIROTS 5 - Main Game Entry Point
 * Initializes the Phaser game and manages loading
 */

import Phaser from 'phaser';
import gameConfig from './config.js';

/**
 * Initialize and start the game
 */
class Pirots5Game {
    constructor() {
        this.game = null;
        this.loadingProgress = 0;
        this.init();
    }

    init() {
        // Update loading screen
        this.updateLoadingScreen(0, 'Initializing game engine...');

        // Create Phaser game instance
        try {
            this.game = new Phaser.Game(gameConfig);

            // Store game instance globally for debugging
            window.PIROTS5 = this.game;

            console.log('🦜 PIROTS 5 - Game engine initialized!');
            console.log('📊 Config:', {
                width: gameConfig.width,
                height: gameConfig.height,
                renderer: gameConfig.type === Phaser.AUTO ? 'AUTO' :
                         gameConfig.type === Phaser.WEBGL ? 'WEBGL' : 'CANVAS'
            });

            this.updateLoadingScreen(100, 'Game ready!');

            // Hide loading screen after brief delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 500);

        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.updateLoadingScreen(0, 'Error loading game!');
        }
    }

    /**
     * Update loading screen progress
     */
    updateLoadingScreen(progress, text) {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (loadingText && text) {
            loadingText.textContent = text;
        }

        this.loadingProgress = progress;
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 0.5s ease';
            loadingScreen.style.opacity = '0';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Get the game instance
     */
    getGame() {
        return this.game;
    }

    /**
     * Destroy the game
     */
    destroy() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}

// Create and start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting PIROTS 5...');
    const pirots5 = new Pirots5Game();

    // Make game accessible globally
    window.Pirots5Instance = pirots5;
});

export default Pirots5Game;
