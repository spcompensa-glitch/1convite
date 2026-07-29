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
