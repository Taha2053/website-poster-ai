/**
 * MindEase — Cognitive Accessibility Application Logic
 * Designed for GCD4F 2026 Poster Companion
 * Authors: The Architects, ENSIT
 */

(function () {
  'use strict';

  // --- State Management ---
  const state = {
    theme: localStorage.getItem('mindease-theme') || 'jade',
    font: localStorage.getItem('mindease-font') || 'standard',
    size: localStorage.getItem('mindease-size') || 'normal',
    spacing: localStorage.getItem('mindease-spacing') || 'normal',
    showAltText: localStorage.getItem('mindease-show-alt') === 'true',
    reducedMotion: localStorage.getItem('mindease-reduced-motion') === 'true',
    rulerActive: false,
    rulerY: 200,
    // Speech Synthesis State
    isSpeaking: false,
    speechRate: parseFloat(localStorage.getItem('mindease-speech-rate')) || 1.0,
    currentSpeechUtterance: null,
    speechQueue: [],
    speechIndex: 0,
    activeSpeakingElem: null,
    // Focus Soundscape State
    audioCtx: null,
    soundscapeActive: false,
    soundscapeMode: localStorage.getItem('mindease-soundscape-mode') || 'pink',
    soundNodes: null,
    // Active Video
    activeVideoTab: 'tab-v1'
  };

  // Video metadata and transcripts
  const videoData = {
    'tab-v1': {
      src: 'assets/videos/video1.mp4',
      vtt: 'assets/videos/video1.vtt',
      title: 'Combinatorial Explosion in Reasoning Search',
      topic: 'State Space & Search Complexity • Duration: 1m 13s',
      transcripts: [
        { time: '[00:00 - 00:20]', speaker: 'Narrator', text: 'When an AI explores possible choices, every decision branches into multiple next steps. In game playing, puzzle solving, and theorem proving, this branching creates a rapidly expanding tree of possibilities.' },
        { time: '[00:20 - 00:45]', speaker: 'Narrator', text: 'Mathematically, the total number of states visited scales exponentially as b raised to the power of d, written as O(b^d). Even with a modest branching factor of 3 and a depth of 20, the search space reaches over three billion distinct possibilities.' },
        { time: '[00:45 - 01:13]', speaker: 'Narrator', text: 'This is known as the combinatorial explosion. To overcome this limitation, search algorithms employ heuristic evaluations to discard unpromising trajectories, reducing exponential search complexity to a tractable, focused path toward the goal.' }
      ]
    },
    'tab-v2': {
      src: 'assets/videos/video2.mp4',
      vtt: 'assets/videos/video2.vtt',
      title: 'Two Families of AI: Symbolic vs Sub-Symbolic',
      topic: 'Logic, Rules & Neural Representations • Duration: 1m 18s',
      transcripts: [
        { time: '[00:00 - 00:25]', speaker: 'Narrator', text: 'Artificial intelligence research is anchored by two grand traditions: Symbolic AI and Sub-symbolic AI. Symbolic AI represents knowledge through explicit rules, logic, and symbols that are completely inspectable by human experts.' },
        { time: '[00:25 - 00:52]', speaker: 'Narrator', text: 'Sub-symbolic AI, powering modern deep learning and neural networks, represents concepts as high-dimensional continuous vectors and distributed weights learned from massive datasets.' },
        { time: '[00:52 - 01:18]', speaker: 'Narrator', text: 'MindEase bridges this gap for neurodivergent learners: using deep language models to understand context, while rendering explicit symbolic concept anchors, definitions, and mathematical structures in the student’s browser.' }
      ]
    },
    'tab-v3': {
      src: 'assets/videos/video3.mp4',
      vtt: 'assets/videos/video3.vtt',
      title: 'Markov Decision Process (MDP)',
      topic: 'Reinforcement Learning Dynamics • Duration: 1m 44s',
      transcripts: [
        { time: '[00:00 - 00:30]', speaker: 'Narrator', text: 'Decision making under uncertainty is formalized as a Markov Decision Process, defined by states S, actions A, transition probabilities P, rewards R, and a discount factor gamma.' },
        { time: '[00:30 - 01:05]', speaker: 'Narrator', text: 'The Markov property dictates that the future state depends solely on the current state and action, not the sequence of past states. The optimal value function satisfies the recursive Bellman Optimality Equation.' },
        { time: '[01:05 - 01:44]', speaker: 'Narrator', text: 'MindEase’s Layer 2 Q-learning architecture adopts this foundational formulation: modeling learner behavioral signals into discrete states to compute cumulative engagement rewards.' }
      ]
    },
    'tab-v4': {
      src: 'assets/videos/video4.mp4',
      vtt: 'assets/videos/video4.vtt',
      title: 'From Language to Math: Transformer with Attention',
      topic: 'Self-Attention, Vectors & Dot Products • Duration: 2m 04s',
      transcripts: [
        { time: '[00:00 - 00:35]', speaker: 'Narrator', text: 'Modern language models rely on the Transformer architecture. Instead of processing text sequentially, the Self-Attention mechanism maps input tokens into Query, Key, and Value vectors.' },
        { time: '[00:35 - 01:20]', speaker: 'Narrator', text: 'The attention weight between tokens is computed as the scaled dot-product of Query and Key, normalized through a softmax function, and scaled by the square root of the key dimension.' },
        { time: '[01:20 - 02:04]', speaker: 'Narrator', text: 'This allows the model to connect distant words across academic documents simultaneously, driving MindEase’s real-time concept extraction and semantic chunking.' }
      ]
    },
    'tab-v5': {
      src: 'assets/videos/video5.mp4',
      vtt: 'assets/videos/video5.vtt',
      title: 'State Space Search & Heuristics',
      topic: 'Graph Search & Pruning Strategies • Duration: 1m 25s',
      transcripts: [
        { time: '[00:00 - 00:28]', speaker: 'Narrator', text: 'State space search visualizes problem solving as pathfinding through a directed graph of possibilities. Every move is a transition between nodes.' },
        { time: '[00:28 - 00:58]', speaker: 'Narrator', text: 'Heuristic evaluation functions, denoted h(n), estimate remaining distance to the goal. When a heuristic is admissible, A* search guarantees finding the optimal path while exploring minimal states.' },
        { time: '[00:58 - 01:25]', speaker: 'Narrator', text: 'MindEase turns these mathematical search trees into visual diagrams, removing symbolic parsing friction for visual and neurodivergent learners.' }
      ]
    },
    'tab-onb': {
      src: 'assets/videos/onboarding_compressed.mp4',
      vtt: 'assets/videos/onboarding.vtt',
      title: 'MindEase Onboarding Walkthrough',
      topic: 'Learner Setup & Cognitive Puzzle • Duration: 35s',
      transcripts: [
        { time: '[00:00 - 00:15]', speaker: 'Demonstrator', text: 'A clean walkthrough of installing the MindEase browser extension in Firefox and opening the onboarding questionnaire.' },
        { time: '[00:15 - 00:35]', speaker: 'Demonstrator', text: 'The learner configures format preferences, pacing, section density, and activates Dyslexia and Concept Anchor accommodations in seconds without any clinical test.' }
      ]
    }
  };

  // --- Assistive Announcements ---
  function announce(message) {
    const sr = document.getElementById('sr-announcements');
    if (!sr) return;
    sr.textContent = '';
    // Small timeout ensures screen readers catch DOM mutation
    setTimeout(() => {
      sr.textContent = message;
    }, 50);
  }

  // --- Accessibility Toolbar & Preferences ---
  function applyTheme(newTheme) {
    state.theme = newTheme;
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('mindease-theme', newTheme);
    
    // Sync dropdowns
    const sel1 = document.getElementById('theme-select');
    const sel2 = document.getElementById('modal-theme-select');
    if (sel1) sel1.value = newTheme;
    if (sel2) sel2.value = newTheme;

    announce(`Color theme changed to ${newTheme.replace('-', ' ')}`);
  }

  function applyFont(newFont) {
    state.font = newFont;
    document.documentElement.dataset.font = newFont;
    localStorage.setItem('mindease-font', newFont);

    const btn = document.getElementById('btn-toggle-font');
    if (btn) {
      const isDyslexia = newFont === 'dyslexia';
      btn.setAttribute('aria-pressed', isDyslexia ? 'true' : 'false');
      btn.classList.toggle('active', isDyslexia);
    }
    const sel = document.getElementById('modal-font-select');
    if (sel) sel.value = newFont;

    announce(`Font changed to ${newFont === 'dyslexia' ? 'Dyslexia-Optimized Lexend' : 'Standard Atkinson Hyperlegible'}`);
  }

  function applySize(newSize) {
    state.size = newSize;
    document.documentElement.dataset.size = newSize;
    localStorage.setItem('mindease-size', newSize);

    const sel = document.getElementById('modal-size-select');
    if (sel) sel.value = newSize;

    announce(`Text scale set to ${newSize}`);
  }

  function applySpacing(newSpacing) {
    state.spacing = newSpacing;
    document.documentElement.dataset.spacing = newSpacing;
    localStorage.setItem('mindease-spacing', newSpacing);

    const sel = document.getElementById('modal-spacing-select');
    if (sel) sel.value = newSpacing;

    announce(`Spacing set to ${newSpacing}`);
  }

  function toggleReadingRuler(forceState) {
    state.rulerActive = forceState !== undefined ? forceState : !state.rulerActive;
    const ruler = document.getElementById('reading-ruler');
    const btn = document.getElementById('btn-toggle-ruler');
    const chk = document.getElementById('modal-ruler-toggle');

    if (ruler) {
      ruler.style.display = state.rulerActive ? 'flex' : 'none';
      ruler.setAttribute('aria-hidden', state.rulerActive ? 'false' : 'true');
    }
    if (btn) {
      btn.setAttribute('aria-pressed', state.rulerActive ? 'true' : 'false');
      btn.classList.toggle('active', state.rulerActive);
    }
    if (chk) {
      chk.checked = state.rulerActive;
    }

    announce(state.rulerActive ? 'Reading ruler enabled. Moves with cursor or arrow keys.' : 'Reading ruler disabled.');
  }

  function toggleAltText(forceState) {
    state.showAltText = forceState !== undefined ? forceState : !state.showAltText;
    document.documentElement.dataset.showAlt = state.showAltText ? 'true' : 'false';
    localStorage.setItem('mindease-show-alt', state.showAltText ? 'true' : 'false');

    const btn = document.getElementById('btn-toggle-alt');
    const chk = document.getElementById('modal-alt-toggle');

    if (btn) {
      btn.setAttribute('aria-pressed', state.showAltText ? 'true' : 'false');
      btn.classList.toggle('active', state.showAltText);
    }
    if (chk) {
      chk.checked = state.showAltText;
    }

    announce(state.showAltText ? 'Image alternative text and visual descriptions are now visible.' : 'Image alt text visibility minimized.');
  }

  function applyReducedMotion(isReduced) {
    state.reducedMotion = isReduced;
    document.body.classList.toggle('reduced-motion', isReduced);
    localStorage.setItem('mindease-reduced-motion', isReduced ? 'true' : 'false');

    const chk = document.getElementById('modal-motion-toggle');
    if (chk) chk.checked = isReduced;

    announce(isReduced ? 'Animations and transitions disabled.' : 'Animations enabled.');
  }

  // --- Reading Ruler Cursor Tracking ---
  window.addEventListener('mousemove', (e) => {
    if (!state.rulerActive) return;
    const ruler = document.getElementById('reading-ruler');
    if (ruler) {
      ruler.style.top = `${e.clientY}px`;
    }
  });

  // Keyboard navigation for reading ruler (Up/Down arrows with Shift)
  window.addEventListener('keydown', (e) => {
    if (state.rulerActive && e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const ruler = document.getElementById('reading-ruler');
      if (!ruler) return;
      const currentTop = parseInt(ruler.style.top || '200', 10);
      const delta = e.key === 'ArrowUp' ? -28 : 28;
      const newTop = Math.max(50, Math.min(window.innerHeight - 50, currentTop + delta));
      ruler.style.top = `${newTop}px`;
    }
  });

  // --- Web Speech Synthesis Engine ---
  function initSpeechEngine() {
    if (!('speechSynthesis' in window)) {
      const btn = document.getElementById('btn-speech-toggle');
      if (btn) {
        btn.disabled = true;
        btn.title = 'Speech synthesis not supported in this browser';
      }
      return;
    }

    const toggleBtn = document.getElementById('btn-speech-toggle');
    const rateSelect = document.getElementById('speech-rate');

    if (rateSelect) {
      rateSelect.value = state.speechRate.toString();
      rateSelect.addEventListener('change', (e) => {
        state.speechRate = parseFloat(e.target.value);
        localStorage.setItem('mindease-speech-rate', state.speechRate.toString());
        if (state.isSpeaking) {
          // Restart with new rate
          stopSpeech();
          startPosterSpeech();
        }
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (state.isSpeaking) {
          stopSpeech();
        } else {
          startPosterSpeech();
        }
      });
    }

    // Hero listen button
    const heroBtn = document.getElementById('btn-hero-listen');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        startPosterSpeech();
      });
    }

    // Section-specific listen buttons
    document.querySelectorAll('.btn-listen-section').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetSelector = btn.getAttribute('data-read-target');
        const targetElem = targetSelector ? document.querySelector(targetSelector) : null;
        if (!targetElem) return;

        if (state.isSpeaking && state.activeSpeakingElem === targetElem) {
          stopSpeech();
          btn.classList.remove('active-reading');
        } else {
          stopSpeech();
          speakElement(targetElem, btn);
        }
      });
    });

  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    state.speechQueue = [];
    state.speechIndex = 0;

    if (state.activeSpeakingElem) {
      state.activeSpeakingElem.classList.remove('speaking-now');
      state.activeSpeakingElem = null;
    }

    const btn = document.getElementById('btn-speech-toggle');
    const label = document.getElementById('speech-btn-label');
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('is-playing');
    }
    if (label) label.textContent = 'Listen to Poster';

    document.querySelectorAll('.btn-listen-section').forEach((b) => b.classList.remove('active-reading'));
    announce('Audio narration stopped.');
  }

  function startPosterSpeech() {
    stopSpeech();
    // Gather all major readable content on the poster
    const readTargets = [
      document.getElementById('overview'),
      document.getElementById('the-problem'),
      document.getElementById('architecture'),
      document.getElementById('verification')
    ].filter(Boolean);

    const elementsToRead = [];
    readTargets.forEach((section) => {
      const heading = section.querySelector('h1, h2');
      if (heading) elementsToRead.push(heading);
      const paragraphs = section.querySelectorAll('p, .stat-card, .barrier-card, .step-card, .evidence-card');
      paragraphs.forEach((p) => elementsToRead.push(p));
    });

    if (elementsToRead.length === 0) return;

    state.speechQueue = elementsToRead;
    state.speechIndex = 0;
    state.isSpeaking = true;

    const btn = document.getElementById('btn-speech-toggle');
    const label = document.getElementById('speech-btn-label');
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-playing');
    }
    if (label) label.textContent = 'Pause Narration';

    announce('Starting poster audio guide.');
    readNextInQueue();
  }

  function speakElement(elem, triggeringBtn) {
    stopSpeech();
    const children = elem.querySelectorAll('h1, h2, h3, p, li, blockquote');
    const items = children.length > 0 ? Array.from(children) : [elem];

    state.speechQueue = items;
    state.speechIndex = 0;
    state.isSpeaking = true;

    if (triggeringBtn) triggeringBtn.classList.add('active-reading');

    const btn = document.getElementById('btn-speech-toggle');
    const label = document.getElementById('speech-btn-label');
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-playing');
    }
    if (label) label.textContent = 'Pause Narration';

    readNextInQueue();
  }

  function readNextInQueue() {
    if (!state.isSpeaking || state.speechIndex >= state.speechQueue.length) {
      stopSpeech();
      announce('Finished audio narration.');
      return;
    }

    const currentElem = state.speechQueue[state.speechIndex];
    if (state.activeSpeakingElem) {
      state.activeSpeakingElem.classList.remove('speaking-now');
    }

    state.activeSpeakingElem = currentElem;
    currentElem.classList.add('speaking-now');
    currentElem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Extract clean text, discarding hidden tooltips or math code
    const rawText = currentElem.innerText || currentElem.textContent || '';
    const cleanText = rawText.replace(/\$\$.*?\$\$|\$.*?\$/g, ' formula ').replace(/\s+/g, ' ').trim();

    if (!cleanText) {
      state.speechIndex++;
      readNextInQueue();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = state.speechRate;
    utterance.pitch = 1.0;
    state.currentSpeechUtterance = utterance;

    utterance.onend = () => {
      currentElem.classList.remove('speaking-now');
      state.speechIndex++;
      readNextInQueue();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      currentElem.classList.remove('speaking-now');
      stopSpeech();
    };

    window.speechSynthesis.speak(utterance);
  }

  // --- Web Audio API Ambient Soundscape Generator ---
  function initSoundscape() {
    const btn = document.getElementById('btn-soundscape-toggle');
    const select = document.getElementById('soundscape-mode');

    if (select) {
      select.value = state.soundscapeMode;
      select.addEventListener('change', (e) => {
        state.soundscapeMode = e.target.value;
        localStorage.setItem('mindease-soundscape-mode', state.soundscapeMode);
        if (state.soundscapeActive) {
          stopSoundscape();
          startSoundscape();
        }
      });
    }

    if (btn) {
      btn.addEventListener('click', () => {
        if (state.soundscapeActive) {
          stopSoundscape();
        } else {
          startSoundscape();
        }
      });
    }
  }

  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        state.audioCtx = new AudioContextClass();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  function startSoundscape() {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopSoundscape();
    state.soundscapeActive = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    if (state.soundscapeMode === 'pink') {
      // Pink Noise Generator (Voss-McCartney approximation)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(600, ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(masterGain);
      whiteNoise.start(0);

      state.soundNodes = { masterGain, source: whiteNoise };
      announce('Focus pink noise activated.');

    } else if (state.soundscapeMode === 'rain') {
      // Gentle Rain: Filtered noise with soft random modulation
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.1;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1200, ctx.currentTime);
      bandpass.Q.setValueAtTime(0.7, ctx.currentTime);

      rainSource.connect(bandpass);
      bandpass.connect(masterGain);
      rainSource.start(0);

      state.soundNodes = { masterGain, source: rainSource };
      announce('Gentle rain focus sound activated.');

    } else if (state.soundscapeMode === 'drone') {
      // Zen Drone: 3 harmonics with subtle LFO
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108, ctx.currentTime); // Fundamental A2
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(162, ctx.currentTime); // Perfect 5th E3
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(216, ctx.currentTime); // Octave A3

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.connect(droneGain);
      osc2.connect(droneGain);
      osc3.connect(droneGain);
      droneGain.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      state.soundNodes = { masterGain, oscs: [osc1, osc2, osc3] };
      announce('Zen harmonic drone activated.');
    }

    const btn = document.getElementById('btn-soundscape-toggle');
    const label = document.getElementById('soundscape-btn-label');
    if (btn) {
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('active');
    }
    if (label) label.textContent = 'Mute Sound';
  }

  function stopSoundscape() {
    if (state.soundNodes && state.audioCtx) {
      try {
        state.soundNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.3);
        setTimeout(() => {
          if (state.soundNodes) {
            if (state.soundNodes.source) state.soundNodes.source.stop();
            if (state.soundNodes.oscs) state.soundNodes.oscs.forEach(o => o.stop());
            state.soundNodes = null;
          }
        }, 350);
      } catch (e) {
        // Fallback
      }
    }
    state.soundscapeActive = false;
    const btn = document.getElementById('btn-soundscape-toggle');
    const label = document.getElementById('soundscape-btn-label');
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active');
    }
    if (label) label.textContent = 'Focus Sound';
    announce('Focus soundscape muted.');
  }

  // --- Video Studio Tabs & Controller ---
  function initVideoPlayer() {
    const tabs = document.querySelectorAll('.video-tab');
    const mainVideo = document.getElementById('main-video');
    const videoSource = document.getElementById('video-source');
    const currentTitle = document.getElementById('current-video-title');
    const currentTopic = document.getElementById('current-video-topic');
    const transcriptPane = document.getElementById('video-transcript-pane');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabId = tab.id;
        const data = videoData[tabId];
        if (!data) return;

        // Update active tab styles
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update video element
        if (mainVideo && videoSource) {
          mainVideo.pause();
          videoSource.src = data.src;
          const track = document.getElementById('main-video-track');
          if (track && data.vtt) {
            track.src = data.vtt;
          }
          mainVideo.setAttribute('aria-label', `MindEase Educational Video Player: ${data.title}`);
          mainVideo.load();
        }

        // Update titles
        if (currentTitle) currentTitle.textContent = data.title;
        if (currentTopic) currentTopic.textContent = `Topic: ${data.topic}`;

        // Update transcripts
        if (transcriptPane && data.transcripts) {
          transcriptPane.innerHTML = data.transcripts.map(seg => `
            <div class="transcript-segment">
              <span class="ts-time">${seg.time}</span>
              <p class="ts-text"><strong>${seg.speaker}:</strong> "${seg.text}"</p>
            </div>
          `).join('');
        }

        announce(`Switched to video: ${data.title}`);
      });
    });
  }

  // --- Screenshot Lightbox Modal ---
  function initLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const btnClose = document.getElementById('btn-close-lightbox');

    document.querySelectorAll('.gallery-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Prevent opening if clicking on the details/summary element
        if (e.target.closest('details')) return;

        const img = card.querySelector('.gallery-img');
        const title = card.querySelector('.gallery-card-title');
        const desc = card.querySelector('.gallery-card-desc');

        if (img && lightboxModal && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption) {
            lightboxCaption.innerHTML = `<strong>${title ? title.textContent : ''}</strong> — ${desc ? desc.textContent : ''}`;
          }
          lightboxModal.style.display = 'flex';
          lightboxModal.setAttribute('aria-hidden', 'false');
          if (btnClose) btnClose.focus();
          announce(`Opened enlarged image for ${title ? title.textContent : 'screenshot'}`);
        }
      });

      // Enter key opens lightbox too
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.target.closest('details')) {
          card.click();
        }
      });
    });

    if (btnClose && lightboxModal) {
      btnClose.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
        lightboxModal.setAttribute('aria-hidden', 'true');
        announce('Closed enlarged screenshot view.');
      });
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          lightboxModal.style.display = 'none';
          lightboxModal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }


  // --- Accessibility Settings Modal Dialog ---
  function initA11yModal() {
    const btnOpen = document.getElementById('btn-open-a11y-modal');
    const modalBackdrop = document.getElementById('a11y-modal-backdrop');
    const btnClose = document.getElementById('btn-close-a11y-modal');
    const btnSave = document.getElementById('btn-save-a11y-modal');
    const btnResetAll = document.getElementById('btn-reset-a11y-all');

    // Modal controls
    const themeSel = document.getElementById('modal-theme-select');
    const fontSel = document.getElementById('modal-font-select');
    const sizeSel = document.getElementById('modal-size-select');
    const spacingSel = document.getElementById('modal-spacing-select');
    const rulerChk = document.getElementById('modal-ruler-toggle');
    const motionChk = document.getElementById('modal-motion-toggle');
    const altChk = document.getElementById('modal-alt-toggle');
    const speedSel = document.getElementById('modal-speech-speed');
    const soundSel = document.getElementById('modal-soundscape-select');

    function openModal() {
      if (!modalBackdrop) return;
      // Populate fields from current state
      if (themeSel) themeSel.value = state.theme;
      if (fontSel) fontSel.value = state.font;
      if (sizeSel) sizeSel.value = state.size;
      if (spacingSel) spacingSel.value = state.spacing;
      if (rulerChk) rulerChk.checked = state.rulerActive;
      if (motionChk) motionChk.checked = state.reducedMotion;
      if (altChk) altChk.checked = state.showAltText;
      if (speedSel) speedSel.value = state.speechRate.toString();
      if (soundSel) soundSel.value = state.soundscapeActive ? state.soundscapeMode : 'off';

      modalBackdrop.style.display = 'flex';
      modalBackdrop.setAttribute('aria-hidden', 'false');
      btnOpen.setAttribute('aria-expanded', 'true');
      if (btnClose) btnClose.focus();
      announce('Accessibility settings dialog opened.');
    }

    function closeModal() {
      if (!modalBackdrop) return;
      modalBackdrop.style.display = 'none';
      modalBackdrop.setAttribute('aria-hidden', 'true');
      btnOpen.setAttribute('aria-expanded', 'false');
      btnOpen.focus();
      announce('Accessibility settings dialog closed.');
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        if (themeSel) applyTheme(themeSel.value);
        if (fontSel) applyFont(fontSel.value);
        if (sizeSel) applySize(sizeSel.value);
        if (spacingSel) applySpacing(spacingSel.value);
        if (rulerChk) toggleReadingRuler(rulerChk.checked);
        if (altChk) toggleAltText(altChk.checked);
        if (motionChk) applyReducedMotion(motionChk.checked);
        if (speedSel) {
          state.speechRate = parseFloat(speedSel.value);
          localStorage.setItem('mindease-speech-rate', speedSel.value);
          const barSpeed = document.getElementById('speech-rate');
          if (barSpeed) barSpeed.value = speedSel.value;
        }
        if (soundSel) {
          if (soundSel.value === 'off') {
            stopSoundscape();
          } else {
            state.soundscapeMode = soundSel.value;
            localStorage.setItem('mindease-soundscape-mode', soundSel.value);
            const barSoundMode = document.getElementById('soundscape-mode');
            if (barSoundMode) barSoundMode.value = soundSel.value;
            startSoundscape();
          }
        }
        closeModal();
      });
    }

    if (btnResetAll) {
      btnResetAll.addEventListener('click', () => {
        applyTheme('jade');
        applyFont('standard');
        applySize('normal');
        applySpacing('normal');
        toggleReadingRuler(false);
        applyReducedMotion(false);
        toggleAltText(false);
        stopSpeech();
        stopSoundscape();
        closeModal();
        announce('All accessibility preferences reset to default values.');
      });
    }
  }

  // --- Keyboard Shortcuts & Esc Listener ---
  window.addEventListener('keydown', (e) => {
    // Esc closes any modal or stops speech
    if (e.key === 'Escape') {
      const modalBackdrop = document.getElementById('a11y-modal-backdrop');
      if (modalBackdrop && modalBackdrop.style.display !== 'none') {
        modalBackdrop.style.display = 'none';
        modalBackdrop.setAttribute('aria-hidden', 'true');
        return;
      }
      const lightboxModal = document.getElementById('lightbox-modal');
      if (lightboxModal && lightboxModal.style.display !== 'none') {
        lightboxModal.style.display = 'none';
        lightboxModal.setAttribute('aria-hidden', 'true');
        return;
      }
      if (state.rulerActive) {
        toggleReadingRuler(false);
        return;
      }
      if (state.isSpeaking) {
        stopSpeech();
        return;
      }
    }

    // Alt+A: Open Accessibility modal
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      const btn = document.getElementById('btn-open-a11y-modal');
      if (btn) btn.click();
    }

    // Alt+R: Toggle Reading Ruler
    if (e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      toggleReadingRuler();
    }
    // Alt+T: Toggle Alt Text / Visual Descriptions
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      toggleAltText();
    }

    // Alt+S: Toggle Speech
    if (e.altKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      const btn = document.getElementById('btn-speech-toggle');
      if (btn) btn.click();
    }
  });

  // --- KaTeX Formula Auto-Render ---
  function renderFormulas() {
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } else if (window.katex) {
      document.querySelectorAll('.math-rendered').forEach((el) => {
        const math = el.getAttribute('data-math');
        if (math) {
          try {
            window.katex.render(math, el, { throwOnError: false, displayMode: true });
          } catch (e) {
            // retain fallback text
          }
        }
      });
    }
  }

  // --- Top Toolbar Button Bindings ---
  function initToolbarButtons() {
    // Theme select
    const themeSel = document.getElementById('theme-select');
    if (themeSel) {
      themeSel.value = state.theme;
      themeSel.addEventListener('change', (e) => applyTheme(e.target.value));
    }

    // Font toggle
    const fontBtn = document.getElementById('btn-toggle-font');
    if (fontBtn) {
      fontBtn.addEventListener('click', () => {
        const next = state.font === 'dyslexia' ? 'standard' : 'dyslexia';
        applyFont(next);
      });
    }

    // Text sizing
    const btnDec = document.getElementById('btn-decrease-text');
    const btnReset = document.getElementById('btn-reset-text');
    const btnInc = document.getElementById('btn-increase-text');

    const sizeOrder = ['small', 'normal', 'large', 'xlarge'];
    if (btnDec) {
      btnDec.addEventListener('click', () => {
        const idx = sizeOrder.indexOf(state.size);
        if (idx > 0) applySize(sizeOrder[idx - 1]);
      });
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => applySize('normal'));
    }
    if (btnInc) {
      btnInc.addEventListener('click', () => {
        const idx = sizeOrder.indexOf(state.size);
        if (idx < sizeOrder.length - 1) applySize(sizeOrder[idx + 1]);
      });
    }

    // Reading ruler
    const rulerBtn = document.getElementById('btn-toggle-ruler');
    if (rulerBtn) {
      rulerBtn.addEventListener('click', () => toggleReadingRuler());
    }
    // Alt text toggle
    const altBtn = document.getElementById('btn-toggle-alt');
    if (altBtn) {
      altBtn.addEventListener('click', () => toggleAltText());
    }
  }

  // --- Initialization on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved state
    applyTheme(state.theme);
    applyFont(state.font);
    applySize(state.size);
    applySpacing(state.spacing);
    if (state.reducedMotion) applyReducedMotion(true);
    if (state.showAltText) toggleAltText(true);

    initToolbarButtons();
    initSpeechEngine();
    initSoundscape();
    initVideoPlayer();
    initLightbox();
    initA11yModal();

    // KaTeX render after brief delay
    setTimeout(renderFormulas, 400);

    // Initial greeting announcement for assistive tech
    setTimeout(() => {
      announce('MindEase poster companion loaded. Press Alt+A for accessibility settings or Alt+S for audio narration.');
    }, 1000);
  });
})();
