/**
 * PIROTS 5 - Grid Class
 * Manages the game grid that expands from 6×6 to 8×8
 */

import Phaser from 'phaser';
import { GRID_CONFIG, COLORS, GEM_TYPES, FEATURE_SYMBOLS, ANIMATION_TIMINGS } from '../core/constants.js';
import Gem from './Gem.js';

export default class Grid {
    constructor(scene) {
        this.scene = scene;

        // Grid dimensions
        this.width = GRID_CONFIG.START_WIDTH;
        this.height = GRID_CONFIG.START_HEIGHT;
        this.maxWidth = GRID_CONFIG.MAX_WIDTH;
        this.maxHeight = GRID_CONFIG.MAX_HEIGHT;

        // Grid cells (2D array)
        this.cells = [];

        // Visual elements
        this.gridGraphics = null;
        this.cellSize = GRID_CONFIG.CELL_SIZE;
        this.cellSpacing = GRID_CONFIG.CELL_SPACING;

        // Offset for centering
        this.offsetX = GRID_CONFIG.GRID_OFFSET_X;
        this.offsetY = GRID_CONFIG.GRID_OFFSET_Y;

        // State
        this.isExpanding = false;
        this.expansionCount = { top: 0, bottom: 0, left: 0, right: 0 };
    }

    /**
     * Initialize the grid
     */
    init() {
        console.log(`🎯 Initializing grid (${this.width}×${this.height})...`);

        // Create cell array
        this.createCells();

        // Draw grid
        this.draw();

        console.log('✅ Grid initialized');
    }

    /**
     * Create the 2D cell array
     */
    createCells() {
        this.cells = [];

        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = {
                    x: x,
                    y: y,
                    gem: null,        // Gem object
                    bird: null,       // Bird object (if present)
                    feature: null,    // Feature symbol
                    isEmpty: true,
                    worldX: this.getWorldX(x),
                    worldY: this.getWorldY(y)
                };
            }
        }

        console.log(`📊 Created ${this.width * this.height} cells`);
    }

    /**
     * Draw the grid visually
     */
    draw() {
        // Clear previous graphics
        if (this.gridGraphics) {
            this.gridGraphics.destroy();
        }

        this.gridGraphics = this.scene.add.graphics();

        // Draw grid background
        this.gridGraphics.fillStyle(0x1a1a2e, 0.5);
        this.gridGraphics.fillRoundedRect(
            this.offsetX - 10,
            this.offsetY - 10,
            this.width * (this.cellSize + this.cellSpacing) + 10,
            this.height * (this.cellSize + this.cellSpacing) + 10,
            8
        );

        // Draw cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.drawCell(x, y);
            }
        }

        console.log('🎨 Grid drawn');
    }

    /**
     * Draw a single cell
     */
    drawCell(x, y) {
        const worldX = this.getWorldX(x);
        const worldY = this.getWorldY(y);

        // Cell background
        this.gridGraphics.fillStyle(0x2d2d44, 0.8);
        this.gridGraphics.fillRoundedRect(
            worldX,
            worldY,
            this.cellSize,
            this.cellSize,
            4
        );

        // Cell border
        this.gridGraphics.lineStyle(2, 0x5D3FD3, 0.5);
        this.gridGraphics.strokeRoundedRect(
            worldX,
            worldY,
            this.cellSize,
            this.cellSize,
            4
        );
    }

    /**
     * Get world X coordinate from grid X
     */
    getWorldX(gridX) {
        return this.offsetX + gridX * (this.cellSize + this.cellSpacing);
    }

    /**
     * Get world Y coordinate from grid Y
     */
    getWorldY(gridY) {
        return this.offsetY + gridY * (this.cellSize + this.cellSpacing);
    }

    /**
     * Get cell center world coordinates
     */
    getCellCenter(gridX, gridY) {
        return {
            x: this.getWorldX(gridX) + this.cellSize / 2,
            y: this.getWorldY(gridY) + this.cellSize / 2
        };
    }

    /**
     * Populate grid with gems
     */
    populate() {
        console.log('💎 Populating grid with gems...');

        // Clear existing gems
        this.clearGems();

        // Spawn gems with cascade effect
        for (let y = 0; y < this.height; y++) {
            this.scene.time.delayedCall(y * ANIMATION_TIMINGS.GEM_SPAWN, () => {
                for (let x = 0; x < this.width; x++) {
                    this.spawnGem(x, y);
                }
            });
        }
    }

    /**
     * Spawn a gem at grid position
     */
    spawnGem(gridX, gridY) {
        const cell = this.cells[gridY][gridX];

        // Random gem type
        const gemTypes = Object.values(GEM_TYPES);
        const randomType = Phaser.Math.RND.pick(gemTypes);

        // Create gem
        const center = this.getCellCenter(gridX, gridY);
        const gem = new Gem(this.scene, center.x, center.y, randomType);

        // Store in cell
        cell.gem = gem;
        cell.isEmpty = false;

        // Add to scene
        gem.spawn();
    }

    /**
     * Clear all gems from grid
     */
    clearGems() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                if (cell.gem) {
                    cell.gem.destroy();
                    cell.gem = null;
                    cell.isEmpty = true;
                }
            }
        }
    }

    /**
     * Expand grid in a direction
     * @param {string} direction - 'top', 'bottom', 'left', 'right'
     */
    expand(direction) {
        if (this.isExpanding) {
            console.log('⚠️  Grid already expanding');
            return false;
        }

        // Check if can expand
        if (direction === 'top' || direction === 'bottom') {
            if (this.height >= this.maxHeight) {
                console.log('⚠️  Grid at max height');
                return false;
            }
        } else {
            if (this.width >= this.maxWidth) {
                console.log('⚠️  Grid at max width');
                return false;
            }
        }

        this.isExpanding = true;
        console.log(`📈 Expanding grid: ${direction}`);

        // Expand based on direction
        switch (direction) {
            case 'top':
                this.expandTop();
                break;
            case 'bottom':
                this.expandBottom();
                break;
            case 'left':
                this.expandLeft();
                break;
            case 'right':
                this.expandRight();
                break;
        }

        this.expansionCount[direction]++;

        // Animate expansion
        this.scene.time.delayedCall(ANIMATION_TIMINGS.GRID_EXPAND, () => {
            this.isExpanding = false;
            console.log(`✅ Grid expanded to ${this.width}×${this.height}`);
        });

        return true;
    }

    /**
     * Expand grid at top
     */
    expandTop() {
        this.height++;

        // Add new row at top
        const newRow = [];
        for (let x = 0; x < this.width; x++) {
            newRow.push({
                x: x,
                y: 0,
                gem: null,
                bird: null,
                feature: null,
                isEmpty: true,
                worldX: this.getWorldX(x),
                worldY: this.getWorldY(0)
            });
        }

        // Shift existing rows down
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.cells[y][x].y++;
            }
        }

        this.cells.unshift(newRow);

        // Adjust offset to keep grid centered
        this.offsetY -= (this.cellSize + this.cellSpacing) / 2;

        this.draw();
    }

    /**
     * Expand grid at bottom
     */
    expandBottom() {
        this.height++;

        // Add new row at bottom
        const newRow = [];
        const newY = this.height - 1;

        for (let x = 0; x < this.width; x++) {
            newRow.push({
                x: x,
                y: newY,
                gem: null,
                bird: null,
                feature: null,
                isEmpty: true,
                worldX: this.getWorldX(x),
                worldY: this.getWorldY(newY)
            });
        }

        this.cells.push(newRow);

        // Adjust offset
        this.offsetY -= (this.cellSize + this.cellSpacing) / 2;

        this.draw();
    }

    /**
     * Expand grid at left
     */
    expandLeft() {
        this.width++;

        // Add new column at left
        for (let y = 0; y < this.height; y++) {
            // Shift x values
            for (let x = 0; x < this.cells[y].length; x++) {
                this.cells[y][x].x++;
            }

            // Add new cell
            this.cells[y].unshift({
                x: 0,
                y: y,
                gem: null,
                bird: null,
                feature: null,
                isEmpty: true,
                worldX: this.getWorldX(0),
                worldY: this.getWorldY(y)
            });
        }

        // Adjust offset
        this.offsetX -= (this.cellSize + this.cellSpacing) / 2;

        this.draw();
    }

    /**
     * Expand grid at right
     */
    expandRight() {
        this.width++;

        // Add new column at right
        const newX = this.width - 1;

        for (let y = 0; y < this.height; y++) {
            this.cells[y].push({
                x: newX,
                y: y,
                gem: null,
                bird: null,
                feature: null,
                isEmpty: true,
                worldX: this.getWorldX(newX),
                worldY: this.getWorldY(y)
            });
        }

        // Adjust offset
        this.offsetX -= (this.cellSize + this.cellSpacing) / 2;

        this.draw();
    }

    /**
     * Expand grid from corner bomb (expands 2 directions)
     */
    expandFromCorner(corner) {
        console.log(`💣 Corner bomb at: ${corner}`);

        switch (corner) {
            case 'top-left':
                this.expand('top');
                this.scene.time.delayedCall(ANIMATION_TIMINGS.GRID_EXPAND / 2, () => {
                    this.expand('left');
                });
                break;
            case 'top-right':
                this.expand('top');
                this.scene.time.delayedCall(ANIMATION_TIMINGS.GRID_EXPAND / 2, () => {
                    this.expand('right');
                });
                break;
            case 'bottom-left':
                this.expand('bottom');
                this.scene.time.delayedCall(ANIMATION_TIMINGS.GRID_EXPAND / 2, () => {
                    this.expand('left');
                });
                break;
            case 'bottom-right':
                this.expand('bottom');
                this.scene.time.delayedCall(ANIMATION_TIMINGS.GRID_EXPAND / 2, () => {
                    this.expand('right');
                });
                break;
        }
    }

    /**
     * Mega bomb - expand all 4 directions
     */
    expandMega() {
        console.log('💥 MEGA BOMB - Expanding all directions!');

        const delays = [0, 150, 300, 450];

        ['top', 'right', 'bottom', 'left'].forEach((direction, index) => {
            this.scene.time.delayedCall(delays[index], () => {
                this.expand(direction);
            });
        });
    }

    /**
     * Get cell at grid position
     */
    getCell(gridX, gridY) {
        if (gridY < 0 || gridY >= this.height || gridX < 0 || gridX >= this.width) {
            return null;
        }
        return this.cells[gridY][gridX];
    }

    /**
     * Get adjacent cells (4 directions)
     */
    getAdjacentCells(gridX, gridY) {
        const adjacent = [];
        const directions = [
            { x: 0, y: -1 },  // up
            { x: 1, y: 0 },   // right
            { x: 0, y: 1 },   // down
            { x: -1, y: 0 }   // left
        ];

        directions.forEach(dir => {
            const cell = this.getCell(gridX + dir.x, gridY + dir.y);
            if (cell) {
                adjacent.push(cell);
            }
        });

        return adjacent;
    }

    /**
     * Find clusters of same-colored gems
     */
    findClusters() {
        const clusters = [];
        const visited = new Set();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const key = `${x},${y}`;
                if (visited.has(key)) continue;

                const cell = this.cells[y][x];
                if (!cell.gem) continue;

                // Find cluster starting from this gem
                const cluster = this.findClusterFrom(x, y, cell.gem.type.color, visited);

                if (cluster.length >= 2) {
                    clusters.push({
                        color: cell.gem.type.color,
                        cells: cluster,
                        count: cluster.length
                    });
                }
            }
        }

        return clusters;
    }

    /**
     * Find cluster starting from a position (flood fill)
     */
    findClusterFrom(startX, startY, color, visited) {
        const cluster = [];
        const stack = [{ x: startX, y: startY }];

        while (stack.length > 0) {
            const { x, y } = stack.pop();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;

            const cell = this.getCell(x, y);
            if (!cell || !cell.gem || cell.gem.type.color !== color) continue;

            visited.add(key);
            cluster.push({ x, y, cell });

            // Add adjacent cells to stack
            const adjacent = this.getAdjacentCells(x, y);
            adjacent.forEach(adjCell => {
                if (adjCell.gem && adjCell.gem.type.color === color) {
                    stack.push({ x: adjCell.x, y: adjCell.y });
                }
            });
        }

        return cluster;
    }

    /**
     * Update grid (called every frame)
     */
    update(time, delta) {
        // Update all gems
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                if (cell.gem) {
                    cell.gem.update(time, delta);
                }
            }
        }
    }

    /**
     * Get grid info
     */
    getInfo() {
        return {
            width: this.width,
            height: this.height,
            totalCells: this.width * this.height,
            maxWidth: this.maxWidth,
            maxHeight: this.maxHeight,
            expansionCount: this.expansionCount
        };
    }
}
