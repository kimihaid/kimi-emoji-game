// Web Audio API based sound engine for generating cartoon-like emoji sounds
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentBuffer: AudioBuffer | null = null;
  private sampleRate = 44100;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7;
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }

  // Ensure audio context is resumed (required for some browsers)
  async ensureAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate basic waveforms
  generateTone(frequency: number, duration: number, waveType: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const bufferSize = Math.floor(duration * this.sampleRate);
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const time = i / this.sampleRate;
      const angle = 2 * Math.PI * frequency * time;
      
      switch (waveType) {
        case 'sine':
          data[i] = Math.sin(angle);
          break;
        case 'square':
          data[i] = Math.sin(angle) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          data[i] = 2 * (angle / (2 * Math.PI) - Math.floor(angle / (2 * Math.PI) + 0.5));
          break;
        case 'triangle':
          data[i] = 2 * Math.abs(2 * (angle / (2 * Math.PI) - Math.floor(angle / (2 * Math.PI) + 0.5))) - 1;
          break;
        default:
          data[i] = Math.sin(angle);
      }
    }
    return buffer;
  }

  // Generate white noise
  generateNoise(duration: number, intensity: number = 0.1): AudioBuffer | null {
    if (!this.audioContext) return null;

    const bufferSize = Math.floor(duration * this.sampleRate);
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * intensity;
    }
    return buffer;
  }

  // Apply envelope (ADSR)
  applyEnvelope(
    buffer: AudioBuffer, 
    attack: number = 0.01, 
    decay: number = 0.1, 
    sustain: number = 0.7, 
    release: number = 0.2
  ): AudioBuffer {
    const data = buffer.getChannelData(0);
    const length = data.length;
    const attackSamples = Math.floor(attack * this.sampleRate);
    const decaySamples = Math.floor(decay * this.sampleRate);
    const releaseSamples = Math.floor(release * this.sampleRate);
    const sustainSamples = length - attackSamples - decaySamples - releaseSamples;

    for (let i = 0; i < length; i++) {
      let envelope = 1;
      
      if (i < attackSamples) {
        // Attack phase
        envelope = i / attackSamples;
      } else if (i < attackSamples + decaySamples) {
        // Decay phase
        const decayProgress = (i - attackSamples) / decaySamples;
        envelope = 1 - decayProgress * (1 - sustain);
      } else if (i < attackSamples + decaySamples + sustainSamples) {
        // Sustain phase
        envelope = sustain;
      } else {
        // Release phase
        const releaseProgress = (i - attackSamples - decaySamples - sustainSamples) / releaseSamples;
        envelope = sustain * (1 - releaseProgress);
      }
      
      data[i] *= envelope;
    }
    return buffer;
  }

  // Combine multiple buffers
  combineBuffers(buffers: AudioBuffer[], gains?: number[]): AudioBuffer | null {
    if (!this.audioContext || buffers.length === 0) return null;
    
    const maxLength = Math.max(...buffers.map(b => b.length));
    const combined = this.audioContext.createBuffer(1, maxLength, this.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    buffers.forEach((buffer, index) => {
      const data = buffer.getChannelData(0);
      const gain = gains ? gains[index] : 1;
      
      for (let i = 0; i < data.length; i++) {
        combinedData[i] += data[i] * gain;
      }
    });
    
    return combined;
  }

  // Generate frequency sweep
  generateSweep(startFreq: number, endFreq: number, duration: number, waveType: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const bufferSize = Math.floor(duration * this.sampleRate);
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const time = i / this.sampleRate;
      const progress = time / duration;
      const frequency = startFreq + (endFreq - startFreq) * progress;
      const angle = 2 * Math.PI * frequency * time;
      
      switch (waveType) {
        case 'sine':
          data[i] = Math.sin(angle);
          break;
        case 'square':
          data[i] = Math.sin(angle) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          data[i] = 2 * (angle / (2 * Math.PI) - Math.floor(angle / (2 * Math.PI) + 0.5));
          break;
      }
    }
    return buffer;
  }

  // Play buffer
  async playBuffer(buffer: AudioBuffer): Promise<AudioBufferSourceNode | null> {
    if (!this.audioContext || !this.masterGain || !buffer) return null;

    await this.ensureAudioContext();
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start();
    
    this.currentBuffer = buffer;
    return source;
  }

  // Generate specific cartoon sounds
  generateBellSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Clear bell: fundamental + harmonics
    const fundamental = this.generateTone(800, 1.5, 'sine');
    const harmonic2 = this.generateTone(1600, 1.2, 'sine');
    const harmonic3 = this.generateTone(2400, 0.8, 'sine');
    
    if (!fundamental || !harmonic2 || !harmonic3) return null;

    const bell = this.combineBuffers([fundamental, harmonic2, harmonic3], [1, 0.5, 0.3]);
    return bell ? this.applyEnvelope(bell, 0.01, 0.3, 0.3, 1.2) : null;
  }

  generateLaughSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Silly laughter: series of quick rising tones
    const laughs: AudioBuffer[] = [];
    for (let i = 0; i < 4; i++) {
      const pitch = 300 + i * 50;
      const laugh = this.generateTone(pitch, 0.15, 'sine');
      if (laugh) {
        laughs.push(this.applyEnvelope(laugh, 0.01, 0.05, 0.8, 0.09));
      }
    }
    
    // Combine with slight delays
    const totalLength = Math.floor(1.2 * this.sampleRate);
    const combined = this.audioContext.createBuffer(1, totalLength, this.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    laughs.forEach((laugh, index) => {
      const data = laugh.getChannelData(0);
      const offset = Math.floor(index * 0.2 * this.sampleRate);
      
      for (let i = 0; i < data.length && i + offset < totalLength; i++) {
        combinedData[i + offset] += data[i] * 0.7;
      }
    });
    
    return combined;
  }

  generateCarSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Playful car honk: quick honk sound
    const base = this.generateTone(220, 0.8, 'square');
    const harmonic = this.generateTone(440, 0.6, 'sine');
    
    if (!base || !harmonic) return null;

    const car = this.combineBuffers([base, harmonic], [0.7, 0.3]);
    return car ? this.applyEnvelope(car, 0.05, 0.1, 0.9, 0.65) : null;
  }

  generateLizardSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Squeaky lizard chirp: high pitched quick chirp
    const chirp = this.generateSweep(1200, 1800, 0.3, 'sine');
    return chirp ? this.applyEnvelope(chirp, 0.01, 0.05, 0.6, 0.24) : null;
  }

  generateCatSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Soft meow: rising then falling tone
    const meow1 = this.generateSweep(300, 600, 0.4, 'sine');
    const meow2 = this.generateSweep(600, 400, 0.6, 'sine');
    
    if (!meow1 || !meow2) return null;

    const totalLength = Math.floor(1.0 * this.sampleRate);
    const combined = this.audioContext.createBuffer(1, totalLength, this.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    const data1 = meow1.getChannelData(0);
    const data2 = meow2.getChannelData(0);
    
    // First part
    for (let i = 0; i < data1.length; i++) {
      combinedData[i] = data1[i] * 0.8;
    }
    
    // Second part
    const offset = Math.floor(0.4 * this.sampleRate);
    for (let i = 0; i < data2.length && i + offset < totalLength; i++) {
      combinedData[i + offset] += data2[i] * 0.8;
    }
    
    return this.applyEnvelope(combined, 0.05, 0.1, 0.7, 0.35);
  }

  generateSparkleSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Sparkling chimes: multiple high frequencies
    const chimes: AudioBuffer[] = [];
    const frequencies = [1047, 1319, 1568, 1865]; // C6, E6, G6, Bb6
    
    frequencies.forEach((freq, index) => {
      const chime = this.generateTone(freq, 0.6, 'sine');
      if (chime) {
        chimes.push(this.applyEnvelope(chime, 0.01, 0.2, 0.4, 0.39));
      }
    });
    
    const totalLength = Math.floor(1.5 * this.sampleRate);
    const combined = this.audioContext.createBuffer(1, totalLength, this.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    chimes.forEach((chime, index) => {
      const data = chime.getChannelData(0);
      const offset = Math.floor(index * 0.1 * this.sampleRate);
      
      for (let i = 0; i < data.length && i + offset < totalLength; i++) {
        combinedData[i + offset] += data[i] * 0.6;
      }
    });
    
    return combined;
  }

  generateBoomSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Cartoon boom: low thump + noise burst
    const thump = this.generateTone(80, 0.5, 'sine');
    const noise = this.generateNoise(0.3, 0.4);
    
    if (!thump || !noise) return null;

    const boom = this.combineBuffers([thump, noise], [0.8, 0.6]);
    return boom ? this.applyEnvelope(boom, 0.01, 0.2, 0.3, 0.29) : null;
  }

  generateGenericPlayfulSound(): AudioBuffer | null {
    if (!this.audioContext) return null;

    // Generic playful sound: bouncy melody
    const notes = [523, 659, 784]; // C5, E5, G5
    const melody: AudioBuffer[] = [];
    
    notes.forEach(freq => {
      const note = this.generateTone(freq, 0.25, 'sine');
      if (note) {
        melody.push(this.applyEnvelope(note, 0.01, 0.05, 0.8, 0.19));
      }
    });
    
    const totalLength = Math.floor(1.0 * this.sampleRate);
    const combined = this.audioContext.createBuffer(1, totalLength, this.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    melody.forEach((note, index) => {
      const data = note.getChannelData(0);
      const offset = Math.floor(index * 0.3 * this.sampleRate);
      
      for (let i = 0; i < data.length && i + offset < totalLength; i++) {
        combinedData[i + offset] += data[i] * 0.7;
      }
    });
    
    return combined;
  }

  // Convert buffer to WAV blob for download
  bufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const data = buffer.getChannelData(0);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float32 to int16
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}