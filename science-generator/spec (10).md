# Science Experiment Generator — Project Spec

## Overview

A single-page web application (`index.html`) that allows a user to generate grade-appropriate science experiments using an LLM. The user provides a grade level and a list of available supplies, and the app returns a fully structured experiment rendered as formatted HTML.

---

## Original Assignment Requirements

**Main Task:** Create a dynamic webpage using Node.js that enables a user to interact with an LLM for the purposes of generating grade-appropriate science experiments from a list of available materials.

### Required Inputs
- **Grade Level** — a dropdown menu allowing the user to select grade level (e.g., K-2, 3-5, etc.)
- **Available Supplies** — a text input field allowing the user to enter a list of supplies that are on hand or easily acquired

### Reference Implementation Notes (from `temp/` folder)
The `temp/` folder contains a complete LLM Switchboard project (HTML, CSS, and JS files). It is **NOT** part of this project — do not include it in the final build or deployment.

Use it as a reference for:
- How to parse a `.env` file for API keys (in-memory only)
- The `fetch()` call structure for OpenAI's chat completions API
- Error handling patterns for failed API requests
- How the code is organized across separate files
- The general approach to building a single-page LLM tool

Ignore these Switchboard features (not needed here):
- ~~Anthropic integration~~ (this project is OpenAI-only per original spec, but extended — see Changes below)
- ~~The model selection dropdown / provider switching~~ (added as an extension)
- ~~Structured output mode and JSON schema handling~~

**Output format:** This project uses unstructured (free-form) responses only. Render the model's markdown output as formatted HTML.

---

## Implementation — `index.html`

The entire project lives in a single `index.html` file. No build step, no server, no dependencies.

### Tech Stack
- Vanilla HTML, CSS, JavaScript
- Google Fonts: `Syne` (headings), `Inconsolata` (body/monospace)
- Direct browser `fetch()` calls to LLM provider APIs

---

## Changes & Decisions Made During Development

### 1. API Key Input (instead of `.env` file)
**Decision:** The assignment referenced parsing a `.env` file, but since this is a plain HTML file served in the browser (no Node.js backend), a `.env` file doesn't apply. Instead, the user pastes their API key directly into a password input field on the page.

**Behavior:**
- Key is held in memory only — never stored, never written to disk
- The Generate button is disabled until a key is entered
- A status indicator (dot) shows: grey = no key, green = key ready

### 2. Light Green Theme
**Change:** Background color scheme changed from dark (near-black) to a light green palette.

**Color tokens:**
```css
--bg: #e8f5e9;          /* page background */
--surface: #f1faf2;     /* card surfaces */
--border: #a5d6a7;      /* borders */
--accent: #2e7d32;      /* buttons, highlights */
--text: #1b3a1f;        /* primary text */
--text-muted: #4a7a4e;  /* secondary text */
--danger: #c62828;      /* error states */
--bubble: #dcedc8;      /* code blocks */
```

### 3. Readable Title
**Change:** The heading font was updated from a decorative/cursive font with a drip SVG filter to a clean, bold `Syne` font for readability.

```css
h1 {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3.4rem);
  letter-spacing: -.02em;
}
```

### 4. Provider + Model Dropdowns (extension beyond original spec)
**Change:** Added two dropdowns above the grade/supplies inputs — one for LLM provider and one for model. Switching the provider automatically updates the model list and the API key placeholder text.

**Supported providers and models:**

| Provider  | Models |
|-----------|--------|
| OpenAI    | `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo` |
| Anthropic | `claude-opus-4-5`, `claude-sonnet-4-5`, `claude-haiku-4-5` |
| Google    | `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0-flash` |

**API call structure per provider:**

- **OpenAI:** `POST https://api.openai.com/v1/chat/completions` with `Authorization: Bearer {key}`
- **Anthropic:** `POST https://api.anthropic.com/v1/messages` with `x-api-key: {key}` and `anthropic-version: 2023-06-01`
- **Google:** `GET https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}`

The output chip shows which grade and model was used (e.g. `Grade 3-5 · gpt-4o`).

---

## Prompt Structure

The prompt sent to the LLM is structured to produce consistent, sectioned markdown output:

```
You are an enthusiastic, experienced science teacher.

Generate a single, detailed science experiment appropriate for grade level {grade} students.

The student has access to these supplies: {supplies}.

Structure your response with these sections:
## Experiment Title
## The Big Idea
## What You'll Need
## Safety Notes
## Step-by-Step Instructions
## What to Observe
## The Science Behind It
## Extension Ideas
```

---

## Markdown Rendering

Since the LLM returns markdown, a lightweight client-side renderer converts it to HTML before injecting into the page. It handles:

- Headings (`#`, `##`, `###`)
- Bold, italic, bold+italic
- Ordered and unordered lists
- Inline code and fenced code blocks
- Horizontal rules
- Paragraphs with line break preservation

---

## File Structure

```
project/
├── index.html        ← entire application (HTML + CSS + JS)
├── spec.md           ← this file
└── temp/             ← reference only, NOT part of submission
    ├── index.html
    ├── style.css
    └── script.js
```

---

## How to Run

1. Open `index.html` via a local server (e.g. VS Code Live Server, or `npx serve .`)
   - Opening as a raw file (`file://`) will block API calls due to browser CORS policy
2. Select your LLM provider and model
3. Paste your API key into the key field
4. Choose a grade level and enter available supplies
5. Click **Generate Experiment**
