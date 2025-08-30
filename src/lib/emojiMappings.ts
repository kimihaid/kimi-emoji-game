import { AudioEngine } from './audioEngine';

export type EmojiSoundGenerator = () => AudioBuffer | null;

export class EmojiSoundMapper {
  private audioEngine: AudioEngine;
  private soundCache = new Map<string, AudioBuffer | null>();
  private emojiMappings: Record<string, EmojiSoundGenerator>;
  
  // Popular emojis for the grid
  public readonly popularEmojis = [
    '🔔', '😂', '🚗', '🦎', '🐱', '✨', '💥', '🎉',
    '🐶', '🎵', '⚡', '🌊', '👏', '🍎', '📱', '⚽',
    '🚂', '🎸', '💨', '🔥', '🎯', '🦆', '📞', '🥁'
  ];

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
    
    // Define emoji categories and their sound generators
    this.emojiMappings = {
      // Animals
      '🐱': () => this.audioEngine.generateCatSound(),
      '🐶': () => this.audioEngine.generateGenericPlayfulSound(), // Bark
      '🦎': () => this.audioEngine.generateLizardSound(),
      '🐸': () => this.generateFrogSound(),
      '🐦': () => this.generateBirdSound(),
      '🐝': () => this.generateBeeSound(),
      '🐄': () => this.generateMooSound(),
      '🐷': () => this.generateOinkSound(),
      '🐭': () => this.generateSqueakSound(),
      '🦆': () => this.generateQuackSound(),
      
      // Vehicles & Transportation
      '🚗': () => this.audioEngine.generateCarSound(),
      '🚂': () => this.generateTrainSound(),
      '✈️': () => this.generatePlaneSound(),
      '🚁': () => this.generateHelicopterSound(),
      '🚴': () => this.generateBicycleSound(),
      '🛵': () => this.generateScooterSound(),
      
      // Objects & Tools
      '🔔': () => this.audioEngine.generateBellSound(),
      '📞': () => this.generatePhoneSound(),
      '⏰': () => this.generateAlarmSound(),
      '🎵': () => this.generateMusicSound(),
      '🎸': () => this.generateGuitarSound(),
      '🥁': () => this.generateDrumSound(),
      '🎹': () => this.generatePianoSound(),
      '📢': () => this.generateMegaphoneSound(),
      
      // Emotions & Faces
      '😂': () => this.audioEngine.generateLaughSound(),
      '😭': () => this.generateCrySound(),
      '😴': () => this.generateSnoreSound(),
      '🤧': () => this.generateSneezeSound(),
      '😱': () => this.generateScreamSound(),
      '🥱': () => this.generateYawnSound(),
      '😋': () => this.generateYumSound(),
      
      // Nature & Weather
      '⚡': () => this.generateThunderSound(),
      '🌧️': () => this.generateRainSound(),
      '💨': () => this.generateWindSound(),
      '🌊': () => this.generateWaveSound(),
      '🔥': () => this.generateFireSound(),
      '❄️': () => this.generateIceSound(),
      
      // Actions & Effects
      '💥': () => this.audioEngine.generateBoomSound(),
      '✨': () => this.audioEngine.generateSparkleSound(),
      '💫': () => this.generateTwinkleSound(),
      '🎉': () => this.generateCelebrationSound(),
      '👏': () => this.generateClapSound(),
      '💃': () => this.generateDanceSound(),
      '🏃': () => this.generateRunningSound(),
      
      // Food & Drinks
      '🍎': () => this.generateCrunchSound(),
      '🥤': () => this.generateSlurpSound(),
      '🍕': () => this.generateNomSound(),
      '🍯': () => this.generateStickySound(),
      '🥛': () => this.generateGulpSound(),
      '🍿': () => this.generatePopSound(),
      
      // Technology
      '💻': () => this.generateTypingSound(),
      '📱': () => this.generateNotificationSound(),
      '📷': () => this.generateCameraSound(),
      '🖨️': () => this.generatePrinterSound(),
      
      // Games & Sports
      '⚽': () => this.generateKickSound(),
      '🏀': () => this.generateBounceSound(),
      '🎯': () => this.generateTargetSound(),
      '🎲': () => this.generateDiceSound(),
      '🃏': () => this.generateCardSound(),
      
      // Miscellaneous
      '🧩': () => this.generatePuzzleSound(),
      '🎁': () => this.generateUnwrapSound(),
      '🔑': () => this.generateKeySound(),
      '🗝️': () => this.generateOldKeySound(),
      '💍': () => this.generateBlingSound(),
      '👑': () => this.generateRegalSound()
    };
  }

  // Get sound for any emoji
  getSoundForEmoji(emoji: string): AudioBuffer | null {
    // Check cache first
    if (this.soundCache.has(emoji)) {
      return this.soundCache.get(emoji) || null;
    }

    // Generate sound
    let soundBuffer: AudioBuffer | null;
    if (this.emojiMappings[emoji]) {
      soundBuffer = this.emojiMappings[emoji]();
    } else {
      // Generate generic playful sound for unknown emojis
      soundBuffer = this.audioEngine.generateGenericPlayfulSound();
    }

    // Cache the result
    this.soundCache.set(emoji, soundBuffer);
    return soundBuffer;
  }

  // Additional sound generators for specific emojis
  private generateFrogSound(): AudioBuffer | null {
    const croak = this.audioEngine.generateSweep(200, 150, 0.4, 'square');
    return croak ? this.audioEngine.applyEnvelope(croak, 0.05, 0.1, 0.8, 0.25) : null;
  }

  private generateBirdSound(): AudioBuffer | null {
    const chirp1 = this.audioEngine.generateSweep(2000, 3000, 0.2, 'sine');
    const chirp2 = this.audioEngine.generateSweep(2500, 3500, 0.15, 'sine');
    
    if (!chirp1 || !chirp2 || !this.audioEngine.audioContext) return null;

    const totalLength = Math.floor(0.8 * this.audioEngine.sampleRate);
    const combined = this.audioEngine.audioContext.createBuffer(1, totalLength, this.audioEngine.sampleRate);
    const combinedData = combined.getChannelData(0);
    
    const data1 = chirp1.getChannelData(0);
    const data2 = chirp2.getChannelData(0);
    
    for (let i = 0; i < data1.length; i++) {
      combinedData[i] = data1[i] * 0.6;
    }
    
    const offset = Math.floor(0.3 * this.audioEngine.sampleRate);
    for (let i = 0; i < data2.length && i + offset < totalLength; i++) {
      combinedData[i + offset] += data2[i] * 0.6;
    }
    
    return combined;
  }

  private generateBeeSound(): AudioBuffer | null {
    const buzz = this.audioEngine.generateTone(350, 1.0, 'sawtooth');
    return buzz ? this.audioEngine.applyEnvelope(buzz, 0.1, 0.2, 0.9, 0.7) : null;
  }

  private generateMooSound(): AudioBuffer | null {
    const moo = this.audioEngine.generateSweep(150, 100, 1.2, 'square');
    return moo ? this.audioEngine.applyEnvelope(moo, 0.2, 0.3, 0.8, 0.7) : null;
  }

  private generateOinkSound(): AudioBuffer | null {
    const oink = this.audioEngine.generateTone(400, 0.3, 'square');
    return oink ? this.audioEngine.applyEnvelope(oink, 0.01, 0.05, 0.9, 0.24) : null;
  }

  private generateSqueakSound(): AudioBuffer | null {
    const squeak = this.audioEngine.generateSweep(1500, 2000, 0.2, 'sine');
    return squeak ? this.audioEngine.applyEnvelope(squeak, 0.01, 0.02, 0.8, 0.17) : null;
  }

  private generateQuackSound(): AudioBuffer | null {
    const quack = this.audioEngine.generateTone(300, 0.4, 'square');
    return quack ? this.audioEngine.applyEnvelope(quack, 0.02, 0.08, 0.7, 0.3) : null;
  }

  private generateTrainSound(): AudioBuffer | null {
    const whistle = this.audioEngine.generateTone(800, 1.5, 'sine');
    return whistle ? this.audioEngine.applyEnvelope(whistle, 0.3, 0.2, 0.8, 0.8) : null;
  }

  private generatePlaneSound(): AudioBuffer | null {
    const engine = this.audioEngine.generateTone(200, 2.0, 'sawtooth');
    return engine ? this.audioEngine.applyEnvelope(engine, 0.5, 0.3, 0.9, 1.2) : null;
  }

  private generateHelicopterSound(): AudioBuffer | null {
    const rotor = this.audioEngine.generateTone(120, 1.5, 'square');
    return rotor ? this.audioEngine.applyEnvelope(rotor, 0.2, 0.1, 0.9, 1.2) : null;
  }

  private generateBicycleSound(): AudioBuffer | null {
    const bell = this.audioEngine.generateTone(1200, 0.5, 'sine');
    return bell ? this.audioEngine.applyEnvelope(bell, 0.01, 0.1, 0.6, 0.39) : null;
  }

  private generateScooterSound(): AudioBuffer | null {
    const buzz = this.audioEngine.generateTone(180, 1.0, 'sawtooth');
    return buzz ? this.audioEngine.applyEnvelope(buzz, 0.1, 0.2, 0.8, 0.7) : null;
  }

  private generatePhoneSound(): AudioBuffer | null {
    const ring1 = this.audioEngine.generateTone(800, 0.5, 'sine');
    const ring2 = this.audioEngine.generateTone(1000, 0.4, 'sine');
    
    if (!ring1 || !ring2) return null;

    const combined = this.audioEngine.combineBuffers([ring1, ring2], [0.7, 0.5]);
    return combined ? this.audioEngine.applyEnvelope(combined, 0.01, 0.1, 0.8, 0.39) : null;
  }

  private generateAlarmSound(): AudioBuffer | null {
    const alarm = this.audioEngine.generateTone(1000, 1.0, 'square');
    return alarm ? this.audioEngine.applyEnvelope(alarm, 0.01, 0.05, 0.9, 0.94) : null;
  }

  private generateMusicSound(): AudioBuffer | null {
    const chord = [523, 659, 784]; // C major chord
    const notes = chord.map(freq => this.audioEngine.generateTone(freq, 1.0, 'sine')).filter(Boolean) as AudioBuffer[];
    
    if (notes.length === 0) return null;

    const combined = this.audioEngine.combineBuffers(notes, [0.5, 0.5, 0.5]);
    return combined ? this.audioEngine.applyEnvelope(combined, 0.05, 0.2, 0.7, 0.73) : null;
  }

  private generateGuitarSound(): AudioBuffer | null {
    const strum = this.audioEngine.generateTone(330, 1.2, 'sawtooth');
    return strum ? this.audioEngine.applyEnvelope(strum, 0.01, 0.3, 0.6, 0.89) : null;
  }

  private generateDrumSound(): AudioBuffer | null {
    const kick = this.audioEngine.generateTone(60, 0.3, 'sine');
    const noise = this.audioEngine.generateNoise(0.1, 0.3);
    
    if (!kick || !noise) return null;

    const drum = this.audioEngine.combineBuffers([kick, noise], [0.8, 0.4]);
    return drum ? this.audioEngine.applyEnvelope(drum, 0.01, 0.05, 0.3, 0.24) : null;
  }

  private generatePianoSound(): AudioBuffer | null {
    const note = this.audioEngine.generateTone(523, 1.5, 'sine'); // C5
    return note ? this.audioEngine.applyEnvelope(note, 0.01, 0.3, 0.5, 1.19) : null;
  }

  private generateMegaphoneSound(): AudioBuffer | null {
    const voice = this.audioEngine.generateTone(400, 0.8, 'square');
    return voice ? this.audioEngine.applyEnvelope(voice, 0.05, 0.1, 0.9, 0.65) : null;
  }

  private generateCrySound(): AudioBuffer | null {
    const sob = this.audioEngine.generateSweep(400, 200, 1.0, 'sine');
    return sob ? this.audioEngine.applyEnvelope(sob, 0.2, 0.3, 0.8, 0.5) : null;
  }

  private generateSnoreSound(): AudioBuffer | null {
    const snore = this.audioEngine.generateTone(80, 1.5, 'sawtooth');
    return snore ? this.audioEngine.applyEnvelope(snore, 0.3, 0.2, 0.9, 1.0) : null;
  }

  private generateSneezeSound(): AudioBuffer | null {
    const sneeze = this.audioEngine.generateNoise(0.3, 0.8);
    return sneeze ? this.audioEngine.applyEnvelope(sneeze, 0.01, 0.05, 0.8, 0.24) : null;
  }

  private generateScreamSound(): AudioBuffer | null {
    const scream = this.audioEngine.generateSweep(800, 1200, 0.8, 'sawtooth');
    return scream ? this.audioEngine.applyEnvelope(scream, 0.01, 0.1, 0.9, 0.69) : null;
  }

  private generateYawnSound(): AudioBuffer | null {
    const yawn = this.audioEngine.generateSweep(300, 150, 1.5, 'sine');
    return yawn ? this.audioEngine.applyEnvelope(yawn, 0.3, 0.5, 0.8, 0.7) : null;
  }

  private generateYumSound(): AudioBuffer | null {
    const yum = this.audioEngine.generateTone(500, 0.6, 'sine');
    return yum ? this.audioEngine.applyEnvelope(yum, 0.05, 0.1, 0.8, 0.45) : null;
  }

  private generateThunderSound(): AudioBuffer | null {
    const thunder = this.audioEngine.generateNoise(2.0, 0.9);
    return thunder ? this.audioEngine.applyEnvelope(thunder, 0.01, 0.5, 0.7, 1.49) : null;
  }

  private generateRainSound(): AudioBuffer | null {
    const rain = this.audioEngine.generateNoise(2.0, 0.3);
    return rain ? this.audioEngine.applyEnvelope(rain, 0.5, 0.2, 0.9, 1.3) : null;
  }

  private generateWindSound(): AudioBuffer | null {
    const wind = this.audioEngine.generateNoise(1.5, 0.5);
    return wind ? this.audioEngine.applyEnvelope(wind, 0.3, 0.2, 0.8, 1.0) : null;
  }

  private generateWaveSound(): AudioBuffer | null {
    const wave = this.audioEngine.generateSweep(200, 100, 2.0, 'sine');
    return wave ? this.audioEngine.applyEnvelope(wave, 0.3, 0.5, 0.8, 1.2) : null;
  }

  private generateFireSound(): AudioBuffer | null {
    const crackle = this.audioEngine.generateNoise(1.5, 0.4);
    return crackle ? this.audioEngine.applyEnvelope(crackle, 0.2, 0.3, 0.8, 1.0) : null;
  }

  private generateIceSound(): AudioBuffer | null {
    const tinkle = this.audioEngine.generateTone(2000, 0.8, 'sine');
    return tinkle ? this.audioEngine.applyEnvelope(tinkle, 0.01, 0.2, 0.4, 0.59) : null;
  }

  private generateTwinkleSound(): AudioBuffer | null {
    const twinkle = this.audioEngine.generateSweep(1500, 2500, 0.8, 'sine');
    return twinkle ? this.audioEngine.applyEnvelope(twinkle, 0.01, 0.2, 0.5, 0.59) : null;
  }

  private generateCelebrationSound(): AudioBuffer | null {
    // Party horn sound
    const horn = this.audioEngine.generateSweep(400, 800, 1.0, 'sawtooth');
    return horn ? this.audioEngine.applyEnvelope(horn, 0.01, 0.1, 0.8, 0.89) : null;
  }

  private generateClapSound(): AudioBuffer | null {
    const clap = this.audioEngine.generateNoise(0.1, 0.8);
    return clap ? this.audioEngine.applyEnvelope(clap, 0.01, 0.02, 0.5, 0.07) : null;
  }

  private generateDanceSound(): AudioBuffer | null {
    const beat = this.audioEngine.generateTone(120, 1.0, 'square');
    return beat ? this.audioEngine.applyEnvelope(beat, 0.01, 0.1, 0.8, 0.89) : null;
  }

  private generateRunningSound(): AudioBuffer | null {
    const steps = this.audioEngine.generateNoise(0.8, 0.3);
    return steps ? this.audioEngine.applyEnvelope(steps, 0.05, 0.1, 0.7, 0.65) : null;
  }

  private generateCrunchSound(): AudioBuffer | null {
    const crunch = this.audioEngine.generateNoise(0.4, 0.6);
    return crunch ? this.audioEngine.applyEnvelope(crunch, 0.01, 0.08, 0.6, 0.31) : null;
  }

  private generateSlurpSound(): AudioBuffer | null {
    const slurp = this.audioEngine.generateSweep(300, 150, 0.8, 'sawtooth');
    return slurp ? this.audioEngine.applyEnvelope(slurp, 0.05, 0.2, 0.8, 0.55) : null;
  }

  private generateNomSound(): AudioBuffer | null {
    const nom = this.audioEngine.generateTone(250, 0.3, 'square');
    return nom ? this.audioEngine.applyEnvelope(nom, 0.01, 0.05, 0.8, 0.24) : null;
  }

  private generateStickySound(): AudioBuffer | null {
    const sticky = this.audioEngine.generateSweep(150, 300, 0.6, 'sine');
    return sticky ? this.audioEngine.applyEnvelope(sticky, 0.1, 0.2, 0.8, 0.3) : null;
  }

  private generateGulpSound(): AudioBuffer | null {
    const gulp = this.audioEngine.generateSweep(400, 200, 0.5, 'sine');
    return gulp ? this.audioEngine.applyEnvelope(gulp, 0.05, 0.1, 0.7, 0.35) : null;
  }

  private generatePopSound(): AudioBuffer | null {
    const pop = this.audioEngine.generateTone(800, 0.1, 'square');
    return pop ? this.audioEngine.applyEnvelope(pop, 0.01, 0.02, 0.8, 0.07) : null;
  }

  private generateTypingSound(): AudioBuffer | null {
    const click = this.audioEngine.generateTone(1200, 0.05, 'square');
    return click ? this.audioEngine.applyEnvelope(click, 0.01, 0.01, 0.8, 0.03) : null;
  }

  private generateNotificationSound(): AudioBuffer | null {
    const ding = this.audioEngine.generateTone(1000, 0.3, 'sine');
    return ding ? this.audioEngine.applyEnvelope(ding, 0.01, 0.05, 0.7, 0.24) : null;
  }

  private generateCameraSound(): AudioBuffer | null {
    const shutter = this.audioEngine.generateNoise(0.1, 0.5);
    return shutter ? this.audioEngine.applyEnvelope(shutter, 0.01, 0.02, 0.8, 0.07) : null;
  }

  private generatePrinterSound(): AudioBuffer | null {
    const buzz = this.audioEngine.generateTone(300, 1.0, 'square');
    return buzz ? this.audioEngine.applyEnvelope(buzz, 0.1, 0.1, 0.8, 0.8) : null;
  }

  private generateKickSound(): AudioBuffer | null {
    const kick = this.audioEngine.generateTone(80, 0.3, 'sine');
    return kick ? this.audioEngine.applyEnvelope(kick, 0.01, 0.05, 0.6, 0.24) : null;
  }

  private generateBounceSound(): AudioBuffer | null {
    const bounce = this.audioEngine.generateSweep(400, 200, 0.3, 'sine');
    return bounce ? this.audioEngine.applyEnvelope(bounce, 0.01, 0.05, 0.7, 0.24) : null;
  }

  private generateTargetSound(): AudioBuffer | null {
    const hit = this.audioEngine.generateTone(1500, 0.2, 'sine');
    return hit ? this.audioEngine.applyEnvelope(hit, 0.01, 0.03, 0.8, 0.16) : null;
  }

  private generateDiceSound(): AudioBuffer | null {
    const rattle = this.audioEngine.generateNoise(0.5, 0.4);
    return rattle ? this.audioEngine.applyEnvelope(rattle, 0.05, 0.1, 0.7, 0.35) : null;
  }

  private generateCardSound(): AudioBuffer | null {
    const flip = this.audioEngine.generateNoise(0.1, 0.3);
    return flip ? this.audioEngine.applyEnvelope(flip, 0.01, 0.02, 0.8, 0.07) : null;
  }

  private generatePuzzleSound(): AudioBuffer | null {
    const click = this.audioEngine.generateTone(800, 0.2, 'sine');
    return click ? this.audioEngine.applyEnvelope(click, 0.01, 0.03, 0.7, 0.16) : null;
  }

  private generateUnwrapSound(): AudioBuffer | null {
    const rustle = this.audioEngine.generateNoise(0.8, 0.4);
    return rustle ? this.audioEngine.applyEnvelope(rustle, 0.05, 0.2, 0.7, 0.55) : null;
  }

  private generateKeySound(): AudioBuffer | null {
    const jingle = this.audioEngine.generateTone(1200, 0.4, 'sine');
    return jingle ? this.audioEngine.applyEnvelope(jingle, 0.01, 0.05, 0.6, 0.34) : null;
  }

  private generateOldKeySound(): AudioBuffer | null {
    const creak = this.audioEngine.generateTone(200, 0.8, 'sawtooth');
    return creak ? this.audioEngine.applyEnvelope(creak, 0.05, 0.2, 0.8, 0.55) : null;
  }

  private generateBlingSound(): AudioBuffer | null {
    const shine = this.audioEngine.generateSweep(1500, 3000, 0.6, 'sine');
    return shine ? this.audioEngine.applyEnvelope(shine, 0.01, 0.1, 0.5, 0.49) : null;
  }

  private generateRegalSound(): AudioBuffer | null {
    const fanfare = this.audioEngine.generateTone(523, 1.0, 'sine'); // C5
    return fanfare ? this.audioEngine.applyEnvelope(fanfare, 0.1, 0.2, 0.8, 0.7) : null;
  }

  // Get list of popular emojis for the UI
  getPopularEmojis(): string[] {
    return this.popularEmojis;
  }

  // Clear sound cache
  clearCache(): void {
    this.soundCache.clear();
  }
}