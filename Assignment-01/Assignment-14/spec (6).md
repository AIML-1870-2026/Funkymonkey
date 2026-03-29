# PRIMATES — Weather App Spec

## Overview

A single-file HTML weather application that fetches live weather data from the OpenWeatherMap API and pairs each temperature reading with the real-world monkey species most comfortable in that habitat. The app is fully self-contained — no build step, no server, no external dependencies beyond Google Fonts and the OpenWeatherMap API.

---

## Tech Stack

- **HTML/CSS/JS** — single `.html` file, no frameworks
- **API** — OpenWeatherMap (`api.openweathermap.org/data/2.5/`)
- **Fonts** — Bebas Neue (headings), DM Sans (body) via Google Fonts
- **Images** — monkey photos embedded as base64 JPEGs directly in the HTML

---

## Colour Palette

| Name | Hex | Usage |
|---|---|---|
| Light Blue | `#B0D0D3` | Sky top, background top |
| Old Rose | `#C08497` | Accent, buttons, highlights, logo |
| Powder Blush | `#F7AF9D` | Sky mid gradient |
| Light Apricot | `#F7E3AF` | Sky low gradient |
| Lemon Chiffon | `#F3EEC3` | Sky base / bottom gradient |
| Text | `#3A2A2E` | All body text |
| Muted | `rgba(58,42,46,0.5)` | Labels, secondary text |
| Card | `rgba(255,255,255,0.35)` | Card backgrounds (frosted glass) |

---

## Typography

- **Bebas Neue** — logo, temperature display, species name, stat values, section titles
- **DM Sans (300/400/500)** — all body copy, labels, descriptions

---

## Layout

Max content width: `900px`, centred, with `40px 24px 80px` padding.

Sections in order:
1. Header (logo)
2. Search bar
3. Hero card (location, temperature, weather description)
4. Monkey card
5. Stats grid
6. Sun bar (sunrise / sunset arc)
7. Hourly forecast strip (next 24h)
8. 5-day forecast strip

---

## API

**Base URL:** `https://api.openweathermap.org/data/2.5/`

Two endpoints are called in parallel on every search:

| Endpoint | Used for |
|---|---|
| `/weather` | Current conditions (temp, humidity, wind, pressure, visibility, cloud cover, sunrise/sunset) |
| `/forecast` | 3-hourly data for next 5 days (hourly strip + 5-day forecast) |

Both support query by city name (`?q=`) or coordinates (`?lat=&lon=`).

All temperatures are fetched in **metric (°C)** and converted to °F client-side when the user toggles units.

**Error handling:**
- `404` → "City not found"
- `401` → "Invalid API key"
- `TypeError` (network failure) → "Network error"

---

## Features

### Search
- Text input with Enter key support
- 📍 Geolocation button — uses `navigator.geolocation` to fetch by coordinates
- Defaults to **New York** on first load

### Temperature Unit Toggle
- °C / °F switch in the hero card
- Converts all displayed temperatures (current, feels like, hourly, forecast) on click without re-fetching

### Dynamic Sky Background
- Full-viewport gradient that transitions smoothly between weather states (1.5s CSS transition)
- Animated floating clouds (CSS drift animation) — shown for cloudy/rainy conditions
- Twinkling dot overlay — shown for clear conditions
- Animated rain (60 DOM raindrop elements) — shown for rain/thunderstorm conditions

Weather → background mapping:

| Condition | Theme |
|---|---|
| Thunderstorm | Muted blue-purple |
| Rain / Drizzle | Slate blue-grey |
| Snow | Cool pale blue |
| Fog / Mist | Neutral grey |
| Clear | Full palette gradient |
| Partly cloudy | Softened palette |
| Overcast | Desaturated palette |

### Hero Card
- City name and country code
- Coordinates (lat/lon)
- Local time and date (calculated from UTC + timezone offset)
- Large temperature display
- Weather description
- Feels like + daily high/low

### Monkey Card
Displays the monkey species whose natural habitat most closely matches the current temperature. Updates whenever weather is loaded or units are toggled.

Components:
- **Photo** — real photograph embedded as base64, displayed at 130×130px with rounded corners and a gentle bob animation (3s ease-in-out loop)
- **Species name** — in Bebas Neue, Old Rose colour
- **Habitat** — location label in muted uppercase
- **Vibe** — one or two sentence description of the species and why this weather suits them
- **Comfort zone** — temperature range badge
- **Comfort match** — label describing how well the current temp matches the species' ideal range

**Too hot (>45°C):** photo is replaced with a large red `!` with a glow effect.

### Monkey Species Map

| Range | Species | Habitat |
|---|---|---|
| Below 2°C | Japanese Macaque | Snowy mountains, Japan |
| 2–12°C | Gelada Baboon | Ethiopian highlands, 3000m+ |
| 12–20°C | Barbary Macaque | Atlas Mountains, North Africa |
| 20–27°C | Rhesus Macaque | South & Southeast Asia |
| 27–33°C | Howler Monkey | Amazon rainforest |
| 33–38°C | Mandrill | Congo rainforest |
| 38–45°C | Olive Baboon | Sub-Saharan savannah |
| Above 45°C | *(none)* | Beyond biological limits — red `!` shown |

### Comfort Match Labels

| Condition | Label |
|---|---|
| >10°C below species min | 🥶 Too Cold |
| Within 10°C below min | 😬 A Bit Chilly |
| Within species range | Species-specific label (e.g. 😄 Loves It) |
| Within 10°C above max | 😅 A Bit Warm |
| >10°C above max | 🔥 Too Hot |

### Stats Grid
Six stat cards in a responsive auto-fill grid (min 160px per card):

- Humidity (%)
- Wind speed (km/h) + cardinal direction
- Pressure (hPa)
- Visibility (km)
- Cloud cover (%)
- UV Index (placeholder)

### Sun Bar
- Sunrise and sunset times (calculated from Unix timestamp + timezone offset)
- Animated SVG arc with a dot showing current sun position along the arc
- Dot position is calculated as a percentage through the day (clamped 0–1)

### Hourly Strip
- Next 8 x 3-hour slots from the forecast API
- First card labelled "Now"
- Shows: time, monkey emoji for that temperature, temperature
- "Now" card highlighted with accent border

### 5-Day Forecast Strip
- Groups forecast slots by calendar day
- Shows: day name, monkey emoji (keyed to daily high), high/low temps, species name
- Horizontally scrollable

---

## Animations

| Element | Animation |
|---|---|
| Monkey photo | `monkeyBob` — 3s ease-in-out vertical float + slight rotation |
| Sky background | CSS `transition: background 1.5s ease` on weather change |
| Stars/sparkles | `twinkle` — 4s ease-in-out opacity pulse |
| Clouds | `drift` — 30–55s linear horizontal scroll |
| Rain | `fall` — 0.5–1.3s linear vertical drop, 60 elements |
| Page load sections | `fadeDown` (header/search) and `fadeUp` (cards) with staggered delays |
| Stat cards | `fadeUp` with per-card animation-delay |
| Hover on cards | `translateY(-3px)` lift |

---

## Responsive Behaviour

- Cards and grids use `flex-wrap` and `auto-fill` to reflow naturally
- Temperature font uses `clamp(5rem, 16vw, 10rem)`
- City name uses `clamp(2.5rem, 6vw, 4rem)`
- At `≤500px`: hero card padding reduced, location row stacks vertically, time aligns left

---

## File Structure

Single file: `weather.html`

Internal structure:
```
<head>
  fonts (Google Fonts)
  <style> — all CSS
</head>
<body>
  sky-bg, stars, clouds, rain  — fixed background layers
  .app
    header
    search-wrap
    #weatherMain (hidden until data loads)
      hero-card
      monkey-card
      stats-grid
      sun-bar
      hourly forecast
      5-day forecast
  <script>
    MONKEY_PHOTOS  — base64 image data
    MONKEYS[]      — species data array
    API + render functions
  </script>
</body>
```
