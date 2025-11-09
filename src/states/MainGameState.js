/**
 * PIROTS 5 - Main Game State
 * The primary gameplay state where all the action happens
 */

import Phaser from 'phaser';
import { COLORS, GAME_CONFIG, BIRD_TYPES, FEATURE_PROBABILITIES } from '../core/constants.js';
import Grid from '../entities/Grid.js';
import Bird from '../entities/Bird.js';
import AudioManager from '../audio/AudioManager.js';
import BlackHole from '../features/BlackHole.js';

export default class MainGameState extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameState' });

        // Game entities
        this.grid = null;
        this.birds = [];
        this.audioManager = null;

        // Game state
        this.gameState = 'idle'; // idle, spinning, collecting, cascading, feature
        this.currentBet = 1.00;
        this.balance = 1000.00;
        this.currentWin = 0;
        this.totalWin = 0;

        // Meters and progress
        this.collectionMeters = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
            purple: 0,
            orange: 0
        };

        // Feature tracking
        this.bonusSymbolsCollected = 0;
        this.activeFeatures = [];
        this.currentMultiplier = 1.0;

        // Combo tracking
        this.currentCombo = 0;
        this.lastCollectionTime = 0;
    }

    create() {
        console.log('🎮 MainGameState: Creating main game...');

        // Setup background
        this.createBackground();

        // Create grid
        this.createGrid();

        // Spawn birds
        this.spawnBirds();

        // Create UI
        this.createUI();

        // Setup input
        this.setupInput();

        // Initialize audio
        this.initAudio();

        console.log('✅ MainGameState: Main game ready!');

        // Show welcome message
        this.showWelcomeMessage();
    }

    update(time, delta) {
        // Main game loop
        // This will update all game entities

        if (this.grid) {
            this.grid.update(time, delta);
        }

        // Update birds
        this.birds.forEach(bird => bird.update(time, delta));

        // Check combo timeout
        this.updateCombo(time);
    }

    createBackground() {
        // Use real Pirots 4 background
        const bg = this.add.image(
            GAME_CONFIG.WIDTH / 2,
            GAME_CONFIG.HEIGHT / 2,
            'bg_main'
        );

        // Scale to fit screen
        const scaleX = GAME_CONFIG.WIDTH / bg.width;
        const scaleY = GAME_CONFIG.HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Set to background depth
        bg.setDepth(-100);

        console.log('🎨 Real background loaded and scaled');
    }

    createGrid() {
        console.log('🎯 Creating game grid...');

        // Create grid instance
        this.grid = new Grid(this);

        // Initialize grid
        this.grid.init();

        console.log('✅ Grid created');
    }

    createUI() {
        console.log('🖼️  Creating UI...');

        const uiX = 50;
        const uiY = 50;

        // Game title
        this.add.text(GAME_CONFIG.WIDTH / 2, 30, 'PIROTS 5', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '32px',
            color: COLORS.GOLD_ACCENT,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Balance display
        this.balanceText = this.add.text(uiX, uiY, `💰 Balance: €${this.balance.toFixed(2)}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: COLORS.STAR_WHITE
        });

        // Bet display
        this.betText = this.add.text(uiX, uiY + 30, `🎰 Bet: €${this.currentBet.toFixed(2)}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: COLORS.STAR_WHITE
        });

        // Win display
        this.winText = this.add.text(uiX, uiY + 60, `🏆 Win: €${this.currentWin.toFixed(2)}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: COLORS.GOLD_ACCENT
        });

        // Spin button
        this.createSpinButton();

        // Collection meters (placeholder)
        this.createCollectionMeters();

        console.log('✅ UI created');
    }

    createSpinButton() {
        const buttonX = GAME_CONFIG.WIDTH / 2;
        const buttonY = GAME_CONFIG.HEIGHT - 80;
        const buttonWidth = 200;
        const buttonHeight = 60;

        // Button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x5D3FD3, 1);
        buttonBg.fillRoundedRect(
            buttonX - buttonWidth / 2,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            10
        );

        // Button border
        buttonBg.lineStyle(3, 0xFFD700, 1);
        buttonBg.strokeRoundedRect(
            buttonX - buttonWidth / 2,
            buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            10
        );

        // Button text
        const buttonText = this.add.text(buttonX, buttonY, 'SPIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '32px',
            color: COLORS.STAR_WHITE,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make interactive
        const buttonZone = this.add.zone(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight
        ).setInteractive({ useHandCursor: true });

        buttonZone.on('pointerdown', () => {
            this.onSpinClicked();
        });

        // Hover effect
        buttonZone.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x7D5FF3, 1);
            buttonBg.fillRoundedRect(
                buttonX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonBg.lineStyle(3, 0xFFD700, 1);
            buttonBg.strokeRoundedRect(
                buttonX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
        });

        buttonZone.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x5D3FD3, 1);
            buttonBg.fillRoundedRect(
                buttonX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
            buttonBg.lineStyle(3, 0xFFD700, 1);
            buttonBg.strokeRoundedRect(
                buttonX - buttonWidth / 2,
                buttonY - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                10
            );
        });

        this.spinButton = { bg: buttonBg, text: buttonText, zone: buttonZone };
    }

    createCollectionMeters() {
        // Placeholder for collection meters
        // Will be fully implemented later
        const meterX = GAME_CONFIG.WIDTH - 250;
        const meterY = 200;

        this.add.text(meterX, meterY - 30, 'Collection Meters', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: COLORS.STAR_WHITE,
            fontStyle: 'bold'
        });

        const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
        colors.forEach((color, index) => {
            this.add.text(meterX, meterY + (index * 30), `${color}: 0%`, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: COLORS.STAR_WHITE
            });
        });
    }

    setupInput() {
        // Space bar to spin
        this.input.keyboard.on('keydown-SPACE', () => {
            this.onSpinClicked();
        });

        console.log('⌨️  Input setup complete');
    }

    initAudio() {
        console.log('🔊 Initializing audio system...');
        this.audioManager = new AudioManager(this);
    }

    spawnBirds() {
        console.log('🦜 Spawning birds...');

        // Spawn 4 basic birds at grid edges
        const birdConfigs = [
            { type: 'red', x: 0, y: 0 },              // Top-left
            { type: 'blue', x: this.grid.width - 1, y: 0 },  // Top-right
            { type: 'green', x: 0, y: this.grid.height - 1 }, // Bottom-left
            { type: 'yellow', x: this.grid.width - 1, y: this.grid.height - 1 }  // Bottom-right
        ];

        // 5% chance to spawn purple mystic bird
        if (Math.random() < 0.05) {
            const centerX = Math.floor(this.grid.width / 2);
            const centerY = Math.floor(this.grid.height / 2);
            birdConfigs.push({ type: 'purple', x: centerX, y: centerY });
            console.log('✨ RARE: Purple Mystic spawned!');
        }

        // Spawn each bird
        birdConfigs.forEach(config => {
            const bird = new Bird(this, config.type, config.x, config.y);
            bird.init(this.grid);
            this.birds.push(bird);
        });

        console.log(`✅ Spawned ${this.birds.length} birds`);
    }

    onSpinClicked() {
        if (this.gameState !== 'idle') {
            console.log('⚠️  Cannot spin - game in progress');
            return;
        }

        if (this.balance < this.currentBet) {
            console.log('⚠️  Insufficient balance');
            return;
        }

        console.log('🎰 SPIN!');
        this.startSpin();
    }

    startSpin() {
        // Deduct bet
        this.balance -= this.currentBet;
        this.updateBalanceDisplay();

        // Reset win
        this.currentWin = 0;
        this.updateWinDisplay();

        // Change state
        this.gameState = 'spinning';

        // Populate grid with gems
        if (this.grid) {
            this.grid.populate();
        }

        // After population, start collection phase
        this.time.delayedCall(1000, () => {
            this.startCollectionPhase();
        });
    }

    startCollectionPhase() {
        console.log('🦜 Collection phase starting...');
        this.gameState = 'collecting';

        // Reset birds for this spin
        this.birds.forEach(bird => bird.reset());

        // Start bird AI collection
        this.runBirdCollection();
    }

    runBirdCollection() {
        console.log('🎯 Birds starting collection...');

        // Each bird finds and collects gems
        this.birds.forEach((bird, index) => {
            // Stagger bird actions slightly for visual variety
            this.time.delayedCall(index * 100, () => {
                bird.findAndCollectGems();
            });
        });

        // Calculate excitement for music
        const excitement = this.audioManager.calculateExcitement({
            birdsActive: this.birds.length,
            featuresActive: this.activeFeatures.length,
            currentMultiplier: this.currentMultiplier,
            gemsCollected: this.getTotalGemsCollected()
        });

        this.audioManager.updateMusic(excitement);

        // Check if collection is complete after reasonable time
        this.time.delayedCall(5000, () => {
            this.checkCollectionComplete();
        });
    }

    checkCollectionComplete() {
        // Check if all birds are idle (done collecting)
        const allIdle = this.birds.every(bird =>
            bird.state === 'idle' || bird.state === 'stunned'
        );

        if (allIdle) {
            console.log('✅ Collection phase complete');
            this.endCollectionPhase();
        } else {
            // Check again in a bit
            this.time.delayedCall(1000, () => {
                this.checkCollectionComplete();
            });
        }
    }

    endCollectionPhase() {
        console.log('💰 Calculating wins...');

        // Calculate clusters and wins
        const clusters = this.grid.findClusters();

        if (clusters.length > 0) {
            console.log(`Found ${clusters.length} clusters!`);
            this.awardWins(clusters);
        } else {
            console.log('No clusters found');
        }

        // End spin
        this.time.delayedCall(1000, () => {
            this.endSpin();
        });
    }

    awardWins(clusters) {
        let totalWin = 0;

        clusters.forEach(cluster => {
            const payout = this.calculateClusterPayout(cluster);
            totalWin += payout;

            console.log(`💎 ${cluster.color} cluster (${cluster.count}) = €${payout.toFixed(2)}`);
        });

        // Apply multiplier
        totalWin *= this.currentMultiplier;

        // Update win
        this.currentWin = totalWin;
        this.balance += totalWin;

        // Update displays
        this.updateWinDisplay();
        this.updateBalanceDisplay();

        // Play win sound
        if (this.audioManager && totalWin > 0) {
            this.audioManager.playWinSound(totalWin, this.currentBet);
        }

        // Show win animation if significant
        if (totalWin >= this.currentBet * 10) {
            this.showBigWin(totalWin);
        }
    }

    calculateClusterPayout(cluster) {
        // Simple payout based on cluster size
        // This can be made more sophisticated later
        const baseValue = cluster.count * 0.5;
        return baseValue * this.currentBet;
    }

    showBigWin(amount) {
        const winText = this.add.text(
            GAME_CONFIG.WIDTH / 2,
            GAME_CONFIG.HEIGHT / 2,
            `BIG WIN!\n€${amount.toFixed(2)}`,
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                color: COLORS.GOLD_ACCENT,
                fontStyle: 'bold',
                align: 'center'
            }
        );
        winText.setOrigin(0.5);
        winText.setStroke('#000000', 8);
        winText.setDepth(1000);

        // Animate
        winText.setScale(0);
        this.tweens.add({
            targets: winText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Fade out
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: winText,
                alpha: 0,
                scale: 1.5,
                duration: 1000,
                onComplete: () => {
                    winText.destroy();
                }
            });
        });
    }

    getTotalGemsCollected() {
        return this.birds.reduce((sum, bird) => sum + bird.collectedThisSpin, 0);
    }

    endSpin() {
        console.log('✅ Spin complete');

        // Check for random feature triggers (2% chance voor testing - normaal 2%)
        this.checkFeatureTriggers();

        this.gameState = 'idle';
    }

    /**
     * Check if any random features should trigger
     */
    checkFeatureTriggers() {
        // Black Hole (2% chance)
        if (Math.random() < FEATURE_PROBABILITIES.BLACK_HOLE) {
            console.log('🎲 BLACK HOLE TRIGGERED!');
            this.triggerBlackHole();
            return; // One feature at a time
        }

        // TODO: Add other features here
        // - Weather events
        // - Alien Invasion
        // - etc.
    }

    /**
     * Trigger Black Hole feature
     */
    triggerBlackHole() {
        this.gameState = 'feature';

        // Spawn black hole at center of grid
        const centerX = GAME_CONFIG.WIDTH / 2;
        const centerY = GAME_CONFIG.HEIGHT / 2;

        // Determine type (40% mini, 35% standard, 25% mega)
        let type = 'standard';
        const roll = Math.random();
        if (roll < 0.40) type = 'mini';
        else if (roll < 0.75) type = 'standard';
        else type = 'mega';

        // Create and activate black hole
        const blackHole = new BlackHole(this, centerX, centerY);
        blackHole.spawn(type);

        // Wait a moment before activating
        this.time.delayedCall(1000, () => {
            blackHole.activate(this.grid, this.birds);
        });

        // After black hole is done, return to idle
        this.time.delayedCall(6000, () => {
            this.gameState = 'idle';
        });
    }

    updateCombo(time) {
        // Check if combo should reset (1 second timeout)
        if (this.currentCombo > 0 && time - this.lastCollectionTime > 1000) {
            console.log(`💥 Combo broken at ${this.currentCombo}`);
            this.currentCombo = 0;
        }
    }

    updateBalanceDisplay() {
        if (this.balanceText) {
            this.balanceText.setText(`💰 Balance: €${this.balance.toFixed(2)}`);
        }
    }

    updateWinDisplay() {
        if (this.winText) {
            this.winText.setText(`🏆 Win: €${this.currentWin.toFixed(2)}`);
        }
    }

    showWelcomeMessage() {
        const welcomeText = this.add.text(
            GAME_CONFIG.WIDTH / 2,
            GAME_CONFIG.HEIGHT / 2,
            'Welcome to PIROTS 5!\n\nPress SPIN or SPACE to start',
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: '28px',
                color: COLORS.GOLD_ACCENT,
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Fade out after 3 seconds
        this.tweens.add({
            targets: welcomeText,
            alpha: 0,
            duration: 1000,
            delay: 2000,
            onComplete: () => {
                welcomeText.destroy();
            }
        });
    }
}
