# Boid Mini Lab - Project Specification

## Overview
An interactive web-based boid simulation that demonstrates flocking behavior with real-time parameter adjustment through sliders and preset configurations.

## Project Context
This project was developed through an iterative conversation where features were added and refined based on user feedback.

## Initial Requirements
- Create a webpage featuring a boid simulation
- Include sliders to adjust various aspects of the simulation
- Provide interactive controls for experimentation

## Features Implemented

### Core Simulation
- **Boid Algorithm**: Implementation of Craig Reynolds' boids algorithm with three fundamental behaviors:
  - **Separation**: Boids steer to avoid crowding neighbors
  - **Alignment**: Boids steer towards the average heading of neighbors
  - **Cohesion**: Boids steer towards the average position of neighbors

- **Visual Rendering**: 
  - Boids rendered as triangular shapes pointing in their direction of travel
  - Color-coded with HSL values (blue-ish spectrum)
  - Motion trails effect using semi-transparent canvas clearing
  - Dark background (#0a0e27) for contrast

### Interactive Controls

#### Simulation Controls
- **Number of Boids**: Adjustable from 10 to 300 (default: 100)
- **Reset Button**: Resets all sliders to default values (not screen clearing)
- **Pause/Resume Button**: Toggle simulation animation

#### Flocking Behavior Parameters
- **Separation** (0-3, default: 1.5): Strength of avoidance behavior
- **Alignment** (0-3, default: 1.0): Strength of velocity matching
- **Cohesion** (0-3, default: 1.0): Strength of group centering

#### Movement Parameters
- **Max Speed** (1-10, default: 4): Maximum velocity of boids
- **Max Force** (0.05-0.5, default: 0.2): Maximum steering force applied

#### Perception Parameters
- **Vision Radius** (20-150, default: 50): Distance at which boids detect neighbors
- **Separation Radius** (10-80, default: 25): Personal space distance for separation

### Presets System
Four pre-configured behavior patterns:

1. **🐟 Schooling**
   - High separation (2.5)
   - Moderate alignment (1.5)
   - Standard cohesion (1.0)
   - Lower speed (3.5)
   - Tighter formations like fish schools

2. **🦅 Flocking** (Default)
   - Balanced parameters
   - Represents classic bird-like behavior
   - All values at baseline

3. **🐝 Swarming**
   - Lower separation (1.0)
   - Reduced alignment (0.5)
   - High cohesion (2.0)
   - Faster speed (5)
   - Energetic, insect-like movement

4. **💫 Chaotic**
   - Minimal separation (0.3)
   - Minimal alignment (0.2)
   - Minimal cohesion (0.3)
   - High speed (6)
   - Scattered, unpredictable behavior

### Real-time Statistics
- **Boid Count**: Current number of active boids
- **FPS**: Frames per second (performance metric)
- **Average Speed**: Real-time calculation of mean velocity across all boids

## Iterative Development History

### Version 1: Initial Implementation
- Created base boid simulation with all three flocking behaviors
- Implemented slider controls for all parameters
- Added reset (spawn new boids) and pause functionality
- Included FPS counter

### Version 2: Enhanced Statistics and Presets
**User Request**: "along with fps can you do the average speed? also can you add some presets like schooling etc?"

**Changes Made**:
- Added average speed calculation and display
- Implemented preset system with four distinct behavior patterns
- Created preset buttons with emoji indicators

### Version 3: Reset Button Refinement
**User Request**: "can you make reset button reset the sliders instead of the screen"

**Changes Made**:
- Modified reset button behavior from respawning boids to resetting parameters
- Reset now applies the default "Flocking" preset
- Includes boid count reset to 100

## Technical Implementation

### Technologies Used
- Pure HTML5, CSS3, and JavaScript (no external libraries)
- Canvas API for rendering
- CSS Grid for responsive layout
- RequestAnimationFrame for smooth animation

### Code Architecture

#### Classes
- **Boid Class**: Encapsulates individual boid behavior
  - Position and velocity tracking
  - Three flocking methods (align, cohesion, separation)
  - Edge wrapping (toroidal topology)
  - Vector math utilities (setMag, limit, distance)

#### Key Functions
- `initBoids()`: Creates initial boid population
- `animate()`: Main animation loop with FPS calculation
- `setupControls()`: Binds UI elements to parameters
- `applyPreset()`: Loads preset configurations
- `adjustBoidCount()`: Dynamically adds/removes boids

### Performance Considerations
- Efficient neighbor detection within perception radius
- Vector math optimized for performance
- Canvas rendering with motion blur effect
- FPS monitoring for performance feedback

## Design Features

### Visual Design
- Gradient purple background (brand colors)
- White container with rounded corners
- Color-coded value displays
- Responsive grid layout
- Smooth hover effects on controls

### User Experience
- Real-time parameter feedback
- Visual value displays on sliders
- Intuitive preset buttons
- Performance metrics for transparency
- No page refresh required for any operation

## File Output
- **Filename**: `boid-lab.html`
- **Type**: Single-file HTML application (self-contained)
- **Size**: Approximately 15KB
- **Browser Compatibility**: Modern browsers with Canvas support

## Future Enhancement Possibilities
- Mouse interaction (attract/repel boids)
- Obstacle avoidance
- Predator/prey dynamics
- 3D visualization
- Export/import custom presets
- Record and playback functionality
- Additional preset behaviors (murmurations, migration patterns)
- Adjustable canvas size
- Color scheme customization
- Trail length control

## Conclusion
The Boid Mini Lab successfully demonstrates emergent flocking behavior through a clean, interactive interface that allows users to experiment with the fundamental parameters that govern collective motion in nature.
