# Assignment-01 - Welcome Page Specification

## Overview
A playful, animated welcome page featuring bouncing monkey emojis. This serves as an introductory assignment demonstrating basic HTML, CSS animations, and responsive design principles.

---

## Visual Design

### Color Scheme
- **Background**: Light pink (`#ffb6c1`)
- **Text**: Dark gray (`#333`)
- **Overall Aesthetic**: Fun, welcoming, playful

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Heading Size**: 3rem (48px)
- **Emoji Size**:
  - Center monkeys: 4rem (64px)
  - Corner monkeys: 3rem (48px)

---

## Layout

### Structure
The page uses a centered flexbox layout with vertical alignment:
- Full viewport height (`min-height: 100vh`)
- Centered horizontally and vertically
- Flex direction: column

### Elements

#### 1. Corner Monkeys (Fixed Position)
Four monkey emojis (🐵) positioned at each corner of the viewport:
- **Top-left**: `top: 20px; left: 20px`
- **Top-right**: `top: 20px; right: 20px`
- **Bottom-left**: `bottom: 20px; left: 20px`
- **Bottom-right**: `bottom: 20px; right: 20px`

**Emoji Used**: 🐵 (Monkey Face - Unicode `&#128053;`)

#### 2. Main Heading
Centered text stating: **"Hello, I am ready to vibe code!"**
- Font size: 3rem
- Color: Dark gray
- Position: Center of page (above monkey row)

#### 3. Center Monkey Row
A horizontal row of 6 monkey emojis with varied expressions:

| Position | Emoji | Unicode | Description |
|----------|-------|---------|-------------|
| 1 | 🐵 | `&#128053;` | Monkey Face |
| 2 | 🐒 | `&#128018;` | Monkey |
| 3 | 🙈 | `&#128584;` | See-No-Evil Monkey |
| 4 | 🙉 | `&#128585;` | Hear-No-Evil Monkey |
| 5 | 🙊 | `&#128586;` | Speak-No-Evil Monkey |
| 6 | 🐵 | `&#128053;` | Monkey Face |

**Layout**:
- Flexbox with wrapping enabled
- 30px gap between emojis
- Centered horizontally
- 30px margin-top from heading

---

## Animations

### Bounce Animation
All six center monkeys have a continuous bouncing animation:

**Keyframe Behavior**:
```
0%, 100%: translateY(0) - Starting/ending position
50%: translateY(-15px) - Highest point of bounce
```

**Animation Properties**:
- Duration: 2 seconds
- Timing function: ease-in-out
- Iteration: infinite

**Stagger Effect**:
Each monkey has a different animation delay to create a wave effect:
- Monkey 1: 0s (no delay)
- Monkey 2: 0.3s
- Monkey 3: 0.6s
- Monkey 4: 0.9s
- Monkey 5: 1.2s
- Monkey 6: 1.5s

This creates a continuous wave pattern as the monkeys bounce in sequence.

---

## Responsive Design

### Mobile Considerations
- Flexbox automatically handles wrapping on smaller screens
- `flex-wrap: wrap` ensures emojis stack if needed
- Centered alignment maintained at all viewport sizes
- Fixed corner monkeys remain visible (may need scrolling on very small screens)

### Viewport Handling
- Uses `min-height: 100vh` to ensure full viewport coverage
- Margin: 0 to eliminate default browser spacing
- Centered layout works on all standard screen sizes

---

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Animations, flexbox, positioning
- **Unicode Emojis**: No external assets required

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS animations supported by all modern browsers
- Flexbox layout widely supported
- Unicode emoji support on all major platforms

### Performance
- Lightweight: No external dependencies
- Minimal CSS (< 100 lines)
- Hardware-accelerated transforms (translateY)
- No JavaScript required

---

## File Structure

```
Assignment-01/
├── index.html    (Complete single-file application)
└── spec.md       (This specification)
```

**File Size**: ~2KB
**Load Time**: Instant

---

## Educational Value

This assignment demonstrates:

1. **HTML Structure**: Basic page layout and semantic HTML
2. **CSS Positioning**:
   - Flexbox for centering
   - Fixed positioning for corner elements
   - Relative positioning context
3. **CSS Animations**:
   - Keyframe definitions
   - Animation properties (duration, timing, iteration)
   - Animation delays for staggered effects
4. **Typography**: Font sizing with rem units
5. **Responsive Design**: Flexible layouts that adapt to viewport
6. **Unicode**: Using HTML entities for emojis

---

## User Experience

### First Impression
The page creates an immediate playful, welcoming atmosphere with:
- Cheerful pink background
- Friendly monkey theme
- Dynamic bouncing motion
- Encouraging message about coding

### Interaction
- **Passive**: No user interaction required
- **Visual Engagement**: Continuous animation holds attention
- **Accessibility**: Simple, clear message with high contrast

---

## Potential Enhancements

While the current implementation is complete, possible extensions could include:

1. **Sound Effects**: Add playful sound on page load
2. **Click Interactions**: Make monkeys react to clicks
3. **More Animations**: Rotation, scaling, or color changes
4. **Emoji Randomization**: Random monkey selection on page load
5. **Dark Mode Toggle**: Alternative color scheme
6. **Parallax Effects**: Different animation speeds for depth
7. **Particle Effects**: Banana confetti or sparkles

---

## Learning Outcomes

After completing this assignment, students should understand:

- ✅ How to structure a basic HTML page
- ✅ How to use flexbox for layout
- ✅ How to create CSS keyframe animations
- ✅ How to use animation delays for timing effects
- ✅ How to position elements (fixed vs relative)
- ✅ How to use Unicode emojis in HTML
- ✅ How to create responsive, centered layouts

---

## Version History

### v1.0 - Initial Release
- Welcome message with bouncing monkeys
- Pink background aesthetic
- Six-monkey row with staggered animation
- Four corner monkey decorations

---

## Credits

**Assignment**: Introduction to Web Development
**Concept**: Playful welcome page with CSS animations
**Theme**: Monkey/coding enthusiasm
**Complexity Level**: Beginner

---

## Usage

Simply open `index.html` in any modern web browser to view the animated welcome page. No setup, build process, or dependencies required.
