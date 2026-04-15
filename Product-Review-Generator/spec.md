# Product Review Generator — Project Specification

**Course assignment:** Code Quest  
**Deliverable:** Three files — `index.html`, `styles.css`, `app.js`  
**Last updated:** 2026-04-09

---

## Overview

The Product Review Generator is a browser-based tool that lets a user describe a product and receive an AI-generated review via the OpenAI API. It requires no backend or build step — open `index.html` in any modern browser and it runs. The API key is stored in a JavaScript variable only and is never written to localStorage, cookies, or any persistent store.

---

## File Structure

```
Product-Review-Generator/
├── index.html      # Markup and layout
├── styles.css      # Pink terminal theme, all visual styling
├── app.js          # API key logic, event handlers, OpenAI API call
└── spec.md         # This file
```

---

## Core Features

### 1. API Key Handling

- Single key entry field (masked `type="password"`) with show/hide toggle
- Key stored in a JavaScript variable only — never written to `localStorage`, cookies, or any persistent store
- Key can also be loaded from a `.env` file via drag-and-drop or file picker (parsed in-memory only)
- Header status pill updates in real time:
  - `OAI: NO KEY` — default, no key entered (grey)
  - `OAI: KEY SET` — key starts with `sk-` and length > 20 (pink)
  - `OAI: BAD KEY` — key entered but fails format check (red)
- If the user tries to generate without a valid key, the status pill flashes red as feedback

### 2. Model Selection

OpenAI models only, selectable via dropdown in the sidebar:

| Model | Notes |
|-------|-------|
| `gpt-4o-mini` | Fast, lightweight |
| `gpt-4o` | Default (selected on load) |
| `gpt-4-turbo` | Most capable |

### 3. Product Input Fields (main area)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Product Name | Text input | Yes | Flashes red border if empty on submit |
| Category | Dropdown | Yes | See category list below |
| Comments | Textarea | No | Extra context, features, instructions |

**Category options:** Electronics, Kitchen, Clothing, Books, Sports & Outdoors, Home & Garden, Beauty & Personal Care, Toys & Games, Other

### 4. Review Controls (sidebar)

| Control | Type | Options |
|---------|------|---------|
| Tone | Dropdown | Balanced, Enthusiastic, Critical, Professional, Casual |
| Intensity | Slider | Slight · Moderate · Strong · Extreme |
| Length | Slider | Short (~100 words) · Medium (~250 words) · Long (~500 words) |

**Tone + Intensity** work together. The selected tone sets the style; the intensity slider controls how strongly that tone is applied. For example: Tone = Critical, Intensity = Extreme → "brutally and extremely critical."

### 5. Prompt Construction

The system prompt and user message are built dynamically at call time from the user's selections:

**System prompt template:**
```
You are an expert product reviewer specialising in {category}.
{tone instruction} Make the tone {intensity modifier}.
Aim for approximately {word target} words.
Structure your review naturally: open with an overall impression,
discuss key features, mention any notable pros and cons, and close with a recommendation.
Do not use markdown headers or bullet points — write in flowing prose only.
```

**User message template:**
```
Write a product review for: {product name} (Category: {category})

Additional context and instructions:
{comments}        ← only appended if comments field is non-empty
```

**Tone instructions by value:**

| Value | Instruction |
|-------|-------------|
| balanced | Write a balanced, honest review covering both strengths and weaknesses. |
| enthusiastic | Write an enthusiastic, energetic review that highlights the product's best qualities. |
| critical | Write a critical, analytical review that focuses on weaknesses and areas for improvement. |
| professional | Write a professional, formal review suitable for a trade publication. |
| casual | Write a casual, conversational review as if recommending (or not) to a friend. |

**Intensity modifiers by tone and slider position (0–3):**

| Tone | 0 — Slight | 1 — Moderate | 2 — Strong | 3 — Extreme |
|------|------------|--------------|------------|-------------|
| balanced | mildly balanced | balanced | strongly balanced | strictly neutral and balanced |
| enthusiastic | slightly enthusiastic | moderately enthusiastic | very enthusiastic | extremely enthusiastic and effusive |
| critical | mildly critical | moderately critical | harshly critical | brutally and extremely critical |
| professional | somewhat professional | professional | highly professional and formal | extremely formal and authoritative |
| casual | slightly casual | moderately casual | very casual and relaxed | extremely casual and conversational |

**Word targets by length value:** short = 100, medium = 250, long = 500

### 6. OpenAI API Call

- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {key}`
- **Body:**
  ```json
  {
    "model": "{selected model}",
    "max_tokens": 1024,
    "messages": [
      { "role": "system", "content": "{constructed system prompt}" },
      { "role": "user",   "content": "{constructed user message}" }
    ]
  }
  ```
- **Response parsing:** Extract `data.choices[0].message.content`
- **Error handling:** If `!response.ok`, display `data.error.message` or fallback to `HTTP {status}`; catch network errors and display `err.message`

### 7. Output Display

After a successful generation:
- Hide the placeholder, show the review block
- **Meta line** (small, dimmed): `MODEL: {model}  ·  TONE: {tone}  ·  CATEGORY: {category}  ·  {time}`
- **Review text:** rendered in `IBM Plex Sans`, flowing prose, `white-space: pre-wrap`
- **Token bar** (footer): `PROMPT TOKENS: X  ·  COMPLETION TOKENS: Y  ·  TOTAL: Z  ·  MODEL: {model}`

### 8. Example Buttons

Five pre-loaded examples in the sidebar. Clicking one fills the Product Name field and sets the Category dropdown:

| Label | Product | Category |
|-------|---------|----------|
| 🎧 Sony Headphones | Sony WH-1000XM5 wireless noise-cancelling headphones | Electronics |
| 💻 MacBook Air M3 | Apple MacBook Air M3, 15-inch, 8GB RAM, 256GB SSD | Electronics |
| 🍲 Instant Pot Duo | Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 quart | Kitchen |
| 👖 Levi's 501 Jeans | Levi's 501 Original Fit Men's Jeans in dark wash denim | Clothing |
| 📚 Kindle Paperwhite | Kindle Paperwhite 11th Gen, 8GB, waterproof, 6.8-inch display | Electronics |

### 9. Clear Button

Clears the Product Name field, Comments field, hides the review block, restores the placeholder, and resets the token bar to `—`.

---

## UI Layout

```
┌──────────────────────────────────────────────────────┐
│  HEADER: [REVIEWGEN]                  OAI: KEY SET   │
├─────────────────┬────────────────────────────────────┤
│                 │  [Product Name]    [Category ▾]    │
│  API KEY        │                                    │
│  [drop .env]    │  [Comments textarea]               │
│  MODEL ▾        │                          [GENERATE]│
│  TONE ▾         ├────────────────────────────────────┤
│  INTENSITY ──●─ │                                    │
│  LENGTH ───●──  │  Output / placeholder              │
│                 │                                    │
│  EXAMPLES       │                                    │
│  🎧 ...         │                                    │
│  💻 ...         │                                    │
│  🍲 ...         ├────────────────────────────────────┤
│  👖 ...         │  Token bar                         │
│  📚 ...         │                                    │
│  [CLEAR OUTPUT] │                                    │
└─────────────────┴────────────────────────────────────┘
```

---

## Visual Design

- **Theme:** Dark terminal, pink palette
- **Fonts:** IBM Plex Mono (UI chrome, labels, code) + IBM Plex Sans (review body text) — loaded from Google Fonts CDN
- **Color palette (CSS variables):**

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#1a0a12` | Page background |
| `--bg-panel` | `#200d18` | Sidebar, header, input area |
| `--bg-input` | `#2a1020` | Input fields |
| `--border` | `#4a1a35` | All borders |
| `--pink` | `#ff6eb4` | Primary accent, logo, active states |
| `--pink-dim` | `#e0509a` | Button borders, focus rings |
| `--pink-dark` | `#3d0025` | Button background |
| `--text` | `#ffd6ec` | Primary text |
| `--text-dim` | `#a0507a` | Labels, meta text |
| `--text-muted` | `#5c2e45` | Placeholders, inactive |
| `--red` | `#ff5252` | Errors, clear button hover |

- **Sliders:** Pink circular thumb with glow, dark track
- **Generate button:** Pink border/text at rest, fills pink on hover with glow effect, pulses while loading
- **No external JS libraries** — vanilla JS only
- **No backend or build step** — open `index.html` directly in browser

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter (in Product Name field) | Trigger generate |
| Shift+Enter | New line (in Comments textarea, default behaviour) |

---

## Security Notes

- API key exists only in the JavaScript runtime of the current browser tab
- Closing or refreshing the tab clears the key completely
- The `.env` drop zone parses the file in-memory only — the file is never uploaded or stored
