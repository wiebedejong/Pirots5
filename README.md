# 🦜 PIROTS 5 - The Ultimate Treasure Hunt 💎

An enhanced slot game with the innovative CollectR™ mechanic, featuring 6 colorful birds collecting gems on a dynamic 6×6 to 8×8 grid.

## 🎮 Features

- **Dynamic Grid System**: Expandable 6×6 to 8×8 grid
- **6 Unique Birds**: Red, Blue, Green, Yellow, Purple (Mystic), Orange (Berserker)
- **300+ Unique Sounds**: Spatial audio with adaptive soundtrack
- **Weather System**: 6 dynamic weather types affecting gameplay
- **Teleportation Network**: 4 types of portals and tunnels
- **Combo & Streak Systems**: Rewarding consistent play
- **15,000x Max Win**: Massive win potential
- **96% RTP**: Player-friendly return to player

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Visit `http://localhost:8080` in your browser.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
pirots5/
├── src/
│   ├── core/           # Game engine core
│   ├── entities/       # Game entities (Birds, Gems, Grid)
│   ├── features/       # Game features (Black Hole, Portals, Weather)
│   ├── mechanics/      # Core mechanics (CollectR, Cascade, Combo)
│   ├── audio/          # Audio system
│   ├── ui/             # User interface
│   ├── utils/          # Utilities
│   └── states/         # Game states
├── assets/
│   ├── sprites/        # Sprite images
│   ├── sounds/         # Sound effects
│   ├── music/          # Music tracks
│   └── fonts/          # Fonts
├── config/             # Configuration files
└── tests/              # Unit and integration tests
```

## 🎯 Tech Stack

- **Engine**: Phaser 3.60+
- **Language**: JavaScript ES6+
- **Audio**: Web Audio API + Howler.js
- **Animation**: GSAP (GreenSock)
- **Build Tool**: Webpack 5
- **Testing**: Jest

## 📊 Game Stats

- **RTP**: 96.00%
- **Volatility**: High (9/10)
- **Hit Frequency**: 32%
- **Max Win**: 15,000x
- **Min Bet**: €0.20
- **Max Bet**: €200

## 🎨 Key Mechanics

### CollectR™ System
Birds actively move across the grid collecting gems of their color, with enhanced movement patterns:
- Standard movement (1 tile/step)
- Sprint mode (2 tiles/step at 3+ gems)
- Dash mode (zigzag at 5+ gems)
- Orbit movement (around obstacles)

### Grid Expansion
- Starts at 6×6 (36 positions)
- Expands via Corner Bombs and Mega Bombs
- Maximum size: 8×8 (64 positions)

### Feature Symbols
- Upgrade symbols (↑)
- Transform symbols (🔄)
- Wild symbols (⭐)
- Bonus symbols (💎)
- Multiplier gems (×2, ×3, ×5)
- Time Freeze (⏸️)
- Magnet (🧲)

## 🎵 Audio System

- 300+ unique sound effects
- 6-layer adaptive soundtrack
- Spatial audio with stereo panning
- Dynamic music intensity based on gameplay

## 🎁 Bonus Features

- **Regular Bonus**: 10 free drops
- **Super Bonus**: 15 free drops with max grid
- **Lost in Space**: Hold & Win coin game
- **Mega Jackpot**: Ultra-rare pick-and-click game
- **X-iter™**: 7 feature buy options

## 📱 Platform Support

- Desktop (Chrome, Firefox, Safari, Edge)
- Mobile (iOS, Android)
- Tablet (iPad, Android tablets)
- Portrait & Landscape modes

## 🎓 Development Phases

- [x] Phase 1: Core Development (In Progress)
- [ ] Phase 2: Feature Implementation
- [ ] Phase 3: Audio Production
- [ ] Phase 4: Visual Polish
- [ ] Phase 5: Advanced Features
- [ ] Phase 6: Testing & Balance
- [ ] Phase 7: Launch Prep

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a proprietary project. For questions, contact the development team.

---

**Made with ❤️ by the Pirots Team**
