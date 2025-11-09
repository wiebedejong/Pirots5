/**
 * PIROTS 5 - Gem Class
 * Represents a collectable gem on the grid
 */

import Phaser from 'phaser';
import { ANIMATION_TIMINGS, GEM_PAYOUTS } from '../core/constants.js';

export default class Gem {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type; // From GEM_TYPES
        this.tier = 1;    // Start at tier 1

        // Visual elements
        this.sprite = null;
        this.glowEffect = null;
        this.shimmerTween = null;

        // State
        this.isCollected = false;
        this.isExploding = false;
        this.isUpgrading = false;
    }

    /**
     * Spawn the gem with animation
     */
    spawn() {
        // Create sprite (for now, a colored circle)
        this.createSprite();

        // Spawn animation
        this.sprite.setScale(0);
        this.sprite.setAlpha(0);

        this.scene.tweens.add({
            targets: this.sprite,
            scale: 1,
            alpha: 1,
            duration: ANIMATION_TIMINGS.GEM_SPAWN * 2,
            ease: 'Back.easeOut'
        });

        // Start idle shimmer
        this.startShimmer();
    }

    /**
     * Create the gem sprite using real Pirots 4 assets
     */
    createSprite() {
        // Use real gem sprites from Pirots 4
        // Tier 1-7 use Low symbols, tier 8-9 use High symbols
        let spriteKey;

        if (this.tier <= 7) {
            // Use Low symbols (1-7)
            spriteKey = `gem_${this.type.color}_${this.tier}`;
        } else if (this.tier === 8) {
            // Tier 8 - use first high symbol
            spriteKey = 'gem_high_1';
        } else {
            // Tier 9 - use second high symbol
            spriteKey = 'gem_high_2';
        }

        // Create sprite from loaded texture
        this.sprite = this.scene.add.sprite(this.x, this.y, spriteKey);
        this.sprite.setData('gem', this);

        // Scale to fit grid cell (gems are ~80x80 in grid)
        const targetSize = 70;
        const scale = targetSize / Math.max(this.sprite.width, this.sprite.height);
        this.sprite.setScale(scale);

        // Set depth so gems appear above grid but below birds
        this.sprite.setDepth(10);

        // Add tier indicator for higher tiers
        if (this.tier >= 5) {
            const tierText = this.scene.add.text(
                this.x,
                this.y + 25,
                `${this.tier}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: '#FFD700',
                    fontStyle: 'bold'
                }
            );
            tierText.setOrigin(0.5);
            tierText.setStroke('#000000', 3);
            tierText.setDepth(11);

            this.tierText = tierText;
        }
    }

    /**
     * Start idle shimmer animation
     */
    startShimmer() {
        this.shimmerTween = this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.7,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Collect animation
     */
    collect(targetX, targetY) {
        if (this.isCollected) return;

        this.isCollected = true;

        // Stop shimmer
        if (this.shimmerTween) {
            this.shimmerTween.stop();
        }

        // Fly to target (bird position)
        this.scene.tweens.add({
            targets: this.sprite,
            x: targetX,
            y: targetY,
            scale: 0.5,
            alpha: 0,
            duration: ANIMATION_TIMINGS.GEM_COLLECT,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.destroy();
            }
        });

        // Also animate tier text if exists
        if (this.tierText) {
            this.scene.tweens.add({
                targets: this.tierText,
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: ANIMATION_TIMINGS.GEM_COLLECT,
                ease: 'Cubic.easeIn',
                onComplete: () => {
                    this.tierText.destroy();
                }
            });
        }

        // Play collect sound (placeholder)
        // this.scene.audioManager.playCollectSound(this.type.color, this.tier);
    }

    /**
     * Upgrade to next tier
     */
    upgrade() {
        if (this.isUpgrading) return;
        if (this.tier >= this.type.maxTier) return;

        this.isUpgrading = true;
        const oldTier = this.tier;
        this.tier++;

        console.log(`⬆️  Gem upgraded from tier ${oldTier} to ${this.tier}`);

        // Store current scale
        const currentScale = this.sprite.scaleX;

        // Flash effect
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: currentScale * 1.3,
            scaleY: currentScale * 1.3,
            duration: ANIMATION_TIMINGS.GEM_UPGRADE / 2,
            yoyo: true,
            onComplete: () => {
                // Store position
                const posX = this.x;
                const posY = this.y;

                // Destroy old sprite
                if (this.sprite) {
                    this.sprite.destroy();
                }
                if (this.tierText) {
                    this.tierText.destroy();
                    this.tierText = null;
                }

                // Recreate sprite with new tier
                this.createSprite();
                this.isUpgrading = false;

                // Restart shimmer
                this.startShimmer();
            }
        });

        // Play upgrade sound (placeholder)
        // this.scene.audioManager.play('gem_upgrade');
    }

    /**
     * Explode animation
     */
    explode() {
        if (this.isExploding) return;

        this.isExploding = true;

        console.log(`💥 Gem exploding!`);

        // Stop shimmer
        if (this.shimmerTween) {
            this.shimmerTween.stop();
        }

        // Explosion animation
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 2,
            alpha: 0,
            duration: ANIMATION_TIMINGS.GEM_EXPLODE,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.destroy();
            }
        });

        // Particle burst (simple version)
        this.createParticleBurst();

        // Play explode sound (placeholder)
        // this.scene.audioManager.play('gem_explode_' + (this.tier > 5 ? 'large' : 'small'));
    }

    /**
     * Create particle burst effect
     */
    createParticleBurst() {
        const particleCount = 8;
        const angleStep = (Math.PI * 2) / particleCount;

        for (let i = 0; i < particleCount; i++) {
            const angle = angleStep * i;
            const speed = 100;

            // Create particle
            const particle = this.scene.add.circle(
                this.x,
                this.y,
                4,
                parseInt(this.type.colorHex.replace('#', '0x'))
            );

            // Animate outward
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * speed,
                y: this.y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    /**
     * Transform to another color
     */
    transform(newType) {
        console.log(`🔄 Gem transforming from ${this.type.color} to ${newType.color}`);

        // Morph animation
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 0,
            angle: 360,
            duration: ANIMATION_TIMINGS.GEM_TRANSFORM / 2,
            onComplete: () => {
                this.type = newType;
                this.destroy();
                this.createSprite();
                this.sprite.setScale(0);

                this.scene.tweens.add({
                    targets: this.sprite,
                    scale: 1,
                    angle: 0,
                    duration: ANIMATION_TIMINGS.GEM_TRANSFORM / 2
                });

                this.startShimmer();
            }
        });
    }

    /**
     * Get payout value for this gem
     */
    getPayoutValue() {
        return GEM_PAYOUTS[this.tier] || 1;
    }

    /**
     * Update (called every frame)
     */
    update(time, delta) {
        // Can add floating animation or other effects here
    }

    /**
     * Destroy the gem
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }

        if (this.tierText) {
            this.tierText.destroy();
        }

        if (this.shimmerTween) {
            this.shimmerTween.stop();
        }

        if (this.glowEffect) {
            this.glowEffect.destroy();
        }
    }

    /**
     * Get gem info
     */
    getInfo() {
        return {
            type: this.type.color,
            tier: this.tier,
            value: this.getPayoutValue(),
            position: { x: this.x, y: this.y }
        };
    }
}
