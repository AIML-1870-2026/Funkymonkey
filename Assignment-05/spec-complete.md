# Boid Mini Lab - Complete Specification
## Advanced Flocking Simulation with Interactive Features

---

## Overview
An interactive web-based boid simulation that demonstrates flocking behavior with real-time parameter adjustment, obstacle avoidance, leader/predator dynamics, and configurable perception systems. This is a comprehensive implementation of Craig Reynolds' boids algorithm with modern enhancements.

---

## Core Features

### 1. Boid Flocking Algorithm
Implementation of Craig Reynolds' three fundamental flocking behaviors:

- **Separation**: Boids steer to avoid crowding neighbors
- **Alignment**: Boids steer towards the average heading of neighbors
- **Cohesion**: Boids steer towards the average position of neighbors

### 2. Visual Rendering
- Boids rendered as triangular shapes pointing in their direction of travel
- Color-coded with HSL values (blue spectrum for normal boids)
- Special colors: Green for leader, Red for predator
- Motion trails effect using semi-transparent canvas clearing
- Dark background (#0a0e27) for contrast

---

## Interactive Controls

### Basic Simulation Controls
- **Number of Boids**: Adjustable from 10 to 300 (default: 100)
- **Pause/Resume Button**: Toggle simulation animation
- **Reset Button**: Resets all parameters to default "Flocking" preset

### Flocking Behavior Parameters
- **Separation** (0-3, default: 1.5): Strength of avoidance behavior
- **Alignment** (0-3, default: 1.0): Strength of velocity matching
- **Cohesion** (0-3, default: 1.0): Strength of group centering

### Movement Parameters
- **Max Speed** (1-10, default: 4): Maximum velocity of boids
- **Max Force** (0.05-0.5, default: 0.2): Maximum steering force applied

### Perception Parameters
- **Vision Radius** (20-150, default: 50): Distance at which boids detect neighbors
- **Separation Radius** (10-80, default: 25): Personal space distance for separation

---

## Advanced Features

### 1. Perception Cone System 👁️
Toggle between omnidirectional and forward field-of-view sensing:

- **Checkbox Toggle**: Enable/disable perception cone
- **FOV Angle Slider** (60-270°, default: 120°): Adjustable field of view
- **Visual Feedback**: Semi-transparent cone displayed when enabled
- **Behavior Impact**:
  - When enabled: Boids only perceive neighbors within forward cone
  - When disabled: Boids perceive neighbors in all directions (360°)
  - Affects alignment, cohesion, and separation calculations

**Use Case**: Compare realistic forward-only vision (like birds) vs omnidirectional sensing

### 2. Obstacle Avoidance System 🚧
Interactive circular obstacles with dynamic placement:

- **Placement**: Click anywhere on canvas to add obstacle
- **Removal**: Click on existing obstacle to remove it
- **Obstacle Size Slider** (10-60, default: 30): Set radius before placement
- **Avoidance Behavior**:
  - Boids detect obstacles within vision radius + obstacle radius
  - Strong steering force (3x multiplier) to avoid collisions
  - Uses inverse-square repulsion for smooth avoidance
- **Visual Rendering**: Semi-transparent red circles with visible borders
- **Clear All Button**: Remove all obstacles at once

**Use Case**: Test pathfinding and navigation around static obstacles

### 3. Leader/Predator System 🎯🦖
Special boids with unique behaviors:

#### Leader Mode (Green Boid)
- **Activation**: Shift + Click near any boid
- **Behavior**:
  - Other boids attracted to leader within 2x vision radius
  - 1.5x force multiplier for following behavior
  - Leader ignores flocking rules (free movement)
- **Visual**: Larger size (12px vs 8px), bright green (#22ff22)

#### Predator Mode (Red Boid)
- **Activation**: Ctrl + Click (or Cmd + Click on Mac) near any boid
- **Behavior**:
  - Boids flee from predator within 2.5x vision radius
  - 2.5x force multiplier for flee response
  - Predator ignores flocking rules (free movement)
- **Visual**: Larger size (12px vs 8px), bright red (#ff2222)

**Notes**:
- Only one leader and one predator at a time
- Cannot be both leader and predator simultaneously
- Clear button resets both special boids

**Use Case**: Demonstrate emergent group behaviors like following and evasion

---

## Preset Configurations

Four pre-configured behavior patterns accessible via buttons:

### 🐟 Schooling
- Separation: 2.5 (high)
- Alignment: 1.5 (moderate)
- Cohesion: 1.0 (standard)
- Max Speed: 3.5 (lower)
- **Effect**: Tighter formations like fish schools

### 🦅 Flocking (Default)
- Separation: 1.5
- Alignment: 1.0
- Cohesion: 1.0
- Max Speed: 4.0
- **Effect**: Classic bird-like balanced behavior

### 🐝 Swarming
- Separation: 1.0 (lower)
- Alignment: 0.5 (reduced)
- Cohesion: 2.0 (high)
- Max Speed: 5.0 (faster)
- **Effect**: Energetic, insect-like movement with tight clustering

### 💫 Chaotic
- Separation: 0.3 (minimal)
- Alignment: 0.2 (minimal)
- Cohesion: 0.3 (minimal)
- Max Speed: 6.0 (high)
- **Effect**: Scattered, unpredictable behavior

---

## User Interface

### Instructions Panel
Prominent "How to Use" section displayed at the top with six instruction cards:

1. **Obstacles**: Click to place, click again to remove
2. **Leader Mode**: Shift + Click near a boid
3. **Predator Mode**: Ctrl + Click near a boid
4. **Perception Cone**: Enable checkbox and adjust FOV
5. **Sliders**: Modify flocking and obstacle parameters
6. **Clear Buttons**: Remove obstacles or special boids

**Design**: Gradient background, icon-labeled cards, responsive grid layout

### Canvas Interactions
- **Crosshair Cursor**: Indicates interactive canvas
- **Click**: Place/remove obstacle
- **Shift + Click**: Set leader (near boid)
- **Ctrl/Cmd + Click**: Set predator (near boid)
- **Size**: 1140x600 pixels

### Quick Reference Bar
Condensed instruction text below canvas for quick reference during interaction.

### Real-time Statistics
Four live metrics updated continuously:

- **Boid Count**: Current number of active boids
- **FPS**: Frames per second (performance metric)
- **Average Speed**: Mean velocity across all boids (2 decimal places)
- **Obstacles**: Current number of obstacles placed

---

## Technical Implementation

### Technologies Used
- Pure HTML5, CSS3, and JavaScript (no external libraries)
- Canvas API for rendering
- CSS Grid for responsive layout
- RequestAnimationFrame for smooth 60fps animation

### Code Architecture

#### Classes
**Boid Class**: Encapsulates individual boid behavior
- Position and velocity vectors
- Acceleration accumulator
- Flocking methods: `align()`, `cohesion()`, `separation()`
- Advanced methods: `avoidObstacles()`, `followLeader()`, `fleePredator()`
- FOV checking: `isInFOV()` for perception cone
- Edge wrapping (toroidal topology)
- Vector utilities: `setMag()`, `limit()`, `distance()`

#### Key Functions
- `initBoids()`: Creates initial boid population
- `animate()`: Main animation loop with FPS calculation
- `setupControls()`: Binds UI elements to parameters
- `applyPreset()`: Loads preset configurations
- `adjustBoidCount()`: Dynamically adds/removes boids (preserves leader/predator)
- `togglePerceptionCone()`: Switches perception mode
- `clearObstacles()`: Removes all obstacles
- `clearSpecial()`: Resets leader and predator

#### Canvas Click Handler
Unified event handler with modifier key detection:
- No modifier: Toggle obstacle
- Shift key: Set leader (finds nearest boid within 50px)
- Ctrl/Cmd key: Set predator (finds nearest boid within 50px)

### Performance Considerations
- Efficient neighbor detection within perception radius
- Optional FOV cone filtering reduces computation
- Vector math optimized for performance
- Canvas rendering with motion blur effect
- FPS monitoring for performance transparency
- Scales well up to 300 boids

---

## Design Features

### Visual Design
- Gradient purple background (brand colors: #667eea to #764ba2)
- White container with rounded corners (20px radius)
- Color-coded value displays (purple accent: #667eea)
- Responsive grid layout (auto-fit columns)
- Smooth hover effects on all interactive controls
- Border-left accent bars on instruction cards

### User Experience
- Real-time parameter feedback on all sliders
- Visual value displays on sliders
- Intuitive preset buttons with emoji indicators
- Clear action buttons with hover states
- Performance metrics for transparency
- No page refresh required for any operation
- Prominent instructions for accessibility
- Crosshair cursor indicates interactive canvas
- Visual feedback for leader/predator (size + color)
- Perception cone visualization (when enabled)

### Responsive Design
- Mobile-friendly breakpoint at 768px
- Single-column layout on small screens
- Touch-friendly button sizes
- Maintained readability across devices

---

## File Structure
Single self-contained `.html` file:

```
Assignment-05/
├── index.html          (Complete application)
└── spec-complete.md    (This specification)
```

**File Size**: ~28KB
**Browser Compatibility**: Modern browsers with Canvas API support
**Dependencies**: None (pure vanilla JavaScript)

---

## Interaction Flow Examples

### Example 1: Creating an Obstacle Course
1. Adjust "Obstacle Size" slider to 40
2. Click canvas in multiple locations to create maze
3. Watch boids navigate around obstacles
4. Enable perception cone to see how limited FOV affects navigation
5. Click "Clear Obstacles" to reset

### Example 2: Leader Following Behavior
1. Apply "Schooling" preset for tighter formation
2. Shift + Click a boid near the center to make it a leader
3. Move cursor around—boids will follow the green leader
4. Add obstacles to create a path for the group to navigate
5. Click "Clear Leader/Predator" when done

### Example 3: Predator Evasion
1. Apply "Chaotic" preset for high-speed movement
2. Ctrl + Click a boid to make it a predator
3. Watch boids flee and create empty zones around red predator
4. Enable perception cone with narrow FOV (60°) to see "blind spot" exploitation
5. Compare behavior with omnidirectional vision

### Example 4: Comparing Perception Systems
1. Reset simulation to default
2. Observe natural flocking with omnidirectional sensing
3. Enable "Perception Cone" with 120° FOV
4. Note increased collisions and less coordinated turns
5. Adjust FOV to 270° to see partial restoration of coordination
6. Compare with biological vision systems

---

## Educational Value

This simulation effectively demonstrates:

1. **Emergent Behavior**: Complex group patterns from simple individual rules
2. **Parameter Sensitivity**: How small changes dramatically affect outcomes
3. **Sensory Limitations**: Impact of perception constraints on coordination
4. **Obstacle Navigation**: Path planning without centralized control
5. **Social Dynamics**: Following, fleeing, and group cohesion
6. **Computational Biology**: Modeling natural animal behaviors
7. **Agent-Based Systems**: Decentralized decision-making

---

## Future Enhancement Ideas

- Mouse attraction/repulsion forces
- Multiple predator/leader support
- 3D visualization with Three.js
- Custom preset saving/loading
- Trail length control slider
- Predator hunting behavior (active pursuit)
- Boid energy/stamina system
- Recording and playback of simulations
- Export simulation as video/GIF
- Food sources (attraction points)
- Boid reproduction/death mechanics
- Network visualization (neighbor connections)
- Heatmap of boid density over time

---

## Version History

### v3.0 - Advanced Features (Current)
- Added perception cone system with FOV control
- Added obstacle avoidance with clickable placement
- Added leader/predator system with special behaviors
- Added comprehensive instructions panel
- Added obstacle counter statistic
- Enhanced visual feedback with cone rendering

### v2.0 - Enhanced Statistics
- Added average speed calculation
- Added preset system with four behavior patterns
- Improved UI with preset buttons

### v1.0 - Initial Implementation
- Core boid flocking algorithm
- Slider controls for all parameters
- Reset and pause functionality
- FPS counter
- Motion trails rendering

---

## Credits

Based on Craig Reynolds' Boids (1986)
Implementation: Interactive web-based simulator
Design: Modern responsive interface with accessibility focus

---

## License & Usage

Single-page educational application
Suitable for computer science, biology, and AI courses
No external dependencies required
Free to use for educational purposes
