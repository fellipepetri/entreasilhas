// Motor de áudio náutico procedural usando Web Audio API nativo
// Gera atmosfera natural de ondas do mar, brisa e sons de gaivotas sem requisições de rede externas.

class AmbienceAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private waveGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private seagullTimer: number | null = null;

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  // Ruído rosa (pink noise) para som realista de mar/ondas
  private createPinkNoiseNode(): AudioNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);
    return whiteNoise;
  }

  public start() {
    if (typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    }

    if (this.isRunning) return;
    this.isRunning = true;

    try {
      // 1. Camada de Ondas do Mar
      const waveNoise = this.createPinkNoiseNode();
      if (waveNoise) {
        const waveFilter = this.ctx.createBiquadFilter();
        waveFilter.type = "lowpass";
        waveFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

        this.waveGain = this.ctx.createGain();
        this.waveGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

        // Modulador LFO para o vai e vem das ondas (ciclo de ~5 a 7 segundos)
        const waveLfo = this.ctx.createOscillator();
        const waveLfoGain = this.ctx.createGain();
        waveLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // ~5.5s por ciclo
        waveLfoGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

        waveLfo.connect(waveLfoGain);
        waveLfoGain.connect(this.waveGain.gain);
        waveLfo.start();

        // Modulador para abertura do filtro de espuma
        const filterLfo = this.ctx.createOscillator();
        const filterLfoGain = this.ctx.createGain();
        filterLfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
        filterLfoGain.gain.setValueAtTime(260, this.ctx.currentTime);
        filterLfo.connect(filterLfoGain);
        filterLfoGain.connect(waveFilter.frequency);
        filterLfo.start();

        waveNoise.connect(waveFilter);
        waveFilter.connect(this.waveGain);
        this.waveGain.connect(this.masterGain);
      }

      // 2. Camada de Brisa Marítima Suave
      const windNoise = this.createPinkNoiseNode();
      if (windNoise) {
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = "bandpass";
        windFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
        windFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

        this.windGain = this.ctx.createGain();
        this.windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

        const windLfo = this.ctx.createOscillator();
        const windLfoGain = this.ctx.createGain();
        windLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // ciclo lento de brisa
        windLfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        windLfo.connect(windLfoGain);
        windLfoGain.connect(this.windGain.gain);
        windLfo.start();

        windNoise.connect(windFilter);
        windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
      }

      // 3. Gaivotas ocasionais e suaves
      this.scheduleNextSeagull();
    } catch (err) {
      console.warn("Could not start procedural ambience audio", err);
    }
  }

  private scheduleNextSeagull() {
    if (!this.isRunning) return;
    const nextInterval = 12000 + Math.random() * 22000; // entre 12s e 34s
    this.seagullTimer = window.setTimeout(() => {
      this.playSeagullChirp();
      this.scheduleNextSeagull();
    }, nextInterval);
  }

  private playSeagullChirp() {
    if (!this.ctx || !this.isRunning || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(2600, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Ignorar caso contexto esteja em pausa
    }
  }

  // Efeito sonoro de descoberta de segredo (recompensa / chime brilhante)
  public playDiscoveryChime() {
    if (typeof window === "undefined") return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // Dó, Mi, Sol, Dó (arpejo límpido)

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const noteStart = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + 0.85);
      });
    } catch {
      // Ignorar
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx || !this.masterGain) {
      this.start();
      this.isMuted = false;
      return true;
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (!this.isRunning) {
      this.start();
      this.isMuted = false;
      return true;
    }

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.08);
    } else {
      this.masterGain.gain.setTargetAtTime(0.35, now, 0.08);
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isRunning && !this.isMuted;
  }

  public setVolume(volume: number) { // 0 a 1
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setTargetAtTime(clamped * 0.5, this.ctx.currentTime, 0.05);
  }

  public stop() {
    this.isRunning = false;
    if (this.seagullTimer) {
      clearTimeout(this.seagullTimer);
      this.seagullTimer = null;
    }
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public ensureStarted() {
    if (typeof window === "undefined") return;
    this.isMuted = false;
    this.start();

    if (this.ctx && this.ctx.state === "suspended") {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().then(() => {
            if (this.masterGain && this.ctx) {
              this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            }
          });
        }
        window.removeEventListener("pointerdown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("scroll", unlockAudio);
        window.removeEventListener("wheel", unlockAudio);
      };

      window.addEventListener("pointerdown", unlockAudio, { passive: true, once: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true, once: true });
      window.addEventListener("click", unlockAudio, { passive: true, once: true });
      window.addEventListener("scroll", unlockAudio, { passive: true, once: true });
      window.addEventListener("wheel", unlockAudio, { passive: true, once: true });
    }
  }
}

export const ambienceAudio = new AmbienceAudioEngine();
