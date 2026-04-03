# Plinko Game

A fully functional, locally-hosted Plinko game with realistic physics, sound effects, and multi-ball mechanics.

## Features

- **Realistic Physics**: Powered by Matter.js for authentic ball physics and collisions
- **Multiple Object Types**: Choose between Ball, Horse, and Beach Ball
- **Sound Effects**: Unique sound for each slot using Web Audio API
- **Multi-Ball Mechanic**: Slot 4 spawns 3 additional objects when hit
- **Score Tracking**: Track your total score and active objects
- **Unlimited Drops**: No cap on the number of objects
- **Responsive UI**: Clean, modern interface with visual feedback

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Physics**: Matter.js 2D physics engine
- **Sound**: Web Audio API

## Prerequisites

- Python 3.9+ (tested with Python 3.14)
- Modern web browser with JavaScript enabled

## Setup Instructions

### 1. Install Dependencies

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Start the FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

# Or use the reload flag for development
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Open in Browser

Navigate to: **http://127.0.0.1:8000**

The game should load immediately with the Plinko board visible.

## How to Play

1. **Select an Object Type**: Choose Ball, Horse, or Beach Ball from the buttons
2. **Drop Objects**: Click the "DROP OBJECT" button (or press SPACEBAR)
3. **Watch the Physics**: Objects fall through pegs and land in slots
4. **Multi-Ball Bonus**: Landing in Slot 4 (center) spawns 3 additional objects
5. **Track Your Score**: Each slot awards points based on its value

### Slot Values

- **Slot 0** (Low): 1 point
- **Slot 1-3** (Medium): 2-10 points
- **Slot 4** (MULTI-BALL): 20 points + spawns 3 objects
- **Slot 5-7** (Medium): 10-2 points
- **Slot 8** (High): 50 points

## Project Structure

```
igniteDemo/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration constants
│   └── models.py            # Slot outcome data models
├── frontend/
│   ├── index.html           # Main HTML page
│   ├── css/
│   │   └── styles.css       # Styling
│   ├── js/
│   │   ├── game.js          # Main game controller
│   │   ├── physics.js       # Matter.js physics engine
│   │   ├── renderer.js      # Canvas rendering
│   │   ├── sounds.js        # Web Audio API sound manager
│   │   └── objects.js       # Object type definitions
│   └── assets/
│       ├── sounds/          # Sound effect files (generated programmatically)
│       └── images/          # Object sprites (using emojis)
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Design Decisions

### Why FastAPI?
- Modern async support for potential future features (WebSocket multiplayer)
- Automatic API documentation at `/docs`
- Fast and lightweight for serving static files

### Why Matter.js?
- Battle-tested 2D physics engine
- Realistic collision detection and response
- ~100KB - acceptable for local use
- Active maintenance and good documentation

### Why Canvas over SVG/WebGL?
- **Canvas**: Best for dynamic, high-frequency rendering (60 FPS)
- **SVG**: Better for static/low-update visuals
- **WebGL**: Overkill for 2D physics, adds unnecessary complexity

### Why Web Audio API?
- Zero-latency playback (critical for game feel)
- Supports simultaneous sounds
- Programmatic sound generation (no audio files needed)
- Better control over volume and playback

### Multi-Ball Spawn Strategy
- Spawns at top with horizontal offset to prevent identical paths
- Small random velocity adds variety
- Fixed count of 3 keeps gameplay predictable

## Performance Characteristics

- **Target FPS**: 60 FPS
- **Tested with**: 20+ simultaneous objects without lag
- **Memory**: Automatic object cleanup prevents memory leaks
- **Sound**: Zero-latency playback using Web Audio API

## Customization

### Adding New Object Types

Edit [`frontend/js/objects.js`](frontend/js/objects.js):

```javascript
OBJECT_TYPES.newObject = {
    name: 'New Object',
    type: 'circle',
    radius: 12,
    mass: 1,
    restitution: 0.6,
    friction: 0.1,
    emoji: '🎯'  // Or use color: '#FF0000' for solid color
};
```

### Changing Slot Behaviors

Edit [`backend/models.py`](backend/models.py) to modify slot values, names, or multi-ball behavior.

### Adjusting Physics

Edit [`backend/config.py`](backend/config.py) to change:
- Number of slots (`SLOT_COUNT`)
- Number of peg rows (`PEG_ROWS`)
- Multi-ball spawn count (`MULTI_BALL_SPAWN_COUNT`)

## API Endpoints

- `GET /` - Serves the game HTML
- `GET /api/slots` - Returns slot configuration data
- `GET /api/health` - Health check endpoint
- `GET /docs` - Auto-generated API documentation (FastAPI)

## Future Improvements

### Performance
- Object pooling (reuse objects instead of create/destroy)
- Quadtree spatial partitioning for collision detection
- WebWorker for physics calculations (off main thread)
- Canvas layers (static pegs, dynamic objects)

### Features
- Score persistence (localStorage or database)
- Multiplayer mode (WebSocket for synchronized drops)
- Leaderboard (global or session-based)
- Power-ups (heavy objects, anti-gravity zones)
- Customizable boards (user-defined peg layouts)
- Achievements/unlockables
- Visual themes (dark mode, neon, retro)

### Production Readiness
- Docker containerization
- Environment-based configuration
- Logging and monitoring
- Error tracking (Sentry)
- Unit tests (pytest for backend)
- E2E tests (Playwright for frontend)

## Troubleshooting

### Port 8000 Already in Use
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python -m uvicorn backend.main:app --port 8001
```

### Virtual Environment Issues
```bash
# Remove and recreate
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Browser Compatibility
- Requires modern browser with:
  - ES6 JavaScript support
  - HTML5 Canvas API
  - Web Audio API
  - Tested on: Chrome 90+, Firefox 88+, Safari 14+

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

- Physics Engine: [Matter.js](https://brm.io/matter-js/)
- Framework: [FastAPI](https://fastapi.tiangolo.com/)
- Icons: Emoji (Unicode)
