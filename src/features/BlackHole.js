/**
 * PIROTS 5 - Black Hole Feature
 * Absorbs symbols and birds, then returns them in random positions
 */

import Phaser from 'phaser';
import { ANIMATION_TIMINGS, GEM_TYPES } from '../core/constants.js';
import Gem from '../entities/Gem.js';

export default class BlackHole {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Visual elements
        this.sprite = null;
        this.vortexEffect = null;
        this.absorbedItems = [];

        // State
        this.isActive = false;
        this.isAbsorbing = false;
        this.type = 'standard'; // 'mini', 'standard', 'mega'

        // Stats
        this.absorptionPower = 1.0;
        this.multiplierBonus = 1.0;
    }

    /**
     * Spawn the black hole
     */
    spawn(type = 'standard') {
        this.type = type;
        this.isActive = true;

        // Set properties based on type
        switch (type) {
            case 'mini':
                this.absorptionPower = 0.5;
                this.multiplierBonus = 1.0;
                break;
            case 'standard':
                this.absorptionPower = 1.0;
                this.multiplierBonus = 1.0;
                break;
            case 'mega':
                this.absorptionPower = 1.5;
                this.multiplierBonus = 2.0;
                break;
        }

        // Create sprite
        this.sprite = this.scene.add.sprite(this.x, this.y, 'symbol_black_hole');
        this.sprite.setDepth(150);

        // Scale based on type
        const baseScale = 0.8;
        const scale = baseScale * this.absorptionPower;
        this.sprite.setScale(scale);

        // Spawn animation
        this.sprite.setAlpha(0);
        this.sprite.setScale(0);

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: scale,
            scaleY: scale,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.startVortexAnimation();
            }
        });

        console.log(`⚫ Black Hole (${type}) spawned at (${this.x}, ${this.y})`);
    }

    /**
     * Start the vortex rotation animation
     */
    startVortexAnimation() {
        // Rotate the black hole
        this.scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsing effect
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: this.sprite.scaleX * 1.1,
            scaleY: this.sprite.scaleY * 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Create gravitational pull effect (particles spiraling in)
        this.createGravitationalEffect();
    }

    /**
     * Create visual gravitational pull effect
     */
    createGravitationalEffect() {
        // Create particles that spiral into the black hole
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                if (!this.isActive) return;

                const angle = Math.random() * Math.PI * 2;
                const distance = 150;
                const startX = this.x + Math.cos(angle) * distance;
                const startY = this.y + Math.sin(angle) * distance;

                const particle = this.scene.add.circle(startX, startY, 3, 0x9900FF, 0.8);
                particle.setDepth(149);

                // Spiral into center
                this.scene.tweens.add({
                    targets: particle,
                    x: this.x,
                    y: this.y,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        particle.destroy();
                    }
                });
            });
        }
    }

    /**
     * Activate the black hole - absorb symbols and birds
     */
    activate(grid, birds) {
        if (this.isAbsorbing) return;

        this.isAbsorbing = true;
        console.log('⚫ BLACK HOLE ACTIVATING!');

        // Play sound
        // this.scene.audioManager.play('blackhole_appear');

        // Absorption phase
        this.absorbPhase(grid, birds);

        // After absorption, chaos phase
        this.scene.time.delayedCall(ANIMATION_TIMINGS.BLACK_HOLE_ABSORB, () => {
            this.chaosPhase(grid, birds);
        });
    }

    /**
     * Absorption phase - pull everything in
     */
    absorbPhase(grid, birds) {
        console.log('💫 Absorption phase starting...');

        this.absorbedItems = [];

        // Absorb gems from grid
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const cell = grid.getCell(x, y);
                if (cell && cell.gem && !cell.gem.isCollected) {
                    this.absorbGem(cell.gem, x, y);
                }
            }
        }

        // Absorb birds (based on type)
        const birdsToAbsorb = this.type === 'mini' ? 1 :
                             this.type === 'standard' ? 2 : 3;

        for (let i = 0; i < Math.min(birdsToAbsorb, birds.length); i++) {
            const randomBird = Phaser.Math.RND.pick(birds);
            if (randomBird && randomBird.state !== 'absorbed') {
                this.absorbBird(randomBird);
            }
        }

        // Visual: Screen shake
        this.scene.cameras.main.shake(ANIMATION_TIMINGS.BLACK_HOLE_ABSORB, 0.01);
    }

    /**
     * Absorb a gem
     */
    absorbGem(gem, gridX, gridY) {
        this.absorbedItems.push({
            type: 'gem',
            gemType: gem.type,
            tier: gem.tier,
            gridX: gridX,
            gridY: gridY
        });

        // Animate gem being sucked in
        if (gem.sprite) {
            this.scene.tweens.add({
                targets: gem.sprite,
                x: this.x,
                y: this.y,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 1000,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    gem.destroy();
                }
            });
        }
    }

    /**
     * Absorb a bird
     */
    absorbBird(bird) {
        this.absorbedItems.push({
            type: 'bird',
            birdType: bird.colorName,
            birdObject: bird
        });

        bird.state = 'absorbed';

        // Animate bird being sucked in
        this.scene.tweens.add({
            targets: [bird.sprite, bird.nameText],
            x: this.x,
            y: this.y,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 1200,
            ease: 'Cubic.easeIn'
        });

        console.log(`🦜 ${bird.type.name} absorbed by black hole!`);
    }

    /**
     * Chaos phase - return items in random positions
     */
    chaosPhase(grid, birds) {
        console.log('🌀 Chaos phase starting...');

        // Determine chaos outcome based on type
        let outcome = 'standard';
        const roll = Math.random();

        if (this.type === 'mega') {
            // Mega always has beneficial outcome
            outcome = roll < 0.5 ? 'mega_bonus' : 'white_hole';
        } else {
            // Standard chaos distribution
            if (roll < 0.4) outcome = 'mini';
            else if (roll < 0.75) outcome = 'standard';
            else if (roll < 0.95) outcome = 'mega_bonus';
            else outcome = 'white_hole';
        }

        // Execute outcome
        switch (outcome) {
            case 'mini':
                this.miniChaos(grid, birds);
                break;
            case 'standard':
                this.standardChaos(grid, birds);
                break;
            case 'mega_bonus':
                this.megaChaos(grid, birds);
                break;
            case 'white_hole':
                this.whiteHoleChaos(grid, birds);
                break;
        }

        // Destroy black hole after chaos
        this.scene.time.delayedCall(2000, () => {
            this.destroy();
        });
    }

    /**
     * Mini chaos - small shuffle
     */
    miniChaos(grid, birds) {
        console.log('🔸 Mini Black Hole outcome');

        // Return absorbed items in nearby random positions
        this.absorbedItems.forEach((item, index) => {
            this.scene.time.delayedCall(index * 100, () => {
                if (item.type === 'gem') {
                    this.returnGem(item, grid, 3); // Range 3
                }
            });
        });

        // Return birds
        this.returnBirds(birds, 1); // Return 1 bird
    }

    /**
     * Standard chaos - medium shuffle
     */
    standardChaos(grid, birds) {
        console.log('🔶 Standard Black Hole outcome');

        // Return items with medium spread
        this.absorbedItems.forEach((item, index) => {
            this.scene.time.delayedCall(index * 80, () => {
                if (item.type === 'gem') {
                    this.returnGem(item, grid, 5); // Range 5
                }
            });
        });

        // Return birds
        this.returnBirds(birds, 2);
    }

    /**
     * Mega chaos - with bonuses!
     */
    megaChaos(grid, birds) {
        console.log('🔥 MEGA Black Hole outcome - Bonuses!');

        // Return all gems with 2x multiplier
        this.scene.currentMultiplier *= 2;

        this.absorbedItems.forEach((item, index) => {
            this.scene.time.delayedCall(index * 60, () => {
                if (item.type === 'gem') {
                    // Return as upgraded gem
                    const upgradedItem = {...item, tier: Math.min(item.tier + 1, 9)};
                    this.returnGem(upgradedItem, grid, grid.width); // Full grid spread
                }
            });
        });

        // Return ALL birds with sprint ability
        this.returnBirds(birds, birds.length, true);

        // Add wild symbols
        this.spawnWildSymbols(grid, 3);

        // Epic sound
        // this.scene.audioManager.play('blackhole_mega');
    }

    /**
     * White hole - explosion of gems!
     */
    whiteHoleChaos(grid, birds) {
        console.log('✨ WHITE HOLE - Ultimate Explosion!');

        // Visual: White flash
        const flash = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0xFFFFFF
        );
        flash.setDepth(200);

        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 1000,
            onComplete: () => flash.destroy()
        });

        // Fill entire grid with high-tier gems
        grid.clearGems();

        this.scene.time.delayedCall(500, () => {
            for (let y = 0; y < grid.height; y++) {
                for (let x = 0; x < grid.width; x++) {
                    this.scene.time.delayedCall((y * grid.width + x) * 20, () => {
                        const gemTypes = Object.values(GEM_TYPES);
                        const randomType = Phaser.Math.RND.pick(gemTypes);
                        const highTier = Phaser.Math.Between(5, 7);

                        const center = grid.getCellCenter(x, y);
                        const gem = new Gem(this.scene, center.x, center.y, randomType);
                        gem.tier = highTier;

                        grid.cells[y][x].gem = gem;
                        grid.cells[y][x].isEmpty = false;
                        gem.spawn();
                    });
                }
            }
        });

        // Return all birds
        this.returnBirds(birds, birds.length, true);

        // 3x multiplier!
        this.scene.currentMultiplier = 3;

        console.log('⚡ 3x MULTIPLIER ACTIVE!');
    }

    /**
     * Return a gem to the grid
     */
    returnGem(item, grid, maxRange) {
        // Find random empty position within range
        const attempts = 20;
        for (let i = 0; i < attempts; i++) {
            const randomX = Phaser.Math.Between(
                Math.max(0, item.gridX - maxRange),
                Math.min(grid.width - 1, item.gridX + maxRange)
            );
            const randomY = Phaser.Math.Between(
                Math.max(0, item.gridY - maxRange),
                Math.min(grid.height - 1, item.gridY + maxRange)
            );

            const cell = grid.getCell(randomX, randomY);
            if (cell && !cell.gem) {
                // Spawn gem here
                const center = grid.getCellCenter(randomX, randomY);
                const gem = new Gem(this.scene, center.x, center.y, item.gemType);
                gem.tier = item.tier;

                cell.gem = gem;
                cell.isEmpty = false;
                gem.spawn();

                return;
            }
        }
    }

    /**
     * Return birds to the grid
     */
    returnBirds(allBirds, count, withBonus = false) {
        const absorbed = this.absorbedItems.filter(item => item.type === 'bird');

        for (let i = 0; i < Math.min(count, absorbed.length); i++) {
            const birdItem = absorbed[i];
            const bird = birdItem.birdObject;

            this.scene.time.delayedCall(i * 300, () => {
                if (!bird.sprite || !bird.nameText) {
                    console.warn('⚠️  Bird sprite missing during return');
                    return;
                }

                // Random position
                const randomX = Phaser.Math.Between(0, this.scene.grid.width - 1);
                const randomY = Phaser.Math.Between(0, this.scene.grid.height - 1);

                bird.gridX = randomX;
                bird.gridY = randomY;

                const worldPos = this.scene.grid.getCellCenter(randomX, randomY);
                bird.x = worldPos.x;
                bird.y = worldPos.y;
                bird.baseY = worldPos.y; // Update base position for idle animation

                // Calculate proper scale (same as initial spawn)
                const targetSize = 80;
                const properScale = targetSize / Math.max(bird.sprite.width, bird.sprite.height);

                // Reset sprite positions
                bird.sprite.x = worldPos.x;
                bird.sprite.y = worldPos.y;
                bird.nameText.x = worldPos.x;
                bird.nameText.y = worldPos.y - 50;

                // Set to 0 scale before animating
                bird.sprite.setScale(0);
                bird.nameText.setScale(0);

                // Respawn animation with proper scale
                this.scene.tweens.add({
                    targets: bird.sprite,
                    scaleX: properScale,
                    scaleY: properScale,
                    alpha: 1,
                    duration: 500,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        // Restart idle animation after respawn
                        bird.startIdleAnimation();
                    }
                });

                this.scene.tweens.add({
                    targets: bird.nameText,
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    duration: 500,
                    ease: 'Back.easeOut'
                });

                bird.state = 'idle';

                // Update grid cell
                const cell = this.scene.grid.getCell(randomX, randomY);
                if (cell) {
                    cell.bird = bird;
                }

                if (withBonus) {
                    bird.speed *= 1.5;
                    console.log(`✨ ${bird.type.name} returned with SPEED BOOST!`);
                }
            });
        }
    }

    /**
     * Spawn wild symbols on grid
     */
    spawnWildSymbols(grid, count) {
        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                const randomX = Phaser.Math.Between(0, grid.width - 1);
                const randomY = Phaser.Math.Between(0, grid.height - 1);

                const center = grid.getCellCenter(randomX, randomY);
                const wild = this.scene.add.sprite(center.x, center.y, 'symbol_wild');
                wild.setScale(0.6);
                wild.setDepth(10);

                // Spawn animation
                wild.setAlpha(0);
                wild.setScale(0);

                this.scene.tweens.add({
                    targets: wild,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    alpha: 1,
                    duration: 500,
                    ease: 'Back.easeOut'
                });

                console.log(`⭐ Wild symbol spawned at (${randomX}, ${randomY})`);
            });
        }
    }

    /**
     * Destroy the black hole
     */
    destroy() {
        this.isActive = false;

        // Collapse animation
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 800,
                ease: 'Back.easeIn',
                onComplete: () => {
                    this.sprite.destroy();
                }
            });
        }

        console.log('⚫ Black Hole closed');
    }
}
