# Blackjack AI Agent — Specification

## Overview

A static webpage (HTML, CSS, JavaScript) that implements a Blackjack-playing AI agent. The user provides their Anthropic API key by uploading a `.env` file. The key is read in-memory only and never stored or transmitted beyond the API call.

The agent reads the current game state (player hand, dealer up card), calls an LLM for a recommendation, and executes the action.

---

## Reference: temp/ Folder

The `temp/` folder contains a working example of a static webpage that interacts with an LLM via an uploaded `.env` file. Use it as a reference for:

- How to parse a `.env` file for the API key (in-memory only)
- The `fetch()` call structure for the LLM API
- Error handling patterns for failed API requests

> **Do NOT include the `temp/` folder in the final build or deployment.**

---

## Core Requirements

### API Key Handling
- User uploads a `.env` file containing `ANTHROPIC_API_KEY=sk-...`
- Key is parsed and stored only in JavaScript memory for the session
- Key is never written to `localStorage`, `sessionStorage`, cookies, or any persistent store
- Key is only used in the `Authorization` header of Anthropic API calls

### Blackjack Game Engine
- Standard 52-card deck (or multi-deck shoe)
- Full dealing logic: player gets 2 cards, dealer gets 2 cards (one face-down)
- Accurate scoring: Aces count as 11 or 1, face cards as 10
- Win/lose/push detection: Blackjack, bust, dealer must hit to 16 and stand on 17
- Balance tracking: player starts with $1,000, bets per hand, wins/losses applied

### LLM Integration
- On each hand (after initial deal), call the Anthropic API with the current game state
- **Structured JSON response** — prompt instructs the model to return:
  ```json
  {
    "action": "hit" | "stand",
    "reasoning": "Brief explanation",
    "confidence": 0.0–1.0
  }
  ```
- This avoids keyword-search ambiguity (e.g., "it is not recommended that you hit, you should stand")
- Parse `action` field directly — no regex or keyword scanning needed
- Log all LLM requests and responses to the browser console for debugging

### UI Flow
1. Upload `.env` → key loaded, game enabled
2. Place bet → deal cards
3. LLM analyzes hand → displays recommendation + reasoning
4. Player clicks "Execute Recommendation" → action taken automatically
5. Resolve hand → update balance → new hand

---

## Enhanced Features (Implemented)

### 1. Performance Analytics
Track and display across all hands played:
- **Win Rate** — percentage of hands won
- **Bankroll Growth/Decline** — chart of balance over time
- **Decision Quality** — how often following the AI recommendation leads to a win

### 2. Explainability Controls
Toggle buttons for different explanation depths from the agent:
- **Basic** — one-sentence recommendation only
- **Statistical** — includes probability reasoning and card counting context
- **In-Depth** — full analysis with expected value, risk assessment, and alternative strategies

---

## File Structure

```
blackjack-ai/
├── spec.md          ← this file
├── index.html       ← main app (self-contained HTML/CSS/JS)
└── temp/
    ├── README.md    ← reference notes
    └── example.html ← minimal LLM fetch example (NOT for deployment)
```

---

## Console Logging

Key interactions logged to the console:
- `[API] Sending request to Anthropic...` with payload summary
- `[API] Raw response:` full response object
- `[API] Parsed action: hit/stand` with confidence
- `[GAME] Hand result: win/lose/push` with balance delta
- `[ERROR] ...` for any API or parsing failures

---

## Security Notes

- No server required — fully static
- API key never leaves the browser except in the Anthropic API call
- `.env` file is read with `FileReader` and immediately discarded after parsing
- No telemetry, no analytics calls, no third-party scripts that could exfiltrate data
