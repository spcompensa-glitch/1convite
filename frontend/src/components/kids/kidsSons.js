const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.15), 160);
}

export function playWrong() {
  playTone(200, 0.15, 'square', 0.1);
  setTimeout(() => playTone(180, 0.2, 'square', 0.1), 100);
}

export function playCoin() {
  playTone(988, 0.08, 'square', 0.1);
  setTimeout(() => playTone(1318, 0.12, 'square', 0.1), 80);
}

export function playLevelComplete() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.12, 'sine', 0.12), i * 80));
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.1);
}

export function playDrag() {
  playTone(440, 0.06, 'triangle', 0.08);
}

// ═══ MÚSICA DE FUNDO KIDS ═══
let bgmInterval = null;
let bgmCtx = null;
let bgmGain = null;

const KIDS_MELODY = [
  523, 587, 659, 784, 659, 587, 523, 440,
  523, 659, 784, 880, 784, 659, 523, 587,
  659, 523, 440, 523, 587, 659, 523, 440,
  523, 659, 587, 523, 440, 392, 440, 523,
];

export function startKidsBgm() {
  if (bgmInterval) return;
  bgmCtx = new (window.AudioContext || window.webkitAudioContext)();
  bgmGain = bgmCtx.createGain();
  bgmGain.gain.value = 0.04;
  bgmGain.connect(bgmCtx.destination);

  let noteIndex = 0;
  const noteLen = 0.28;

  bgmInterval = setInterval(() => {
    if (bgmCtx.state === 'suspended') bgmCtx.resume();
    const freq = KIDS_MELODY[noteIndex % KIDS_MELODY.length];
    const osc = bgmCtx.createOscillator();
    const g = bgmCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.04, bgmCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, bgmCtx.currentTime + noteLen);
    osc.connect(g);
    g.connect(bgmCtx.destination);
    osc.start();
    osc.stop(bgmCtx.currentTime + noteLen);

    // Harmônico suave (terça)
    const osc2 = bgmCtx.createOscillator();
    const g2 = bgmCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.25;
    g2.gain.setValueAtTime(0.015, bgmCtx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, bgmCtx.currentTime + noteLen);
    osc2.connect(g2);
    g2.connect(bgmCtx.destination);
    osc2.start();
    osc2.stop(bgmCtx.currentTime + noteLen);

    noteIndex++;
  }, noteLen * 1000);
}

export function stopKidsBgm() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmCtx) {
    bgmCtx.close().catch(() => {});
    bgmCtx = null;
    bgmGain = null;
  }
}
