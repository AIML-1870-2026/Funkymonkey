# Julia Set Explorer - Technical Specification

## Overview
A web-based interactive Julia Set fractal explorer that allows users to adjust complex number parameters in real-time, explore the fractal through zooming and panning, and animate parameter changes to observe dynamic transformations.

## Technology Stack
- **Rendering**: HTML5 Canvas (2D context)
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3
- **No external dependencies** - pure HTML/CSS/JS implementation

## Core Functionality

### 1. Julia Set Mathematics
The Julia Set is generated using the iterative function:
```
z(n+1) = z(n)² + c
```

Where:
- `z` is a complex number representing each pixel position
- `c` is the constant complex number parameter (user-adjustable)
- The iteration continues until either:
  - The magnitude |z| exceeds the escape radius (divergence)
  - Maximum iterations are reached (assumed to be in the set)

**Parameters:**
- `c` = a + bi (complex constant)
  - Real part (a): adjustable via slider
  - Imaginary part (b): adjustable via slider
- Max iterations: controls detail/smoothness (default: 200)
- Escape radius: threshold for divergence detection (default: 2)

### 2. Rendering Settings
Based on the screenshot provided:

**Current Parameters (from image):**
- Real (a): -0.7
- Imaginary (b): 0.27015
- Max Iterations: 200
- Escape Radius: 2

**Viewport:**
- Default view: centered at origin (0, 0) in complex plane
- Initial zoom level: showing approximately -2 to +2 on both axes
- Resolution: Canvas should be at least 800x800 pixels

**Color Schemes:**
- Multiple preset color schemes including "Classic"
- Color mapping based on iteration count (escape time algorithm)
- Smooth color gradients to avoid banding

## User Interface Layout

### Control Panel (Left/Right Sidebar)

**COMPLEX CONSTANT (c = a + bi)**
- Real (a): 
  - Slider control (range: -2.0 to +2.0)
  - Text input showing current value to 5 decimal places
  - Real-time update when slider moves
  
- Imaginary (b):
  - Slider control (range: -2.0 to +2.0)
  - Text input showing current value to 5 decimal places
  - Real-time update when slider moves

**RENDERING**
- Max Iterations:
  - Slider control (range: 50 to 500)
  - Text input showing current value
  - Default: 200
  
- Escape Radius:
  - Slider control (range: 2 to 10)
  - Text input showing current value
  - Default: 2

**PRESETS**
- Dropdown menu with interesting Julia Set configurations
- Preset examples to include:
  - "Dendrite" (c = 0 + 1i)
  - "Douady's Rabbit" (c = -0.123 + 0.745i)
  - "Siegel Disk" (c = -0.391 - 0.587i)
  - "San Marco" (c = -0.75 + 0i)
  - "Dragon" (c = -0.8 + 0.156i)
  - "Custom" (user-defined values)

**COLOR SCHEME**
- Dropdown menu with color palette options:
  - Classic (blue-based gradient)
  - Fire (red/orange/yellow)
  - Ocean (blue/cyan/green)
  - Grayscale
  - Rainbow
  - Psychedelic

**ANIMATION CONTROLS**
- "Animate" button to start/stop animation
- Animation type selector:
  - Circular path in parameter space
  - Linear interpolation between two points
  - Random walk
- Speed control slider
- Animation radius/range control

### Canvas Area (Main Display)
- Large canvas element filling the remaining viewport
- Displays the rendered Julia Set
- Interactive features:
  - **Click to zoom**: Click to center and zoom in at that point
  - **Double-click**: Zoom out
  - **Click and drag**: Pan across the complex plane
  - **Mouse wheel**: Zoom in/out (if feasible)
  - Crosshair cursor showing complex coordinates on hover

### Status Bar (Bottom)
- Current zoom level
- Current center coordinates (complex plane)
- Rendering status (e.g., "Rendering...", "Complete", frame rate during animation)
- FPS counter during animation

## Interactive Features

### 1. Real-time Parameter Adjustment
- Sliders update the Julia Set immediately as they're moved
- Debouncing/throttling to prevent excessive redraws (update every 50-100ms max)
- Show loading indicator during computation

### 2. Click to Zoom
- Single click: zoom in 2x, centered at click point
- Double click: zoom out 2x
- Smooth zoom level tracking

### 3. Pan/Drag
- Click and drag to pan the view
- Update canvas in real-time during drag
- Preserve zoom level while panning

### 4. Animation
When animation is enabled:
- Smoothly interpolate the complex constant `c` along a path
- Path options:
  - **Circular**: Rotate around a center point in parameter space
  - **Linear**: Move between point A and point B
  - **Random**: Small random steps from current position
- Render each frame at current animation position
- Display FPS in status bar
- Pause/resume capability
- Speed control (frames per second target)

## Technical Implementation Details

### Canvas Rendering
```javascript
// Pseudocode structure
function renderJuliaSet(canvas, c_real, c_imag, maxIter, escapeRadius, zoom, centerX, centerY) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  
  for (let px = 0; px < canvas.width; px++) {
    for (let py = 0; py < canvas.height; py++) {
      // Map pixel to complex plane
      const x0 = mapPixelToComplex(px, canvas.width, zoom, centerX);
      const y0 = mapPixelToComplex(py, canvas.height, zoom, centerY);
      
      // Iterate Julia Set formula
      let x = x0, y = y0;
      let iteration = 0;
      
      while (x*x + y*y <= escapeRadius*escapeRadius && iteration < maxIter) {
        const xtemp = x*x - y*y + c_real;
        y = 2*x*y + c_imag;
        x = xtemp;
        iteration++;
      }
      
      // Color based on iteration count
      const color = getColor(iteration, maxIter);
      setPixel(imageData, px, py, color);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
```

### Performance Optimization
- Use Web Workers for fractal calculation if rendering is slow
- Progressive rendering: render at lower resolution first, then refine
- Cache rendered frames during animation
- Limit animation frame rate to 30-60 FPS

### State Management
Track application state:
```javascript
{
  c: { real: -0.7, imag: 0.27015 },
  maxIterations: 200,
  escapeRadius: 2,
  viewport: { centerX: 0, centerY: 0, zoom: 1 },
  colorScheme: 'classic',
  animation: {
    enabled: false,
    type: 'circular',
    speed: 1,
    radius: 0.1
  }
}
```

### URL Parameter Sharing
Encode current state in URL query parameters:
```
?cr=-0.7&ci=0.27015&iter=200&escape=2&zoom=1&cx=0&cy=0&color=classic
```

## Responsive Design
- Controls panel: collapsible on mobile devices
- Canvas: fills available viewport
- Touch-friendly controls on mobile
- Minimum viewport width: 320px

## File Structure
```
julia-set-explorer/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── app.js             # Main application logic
├── julia.js           # Julia Set calculation engine
├── colors.js          # Color scheme definitions
└── README.md          # User documentation
```

## Deliverables
1. Fully functional single-page application
2. Clean, commented code
3. README with:
   - How to use the application
   - Explanation of Julia Sets
   - List of keyboard shortcuts (if any)
   - Credits and mathematical references

## Future Enhancements (Optional)
- Save/export high-resolution images
- Multiple Julia Set instances for comparison
- Mandelbrot Set view showing where current c parameter is located
- More sophisticated color algorithms (continuous coloring)
- WebGL implementation for better performance

## Testing Requirements
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile devices (iOS Safari, Chrome Mobile)
- Verify smooth 30+ FPS animation
- Verify slider responsiveness
- Test zoom/pan at extreme values

---

**Notes:**
- Prioritize code clarity and maintainability
- Include inline comments explaining the mathematics
- Use semantic HTML and accessible controls
- Ensure all interactive elements have appropriate ARIA labels
