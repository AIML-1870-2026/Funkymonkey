# Turing Patterns Explorer - Specification Document

## Project Overview

An interactive web-based application for exploring reaction-diffusion patterns based on Alan Turing's 1952 theory of morphogenesis. The application simulates the Gray-Scott model to generate emergent patterns like spots, stripes, mazes, and spirals through simple chemical reaction rules.

## Core Functionality

### Reaction-Diffusion Simulation

**Model**: Gray-Scott reaction-diffusion equations
- Two chemicals: A (substrate) and B (reactant)
- Chemical A is continuously fed into the system
- Chemical B is removed (killed) at a constant rate
- Both chemicals diffuse across the grid
- Chemicals react: A + 2B → 3B

**Grid Specifications**:
- Canvas size: 800x800 pixels
- Each pixel represents one cell in the simulation
- Toroidal topology (edges wrap around)
- Update frequency: 60 FPS (requestAnimationFrame)

**Mathematical Implementation**:
- Laplacian kernel for diffusion (5-point stencil with weights: center -0.8, neighbors 0.2 each)
- Euler integration with timestep dt = 1.0
- Parameter ranges:
  - Feed rate (F): 0.01 to 0.1
  - Kill rate (K): 0.01 to 0.1
  - Diffusion A (dA): 0.5 to 2.0
  - Diffusion B (dB): 0.1 to 1.0

## User Interface Layout

### Overall Structure

**Two-column layout**:
- Left sidebar: Controls panel (300px fixed width)
- Right panel: Canvas display (flexible, maintains aspect ratio)
- Responsive: Stacks vertically on screens < 900px

### Header Section

- Gradient background (purple to violet)
- Title: "🦓 Turing Patterns Explorer"
- Subtitle: "Discover how nature creates spots, stripes, and spirals through reaction-diffusion"
- White text with shadow for readability

### Controls Panel (Left Sidebar)

**Background**: Light gray (#f8f9fa) with rounded corners
**Padding**: 20px throughout
**Sections** (each with colored heading and divider):

1. **Pattern Presets** (⚙️)
   - 2x3 grid of buttons
   - Presets: Spots, Stripes, Maze, Spirals, Coral, Waves
   - Purple gradient buttons with hover effects

2. **Color Schemes** (🎨)
   - 6 color scheme options displayed as gradient swatches
   - Options: Classic, Grayscale, Ocean, Fire, Nature, Sunset
   - Active scheme indicated with border highlight

3. **Parameters** (📊)
   - Four sliders with labels and live value display:
     - Feed Rate (F): 0.01-0.1, step 0.001
     - Kill Rate (K): 0.01-0.1, step 0.001
     - Diffusion Rate A: 0.5-2.0, step 0.1
     - Diffusion Rate B: 0.1-1.0, step 0.05
   - Parameter space visualization (200px height gradient map)
   - White marker dot showing current F/K position

4. **Brush Size** (🖌️)
   - Slider: 5-50 pixels, step 5
   - Visual preview showing brush dot size

5. **Controls** (⏯️)
   - Play/Pause button (toggles simulation)
   - Speed control: 3 buttons (0.5x, 1x, 2x)
   - Reset button (reinitialize with random perturbations)
   - Clear button (set all cells to chemical A only)
   - Save Image button (download as PNG)

6. **Info Panel** (ℹ️)
   - Light blue background with left border
   - Brief explanation of Turing patterns
   - User interaction hint

### Canvas Container (Right Panel)

- Black background
- Rounded corners (15px)
- Box shadow for depth
- Canvas scales responsively
- Crosshair cursor on hover

## Interaction Behaviors

### Mouse/Touch Drawing

**Trigger**: Click and drag on canvas
**Behavior**: 
- Paint chemical B in a circular area around cursor
- Radius determined by brush size slider
- Works on both mouse and touch devices
- Drawing persists while mouse/touch is held down

**Implementation**:
- Coordinate conversion from screen space to canvas space
- Circular fill algorithm (distance formula)
- Wrapped coordinates (toroidal boundary)

### Pattern Presets

**Trigger**: Click preset button
**Behavior**:
1. Update F and K parameters to preset values
2. Update slider positions
3. Update displayed values
4. Clear grid to chemical A
5. Initialize specific pattern based on preset type:
   - **Spots**: 25 random circular clusters (radius 15px)
   - **Stripes**: Horizontal lines every 40 pixels (5px thick)
   - **Maze**: Grid of vertical and horizontal lines (30px spacing)
   - **Spirals**: 15 random small circles (radius 10px)
   - **Waves**: Vertical sinusoidal pattern (wavelength 40px)
   - **Coral**: 25 random circular clusters (same as spots)
6. Update parameter marker position

**Preset Parameter Values**:
```
Spots:   F=0.055, K=0.062
Stripes: F=0.035, K=0.065
Maze:    F=0.029, K=0.057
Spirals: F=0.018, K=0.051
Coral:   F=0.062, K=0.061
Waves:   F=0.014, K=0.054
```

### Parameter Sliders

**Trigger**: Drag slider
**Behavior**:
- Update corresponding parameter in real-time
- Display updated value next to slider (3 decimal places)
- Update parameter marker on parameter space map
- No grid reset (pattern evolves continuously)

### Parameter Space Map

**Trigger**: Click anywhere on gradient map
**Behavior**:
1. Calculate F and K from click position (linear mapping)
2. Update both sliders to new values
3. Update displayed values
4. Move marker to click position
5. Reset grid with random initial perturbations

### Color Scheme Selection

**Trigger**: Click color swatch
**Behavior**:
- Highlight selected swatch with border
- Apply new color mapping to simulation
- Continuous transition (no reset required)

### Speed Controls

**Trigger**: Click speed button (0.5x, 1x, 2x)
**Behavior**:
- Highlight selected button
- Multiply simulation iterations per frame
- No visual disruption

### Play/Pause

**Trigger**: Click play/pause button
**Behavior**:
- Toggle simulation update loop
- Update button text and icon
- Rendering continues (shows frozen state)

### Reset

**Trigger**: Click reset button
**Behavior**:
- Reinitialize entire grid with chemical A
- Add 20 random circular perturbations of chemical B (radius 20px)
- Maintains current F/K parameters

### Clear

**Trigger**: Click clear button
**Behavior**:
- Set all cells to {a: 1, b: 0}
- No initial perturbations
- Creates blank slate for manual drawing

### Save Image

**Trigger**: Click save button
**Behavior**:
- Generate PNG from current canvas state
- Trigger browser download
- Filename: "turing-pattern.png"

## Visual Design

### Color Schemes

**Classic** (default):
- Low values (a → 0): Blue (0, 0, 255)
- High values (a → 1): Red (255, 0, 0)
- Linear interpolation

**Grayscale**:
- Low values: Black (0, 0, 0)
- High values: White (255, 255, 255)

**Ocean**:
- Low values: Dark blue (0-30, 31-131, 63-255)
- High values: Cyan

**Fire**:
- Low values: Red (255, 0, 0)
- High values: Yellow (255, 255, 0)

**Nature**:
- Low values: Dark green (30-144, 58-226, 30-144)
- High values: Light green

**Sunset**:
- Low values: Pink-red (255-205, 107-202, 107-187)
- High values: Orange-yellow

### Button Styles

**Preset Buttons**:
- Purple gradient background (#667eea to #764ba2)
- White text, rounded corners
- Hover: Lift effect (translateY -2px)
- Shadow increases on hover

**Control Buttons**:
- Play: Green (#4CAF50)
- Reset: Red (#ff6b6b)
- Clear: Yellow (#feca57)
- Save: Cyan (#48dbfb)
- Full width, 12px padding
- Bold text, rounded corners
- Hover lift effect

**Speed Buttons**:
- Outline style (border only) when inactive
- Filled with purple when active
- Equal flex distribution

### Responsive Behavior

**Desktop (> 900px)**:
- Side-by-side layout
- Controls fixed width (300px)
- Canvas flexible

**Mobile/Tablet (< 900px)**:
- Vertical stack
- Canvas appears first
- Controls panel below
- Full width for both sections

## Technical Requirements

### Browser Compatibility

- Modern browsers with HTML5 Canvas support
- ES6 JavaScript required
- Touch events for mobile devices
- No external dependencies or libraries

### Performance Considerations

- Target: 60 FPS
- Grid size: 800x800 (640,000 cells)
- Speed multiplier allows 0.5x-2x iteration adjustment
- ImageData API for efficient rendering
- Laplacian calculation optimized with typed access

### File Structure

**Single HTML file** containing:
- HTML structure
- Embedded CSS (in `<style>` tag)
- Embedded JavaScript (in `<script>` tag)

**Why single file?**
- Easy deployment
- No build process required
- Simple to share and host
- GitHub Pages compatible

## Initialization Sequence

1. Create canvas context
2. Initialize grid arrays (grid and nextGrid)
3. Populate grid with chemical A (value 1)
4. Add random initial perturbations (20 circles of chemical B)
5. Set default parameters (F=0.055, K=0.062)
6. Update parameter marker position
7. Start animation loop
8. Enable all event listeners

## Animation Loop

**Function**: `animate()`
**Frequency**: ~60 FPS (requestAnimationFrame)

**Steps per frame**:
1. Check if simulation is running
2. If running, execute update() × speedMultiplier times
3. Render current grid state to canvas
4. Request next animation frame

**Update cycle**:
1. For each cell (x, y):
   - Calculate Laplacian for chemicals A and B
   - Calculate reaction term (a × b²)
   - Update chemical A: diffusion - reaction + feed
   - Update chemical B: diffusion + reaction - decay
   - Clamp values to [0, 1]
2. Swap grid and nextGrid references

**Render cycle**:
1. Create ImageData object
2. For each cell, map chemical A value to RGB using current color scheme
3. Write RGB values to ImageData
4. Put ImageData to canvas

## Future Enhancement Ideas

*Not included in current implementation, but potential additions:*

- Recording/playback of parameter journeys
- Export high-resolution images
- Multiple simultaneous simulations
- Alternative reaction-diffusion models (Brusselator, etc.)
- Gallery of saved patterns
- Share URL with encoded parameters
- 3D visualization mode
- Real-time FPS counter
- Undo/redo for drawing

## Educational Context

This tool demonstrates:
- Emergence and self-organization
- Alan Turing's morphogenesis theory
- How simple rules create complex patterns
- Parameter space exploration
- The relationship between initial conditions and outcomes
- Pattern formation in nature (animal coats, chemical reactions, etc.)

## Deployment

**Recommended platform**: GitHub Pages
**Steps**:
1. Create GitHub repository
2. Upload HTML file as `index.html`
3. Enable GitHub Pages in repository settings
4. Access at `username.github.io/repository-name`

**Alternative deployment**:
- Any static web host
- Local file system (file:// protocol)
- CodePen, JSFiddle, or similar
- Personal web server