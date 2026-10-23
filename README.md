# MindEase — Poster Companion & Interactive Cognitive Accessibility Exhibition

> **GCD4F 2026 (Global Challenge for Design for Futures)**  
> **Team:** The Architects — École Nationale Supérieure d'Ingénieurs de Tunis (ENSIT)  
> **Target:** Neurodivergent Learners (ADHD, Dyslexia, ASD) and Multilingual STEM Students  
> **Live Poster Companion Website:** Accessible Single-Page Digital Exhibition  

---

## 🌟 Executive Overview

**MindEase** is an AI-native browser extension and cognitive accessibility layer that non-destructively transforms dense academic articles, complex STEM formulas, and video lectures in real time to match each student’s unique cognitive style — synthesising study sessions into personalized memory artifacts.

Traditional digital learning environments assume a neurotypical reader with uniform cognitive stamina. For neurodivergent readers, dense educational materials induce severe perceptual and cognitive friction:
1. **Working Memory Fatigue:** Unbroken blocks of academic prose cause cognitive drop-off within 4–7 minutes.
2. **Symbolic Parsing Barriers:** Raw LaTeX strings and fragmented math interrupt linguistic processing.
3. **Context-Free Vocabulary:** Constant tab-switching to search for definitions shatters concentration.
4. **Skim Blindspots:** Silent conceptual gaps remain unnoticed until post-study assessment.

MindEase addresses these challenges through a three-layer cognitive architecture operating alongside an integrated Manim mathematical video generation pipeline.

---

## 🏛️ Three-Layer Cognitive Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Layer 1 — Real-Time Content Transformation                                  │
│ • Non-destructive tagging ([CHUNK], [CONCEPT], [DEF], [FORMULA])            │
│ • Shadow DOM isolation (all: initial) preventing host CSS collisions        │
│ • KaTeX math rendering, Napkin AI vector diagrams, Manim math animations    │
│ • Client-side sentence-chunked narration with karaoke-style highlighting    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Presentation parameters
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ Layer 2 — Adaptive Cognitive Profiling (RL Agent)                           │
│ • The Learning Puzzle: 8 learner-controlled preference dimensions           │
│ • 81 Discrete state combinations (Highlight, Pause, Re-read, Skip rates)    │
│ • 9 Actions adapting chunk size, summaries, and visual anchors              │
│ • Strict session-end policy: telemetry never mutates profile mid-session;   │
│   manual user overrides always take absolute precedence                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Behavioral telemetry & signals
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ Layer 3 — Session Memory & Synthesis                                        │
│ • Multi-tab workspace tracking active, passive, and suspended focus         │
│ • Knowledge Gap Severity Ranking (Critical, Moderate, Minor)                │
│ • Automated 7-section Knowledge Artifact and structured study flashcards    │
│ • 100% Local-First IndexedDB storage with optional Supabase cloud sync      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ♿ Comprehensive Accessibility Suite (WCAG 2.2 AAA Target)

This companion website is built from the ground up to embody the very principles MindEase advocates:

- **Four Calibrated Themes:**
  - **Jade & Porcelain (Calm Light):** Low-glare organic sage and porcelain palette.
  - **Midnight Focus (Dark Mode):** Deep obsidian canvas reducing retinal strain.
  - **High Contrast Monochrome (WCAG AAA):** Pure black/yellow/white with $\ge 14:1$ contrast ratio.
  - **Calm Sepia:** Warms the color temperature to alleviate visual stress for readers with Scotopic Sensitivity / Irlen Syndrome and Dyslexia.
- **Typography & Sizing:**
  - Standard font: **Atkinson Hyperlegible** (developed by the Braille Institute of America for low vision).
  - Dyslexia font toggle: **Lexend** (scientifically engineered by educational researchers to reduce letter-crowding and improve saccadic pacing).
  - Scalable font sizing: 90%, 100%, 115%, 130%.
  - Expanded line and word spacing mode (1.95 line height + letter spacing).
- **Interactive Reading Ruler (Focus Guide):**
  - A horizontal tracking guide that moves with the cursor or arrow keys (<kbd>Alt+R</kbd>) to isolate lines and prevent skipping lines (crucial for ADHD and Dyslexia readers).
- **Dual-Modality Speech Narration Engine:**
  - Built-in Web Speech Synthesis reader with Play, Pause, Speed slider (0.8× to 1.5×), and section-specific triggers.
  - Real-time karaoke-style visual highlighting of the active sentence being read.
- **Ambient Focus Soundscape Generator:**
  - Zero-latency, 100% offline Web Audio API synthesizer offering Pink Noise (cognitive stabilization), Gentle Rain, and Zen Harmonic Drone.
- **Motor & Motion Accessibility:**
  - Strict keyboard accessibility: Visible high-contrast focus rings (`:focus-visible`), skip links, and full keyboard control.
  - Manual Reduced Motion toggle and automatic `prefers-reduced-motion` detection.
  - Screen reader live regions (`aria-live="polite"`) announcing all state changes.
  - Complete textual transcripts and descriptive alt text for all screenshots and Manim video clips.

---

## 🎬 Grounded Media & Video Studio

The website embeds five mathematical and conceptual Manim animations generated by MindEase, plus an onboarding walkthrough:
1. **Combinatorial Explosion in Reasoning Search** ($\mathcal{O}(b^d)$)
2. **Two Families of AI: Symbolic vs Sub-Symbolic**
3. **Markov Decision Process (MDP)** (Bellman Optimality Equations)
4. **From Language to Math: Transformer with Attention** (Scaled Dot-Product)
5. **State Space Search & Heuristics** ($A^*$ Search Pruning)
6. **MindEase Onboarding Walkthrough**

---

## 🔬 Evidence-Led Research Metrics

Audited against the code revision on 26 September 2026:
- **15,679 LOC** under `src/` across 70 TypeScript files in strict mode.
- **66 / 66** hermetic Vitest unit tests passing.
- **Dual MV3 production build** for Chrome and Firefox (3.38 MB each).
- **Shadow DOM** isolation preventing host CSS leakage.
- **Zero-credential export leaks** and sandboxed execution boundaries.

---

## 🚀 Running Locally

No dependencies required to run the static website:

```bash
# Clone the repository
git clone https://github.com/Taha2053/website-poster-ai.git
cd website-poster-ai

# Open in any browser or launch a local web server
python3 -m http.server 8080
# Visit http://localhost:8080
```

---

## 📜 License

Released under the **MIT License**.  
Designed and developed by **The Architects**, École Nationale Supérieure d'Ingénieurs de Tunis (ENSIT), for GCD4F 2026.
