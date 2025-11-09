/**
 * PIROTS 5 - Bird Class
 * Represents a bird that moves around the grid collecting gems
 */

import Phaser from 'phaser';
import { BIRD_TYPES, MOVEMENT_TYPES, ANIMATION_TIMINGS, COMBO_CONFIG, COLORS } from '../core/constants.js';

export default class Bird {
    constructor(scene, type, startX, startY) {
        this.scene = scene;
        this.type = BIRD_TYPES[type.toUpperCase()];
        this.colorName = this.type.color;

        // Position (grid coordinates)
        this.gridX = startX;
        this.gridY = startY;

        // World position
        this.x = 0;
        this.y = 0;

        // Visual elements
        this.sprite = null;
        this.trail = [];
        this.aura = null;

        // State
        this.state = 'idle'; // idle, moving, collecting, stunned, legendary
        this.movementType = 'standard';
        this.speed = this.type.speedMultiplier || 1.0;
        this.isLegendary = false;

        // Collection tracking
        this.collectedGems = 0;
        this.collectedThisSpin = 0;
        this.comboStreak = 0;
        this.consecutiveCollections = 0;
        this.lastCollectionTime = 0;

        // Modifiers
        this.modifiers = [];
        this.shielded = false;
        this.stunTurns = 0;

        // Pathfinding
        this.targetPath = [];
        this.currentTarget = null;
        this.moveDelay = 0;
    }

    /**
     * Initialize bird
     */
    init(grid) {
        this.grid = grid;

        // Get world position from grid
        const worldPos = grid.getCellCenter(this.gridX, this.gridY);
        this.x = worldPos.x;
        this.y = worldPos.y;

        // Create sprite
        this.createSprite();

        // Mark grid cell
        const cell = grid.getCell(this.gridX, this.gridY);
        if (cell) {
            cell.bird = this;
        }

        console.log(`🦜 ${this.type.name} (${this.colorName}) spawned at (${this.gridX}, ${this.gridY})`);
    }

    /**
     * Create bird sprite using real Pirots 4 assets
     */
    createSprite() {
        // Use real bird sprites from Pirots 4
        const spriteKey = `bird_${this.colorName}`;

        // Create sprite from loaded texture
        this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey);
        this.sprite.setData('bird', this);

        // Scale bird to appropriate size (birds should be ~60-80px)
        const targetSize = 80;
        const scale = targetSize / Math.max(this.sprite.width, this.sprite.height);
        this.sprite.setScale(scale);

        // Set depth so birds appear above gems
        this.sprite.setDepth(100);

        // Add name label
        this.nameText = this.scene.add.text(
            this.x,
            this.y - 50,
            this.type.name,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#FFD700',
                fontStyle: 'bold'
            }
        );
        this.nameText.setOrigin(0.5);
        this.nameText.setStroke('#000000', 3);
        this.nameText.setDepth(101);

        // Idle animation (bobbing)
        this.startIdleAnimation();
    }

    /**
     * Start idle bobbing animation
     */
    startIdleAnimation() {
        this.idleTween = this.scene.tweens.add({
            targets: this.sprite,
            y: this.y - 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Main AI - find and collect gems
     */
    findAndCollectGems() {
        if (this.state === 'stunned' || this.stunTurns > 0) {
            console.log(`⚠️  ${this.type.name} is stunned`);
            this.stunTurns--;
            return;
        }

        this.state = 'collecting';

        // Find nearest gem of matching color
        const targetGem = this.findNearestGem();

        if (targetGem) {
            this.moveToAndCollect(targetGem);
        } else {
            console.log(`${this.type.name}: No gems found`);
            this.state = 'idle';
        }
    }

    /**
     * Find nearest collectible gem
     */
    findNearestGem() {
        let nearestGem = null;
        let nearestDistance = Infinity;

        // Scan grid for gems
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.getCell(x, y);
                if (!cell || !cell.gem || cell.gem.isCollected) continue;

                // Check if this bird can collect this gem
                if (!this.canCollect(cell.gem)) continue;

                // Calculate distance
                const distance = this.getDistance(this.gridX, this.gridY, x, y);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestGem = { gem: cell.gem, x, y, distance };
                }
            }
        }

        return nearestGem;
    }

    /**
     * Check if bird can collect this gem
     */
    canCollect(gem) {
        // Purple Mystic can collect all colors
        if (this.colorName === 'purple') {
            return true;
        }

        // Purple gems are wild - all birds can collect
        if (gem.type.color === 'purple') {
            return true;
        }

        // Otherwise, must match color
        return gem.type.color === this.colorName;
    }

    /**
     * Move to gem and collect it
     */
    moveToAndCollect(targetGem) {
        const { gem, x, y } = targetGem;

        console.log(`${this.type.name} moving to gem at (${x}, ${y})`);

        // Calculate path (simple direct movement for now)
        const path = this.calculatePath(this.gridX, this.gridY, x, y);

        // Move along path
        this.followPath(path, () => {
            // Arrived at gem - collect it!
            this.collectGem(gem);

            // Look for more gems
            this.scene.time.delayedCall(200, () => {
                this.findAndCollectGems();
            });
        });
    }

    /**
     * Calculate simple path (A* pathfinding can be added later)
     */
    calculatePath(fromX, fromY, toX, toY) {
        const path = [];
        let currentX = fromX;
        let currentY = fromY;

        // Simple step-by-step path
        while (currentX !== toX || currentY !== toY) {
            if (currentX < toX) {
                currentX++;
            } else if (currentX > toX) {
                currentX--;
            } else if (currentY < toY) {
                currentY++;
            } else if (currentY > toY) {
                currentY--;
            }

            path.push({ x: currentX, y: currentY });
        }

        return path;
    }

    /**
     * Follow a path
     */
    followPath(path, onComplete) {
        if (path.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const step = path.shift();
        this.moveTo(step.x, step.y, () => {
            this.followPath(path, onComplete);
        });
    }

    /**
     * Move to grid position
     */
    moveTo(gridX, gridY, onComplete) {
        // Update grid
        const oldCell = this.grid.getCell(this.gridX, this.gridY);
        if (oldCell) {
            oldCell.bird = null;
        }

        this.gridX = gridX;
        this.gridY = gridY;

        const newCell = this.grid.getCell(gridX, gridY);
        if (newCell) {
            newCell.bird = this;
        }

        // Get world position
        const worldPos = this.grid.getCellCenter(gridX, gridY);

        // Stop idle animation
        if (this.idleTween) {
            this.idleTween.stop();
        }

        // Calculate duration based on speed and movement type
        const baseSpeed = ANIMATION_TIMINGS.BIRD_MOVE;
        const duration = baseSpeed / this.speed;

        // Animate movement
        this.state = 'moving';

        this.scene.tweens.add({
            targets: this.sprite,
            x: worldPos.x,
            y: worldPos.y,
            duration: duration,
            ease: 'Cubic.easeInOut',
            onUpdate: () => {
                // Update name text position
                if (this.nameText) {
                    this.nameText.x = this.sprite.x;
                    this.nameText.y = this.sprite.y - 35;
                }
            },
            onComplete: () => {
                this.x = worldPos.x;
                this.y = worldPos.y;
                this.state = 'idle';

                // Restart idle animation
                this.startIdleAnimation();

                if (onComplete) onComplete();
            }
        });

        // Leave trail particle
        this.leaveTrail();
    }

    /**
     * Leave sparkle trail
     */
    leaveTrail() {
        const particle = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            3,
            parseInt(this.type.colorHex.replace('#', '0x')),
            0.6
        );

        this.scene.tweens.add({
            targets: particle,
            alpha: 0,
            scale: 0,
            duration: 1000,
            onComplete: () => {
                particle.destroy();
            }
        });
    }

    /**
     * Collect a gem
     */
    collectGem(gem) {
        if (!gem || gem.isCollected) return;

        console.log(`✅ ${this.type.name} collected ${gem.type.color} gem (tier ${gem.tier})`);

        // Update counters
        this.collectedGems++;
        this.collectedThisSpin++;
        this.consecutiveCollections++;

        // Update combo
        const now = this.scene.time.now;
        if (now - this.lastCollectionTime < COMBO_CONFIG.COMBO_WINDOW) {
            this.comboStreak++;
        } else {
            this.comboStreak = 1;
        }
        this.lastCollectionTime = now;

        // Collect animation
        gem.collect(this.sprite.x, this.sprite.y);

        // Update collection meter
        if (this.scene.collectionMeters) {
            this.scene.collectionMeters[this.colorName] += gem.getPayoutValue();
        }

        // Check for combo bonuses
        this.checkComboBonus();

        // Play collect sound (placeholder)
        // this.scene.audioManager.playCollectSound(this, this.collectedThisSpin);

        // Particle effect
        this.createCollectEffect();
    }

    /**
     * Check and apply combo bonuses
     */
    checkComboBonus() {
        if (this.comboStreak >= 3) {
            console.log(`🔥 ${this.type.name} COMBO: ${this.comboStreak}!`);

            // Show combo text
            this.showComboText(this.comboStreak);

            // Apply multiplier based on combo
            let multiplier = 1.0;
            if (this.comboStreak >= 10) {
                multiplier = COMBO_CONFIG.COMBO_10_MULTIPLIER;
            } else if (this.comboStreak >= 7) {
                multiplier = COMBO_CONFIG.COMBO_7_MULTIPLIER;
            } else if (this.comboStreak >= 5) {
                multiplier = COMBO_CONFIG.COMBO_5_MULTIPLIER;
            } else if (this.comboStreak >= 3) {
                multiplier = COMBO_CONFIG.COMBO_3_MULTIPLIER;
            }

            // Play combo sound based on streak
            // this.scene.audioManager.play(`combo_${Math.min(this.comboStreak, 10)}`);
        }
    }

    /**
     * Show combo text popup
     */
    showComboText(combo) {
        const comboText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 50,
            `${combo}x COMBO!`,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: COLORS.GOLD_ACCENT,
                fontStyle: 'bold'
            }
        );
        comboText.setOrigin(0.5);
        comboText.setStroke('#000000', 4);
        comboText.setDepth(200);

        // Animate popup
        this.scene.tweens.add({
            targets: comboText,
            y: comboText.y - 30,
            alpha: 0,
            scale: 1.5,
            duration: ANIMATION_TIMINGS.COMBO_POPUP,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                comboText.destroy();
            }
        });
    }

    /**
     * Create collection particle effect
     */
    createCollectEffect() {
        // Simple particle burst
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const distance = 30;

            const particle = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                3,
                parseInt(this.type.colorHex.replace('#', '0x'))
            );

            this.scene.tweens.add({
                targets: particle,
                x: this.sprite.x + Math.cos(angle) * distance,
                y: this.sprite.y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 400,
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    /**
     * Get distance between two grid positions
     */
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1); // Manhattan distance
    }

    /**
     * Activate special ability
     */
    activateSpecialAbility() {
        console.log(`⚡ ${this.type.name} activates ${this.type.specialAbility}!`);

        switch (this.type.specialAbility) {
            case 'speed':
                this.speed *= 1.5;
                this.scene.time.delayedCall(5000, () => {
                    this.speed = this.type.speedMultiplier;
                });
                break;

            case 'teleport':
                // Implement teleport logic
                break;

            case 'bombs':
                // Implement bomb activation
                break;

            case 'reveal':
                // Implement reveal logic
                break;

            case 'wild':
                // Already handled in canCollect
                break;

            case 'chaos':
                // Implement chaotic collection
                break;
        }
    }

    /**
     * Transform to legendary form
     */
    transformLegendary() {
        if (this.isLegendary) return;

        console.log(`✨ ${this.type.name} transforms to LEGENDARY FORM!`);

        this.isLegendary = true;
        this.speed *= 2;

        // Visual transformation
        this.sprite.setTint(0xFFD700); // Golden tint

        // Add aura
        const aura = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            40,
            0xFFD700,
            0.3
        );
        aura.setDepth(99);

        this.scene.tweens.add({
            targets: aura,
            scale: 1.2,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.aura = aura;
    }

    /**
     * Reset for new spin
     */
    reset() {
        this.collectedThisSpin = 0;
        this.consecutiveCollections = 0;
        this.comboStreak = 0;
        this.state = 'idle';
        this.stunTurns = 0;
    }

    /**
     * Update (called every frame)
     */
    update(time, delta) {
        // Update aura position if legendary
        if (this.aura) {
            this.aura.x = this.sprite.x;
            this.aura.y = this.sprite.y;
        }
    }

    /**
     * Destroy bird
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }

        if (this.nameText) {
            this.nameText.destroy();
        }

        if (this.aura) {
            this.aura.destroy();
        }

        if (this.idleTween) {
            this.idleTween.stop();
        }
    }

    /**
     * Get bird info
     */
    getInfo() {
        return {
            name: this.type.name,
            color: this.colorName,
            position: { gridX: this.gridX, gridY: this.gridY },
            state: this.state,
            collected: this.collectedGems,
            collectedThisSpin: this.collectedThisSpin,
            combo: this.comboStreak,
            legendary: this.isLegendary
        };
    }
}
