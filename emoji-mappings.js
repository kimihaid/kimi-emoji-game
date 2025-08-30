// Emoji to sound mapping system
class EmojiSoundMapper {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.soundCache = new Map();
        
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
            '⚡': () => this.generateElectricSound(),
            
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
        
        // Popular emojis for the grid
        this.popularEmojis = [
            '🔔', '😂', '🚗', '🦎', '🐱', '✨', '💥', '🎉',
            '🐶', '🎵', '⚡', '🌊', '👏', '🍎', '📱', '⚽',
            '🚂', '🎸', '💨', '🔥', '🎯', '🦆', '📞', '🥁'
        ];
    }

    // Get sound for any emoji
    getSoundForEmoji(emoji) {
        // Check cache first
        if (this.soundCache.has(emoji)) {
            return this.soundCache.get(emoji);
        }

        // Generate sound
        let soundBuffer;
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
    generateFrogSound() {
        const croak = this.audioEngine.generateSweep(200, 150, 0.4, 'square');
        return this.audioEngine.applyEnvelope(croak, 0.05, 0.1, 0.8, 0.25);
    }

    generateBirdSound() {
        const chirp1 = this.audioEngine.generateSweep(2000, 3000, 0.2, 'sine');
        const chirp2 = this.audioEngine.generateSweep(2500, 3500, 0.15, 'sine');
        
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

    generateBeeSound() {
        const buzz = this.audioEngine.generateTone(350, 1.0, 'sawtooth');
        return this.audioEngine.applyEnvelope(buzz, 0.1, 0.2, 0.9, 0.7);
    }

    generateMooSound() {
        const moo = this.audioEngine.generateSweep(150, 100, 1.2, 'square');
        return this.audioEngine.applyEnvelope(moo, 0.2, 0.3, 0.8, 0.7);
    }

    generateOinkSound() {
        const oink = this.audioEngine.generateTone(400, 0.3, 'square');
        return this.audioEngine.applyEnvelope(oink, 0.01, 0.05, 0.9, 0.24);
    }

    generateSqueakSound() {
        const squeak = this.audioEngine.generateSweep(1500, 2000, 0.2, 'sine');
        return this.audioEngine.applyEnvelope(squeak, 0.01, 0.02, 0.8, 0.17);
    }

    generateQuackSound() {
        const quack = this.audioEngine.generateTone(300, 0.4, 'square');
        return this.audioEngine.applyEnvelope(quack, 0.02, 0.08, 0.7, 0.3);
    }

    generateTrainSound() {
        const whistle = this.audioEngine.generateTone(800, 1.5, 'sine');
        return this.audioEngine.applyEnvelope(whistle, 0.3, 0.2, 0.8, 0.8);
    }

    generatePlaneSound() {
        const engine = this.audioEngine.generateTone(200, 2.0, 'sawtooth');
        return this.audioEngine.applyEnvelope(engine, 0.5, 0.3, 0.9, 1.2);
    }

    generateHelicopterSound() {
        const rotor = this.audioEngine.generateTone(120, 1.5, 'square');
        return this.audioEngine.applyEnvelope(rotor, 0.2, 0.1, 0.9, 1.2);
    }

    generateBicycleSound() {
        const bell = this.audioEngine.generateTone(1200, 0.5, 'sine');
        return this.audioEngine.applyEnvelope(bell, 0.01, 0.1, 0.6, 0.39);
    }

    generateScooterSound() {
        const buzz = this.audioEngine.generateTone(180, 1.0, 'sawtooth');
        return this.audioEngine.applyEnvelope(buzz, 0.1, 0.2, 0.8, 0.7);
    }

    generatePhoneSound() {
        const ring1 = this.audioEngine.generateTone(800, 0.5, 'sine');
        const ring2 = this.audioEngine.generateTone(1000, 0.4, 'sine');
        
        const combined = this.audioEngine.combineBuffers([ring1, ring2], [0.7, 0.5]);
        return this.audioEngine.applyEnvelope(combined, 0.01, 0.1, 0.8, 0.39);
    }

    generateAlarmSound() {
        const alarm = this.audioEngine.generateTone(1000, 1.0, 'square');
        return this.audioEngine.applyEnvelope(alarm, 0.01, 0.05, 0.9, 0.94);
    }

    generateMusicSound() {
        const chord = [523, 659, 784]; // C major chord
        const notes = chord.map(freq => this.audioEngine.generateTone(freq, 1.0, 'sine'));
        
        const combined = this.audioEngine.combineBuffers(notes, [0.5, 0.5, 0.5]);
        return this.audioEngine.applyEnvelope(combined, 0.05, 0.2, 0.7, 0.73);
    }

    generateGuitarSound() {
        const strum = this.audioEngine.generateTone(330, 1.2, 'sawtooth');
        return this.audioEngine.applyEnvelope(strum, 0.01, 0.3, 0.6, 0.89);
    }

    generateDrumSound() {
        const kick = this.audioEngine.generateTone(60, 0.3, 'sine');
        const noise = this.audioEngine.generateNoise(0.1, 0.3);
        
        const drum = this.audioEngine.combineBuffers([kick, noise], [0.8, 0.4]);
        return this.audioEngine.applyEnvelope(drum, 0.01, 0.05, 0.3, 0.24);
    }

    generatePianoSound() {
        const note = this.audioEngine.generateTone(523, 1.5, 'sine'); // C5
        return this.audioEngine.applyEnvelope(note, 0.01, 0.3, 0.5, 1.19);
    }

    generateMegaphoneSound() {
        const voice = this.audioEngine.generateTone(400, 0.8, 'square');
        return this.audioEngine.applyEnvelope(voice, 0.05, 0.1, 0.9, 0.65);
    }

    generateCrySound() {
        const sob = this.audioEngine.generateSweep(400, 200, 1.0, 'sine');
        return this.audioEngine.applyEnvelope(sob, 0.2, 0.3, 0.8, 0.5);
    }

    generateSnoreSound() {
        const snore = this.audioEngine.generateTone(80, 1.5, 'sawtooth');
        return this.audioEngine.applyEnvelope(snore, 0.3, 0.2, 0.9, 1.0);
    }

    generateSneezeSound() {
        const sneeze = this.audioEngine.generateNoise(0.3, 0.8);
        return this.audioEngine.applyEnvelope(sneeze, 0.01, 0.05, 0.8, 0.24);
    }

    generateScreamSound() {
        const scream = this.audioEngine.generateSweep(800, 1200, 0.8, 'sawtooth');
        return this.audioEngine.applyEnvelope(scream, 0.01, 0.1, 0.9, 0.69);
    }

    generateYawnSound() {
        const yawn = this.audioEngine.generateSweep(300, 150, 1.5, 'sine');
        return this.audioEngine.applyEnvelope(yawn, 0.3, 0.5, 0.8, 0.7);
    }

    generateYumSound() {
        const yum = this.audioEngine.generateTone(500, 0.6, 'sine');
        return this.audioEngine.applyEnvelope(yum, 0.05, 0.1, 0.8, 0.45);
    }

    generateThunderSound() {
        const thunder = this.audioEngine.generateNoise(2.0, 0.9);
        return this.audioEngine.applyEnvelope(thunder, 0.01, 0.5, 0.7, 1.49);
    }

    generateRainSound() {
        const rain = this.audioEngine.generateNoise(2.0, 0.3);
        return this.audioEngine.applyEnvelope(rain, 0.5, 0.2, 0.9, 1.3);
    }

    generateWindSound() {
        const wind = this.audioEngine.generateNoise(1.5, 0.5);
        return this.audioEngine.applyEnvelope(wind, 0.3, 0.2, 0.8, 1.0);
    }

    generateWaveSound() {
        const wave = this.audioEngine.generateSweep(200, 100, 2.0, 'sine');
        return this.audioEngine.applyEnvelope(wave, 0.3, 0.5, 0.8, 1.2);
    }

    generateFireSound() {
        const crackle = this.audioEngine.generateNoise(1.5, 0.4);
        return this.audioEngine.applyEnvelope(crackle, 0.2, 0.3, 0.8, 1.0);
    }

    generateIceSound() {
        const tinkle = this.audioEngine.generateTone(2000, 0.8, 'sine');
        return this.audioEngine.applyEnvelope(tinkle, 0.01, 0.2, 0.4, 0.59);
    }

    generateTwinkleSound() {
        const twinkle = this.audioEngine.generateSweep(1500, 2500, 0.8, 'sine');
        return this.audioEngine.applyEnvelope(twinkle, 0.01, 0.2, 0.5, 0.59);
    }

    generateCelebrationSound() {
        // Party horn sound
        const horn = this.audioEngine.generateSweep(400, 800, 1.0, 'sawtooth');
        return this.audioEngine.applyEnvelope(horn, 0.01, 0.1, 0.8, 0.89);
    }

    generateClapSound() {
        const clap = this.audioEngine.generateNoise(0.1, 0.8);
        return this.audioEngine.applyEnvelope(clap, 0.01, 0.02, 0.5, 0.07);
    }

    generateDanceSound() {
        const beat = this.audioEngine.generateTone(120, 1.0, 'square');
        return this.audioEngine.applyEnvelope(beat, 0.01, 0.1, 0.8, 0.89);
    }

    generateRunningSound() {
        const steps = this.audioEngine.generateNoise(0.8, 0.3);
        return this.audioEngine.applyEnvelope(steps, 0.05, 0.1, 0.7, 0.65);
    }

    generateCrunchSound() {
        const crunch = this.audioEngine.generateNoise(0.4, 0.6);
        return this.audioEngine.applyEnvelope(crunch, 0.01, 0.08, 0.6, 0.31);
    }

    generateSlurpSound() {
        const slurp = this.audioEngine.generateSweep(300, 150, 0.8, 'sawtooth');
        return this.audioEngine.applyEnvelope(slurp, 0.05, 0.2, 0.8, 0.55);
    }

    generateNomSound() {
        const nom = this.audioEngine.generateTone(250, 0.3, 'square');
        return this.audioEngine.applyEnvelope(nom, 0.01, 0.05, 0.8, 0.24);
    }

    generateStickySound() {
        const sticky = this.audioEngine.generateSweep(150, 300, 0.6, 'sine');
        return this.audioEngine.applyEnvelope(sticky, 0.1, 0.2, 0.8, 0.3);
    }

    generateGulpSound() {
        const gulp = this.audioEngine.generateSweep(400, 200, 0.5, 'sine');
        return this.audioEngine.applyEnvelope(gulp, 0.05, 0.1, 0.7, 0.35);
    }

    generatePopSound() {
        const pop = this.audioEngine.generateTone(800, 0.1, 'square');
        return this.audioEngine.applyEnvelope(pop, 0.01, 0.02, 0.8, 0.07);
    }

    generateTypingSound() {
        const click = this.audioEngine.generateTone(1200, 0.05, 'square');
        return this.audioEngine.applyEnvelope(click, 0.01, 0.01, 0.8, 0.03);
    }

    generateNotificationSound() {
        const ding = this.audioEngine.generateTone(1000, 0.3, 'sine');
        return this.audioEngine.applyEnvelope(ding, 0.01, 0.05, 0.7, 0.24);
    }

    generateCameraSound() {
        const shutter = this.audioEngine.generateNoise(0.1, 0.5);
        return this.audioEngine.applyEnvelope(shutter, 0.01, 0.02, 0.8, 0.07);
    }

    generatePrinterSound() {
        const buzz = this.audioEngine.generateTone(300, 1.0, 'square');
        return this.audioEngine.applyEnvelope(buzz, 0.1, 0.1, 0.8, 0.8);
    }

    generateElectricSound() {
        const zap = this.audioEngine.generateNoise(0.2, 0.8);
        return this.audioEngine.applyEnvelope(zap, 0.01, 0.03, 0.7, 0.16);
    }

    generateKickSound() {
        const kick = this.audioEngine.generateTone(80, 0.3, 'sine');
        return this.audioEngine.applyEnvelope(kick, 0.01, 0.05, 0.6, 0.24);
    }

    generateBounceSound() {
        const bounce = this.audioEngine.generateSweep(400, 200, 0.3, 'sine');
        return this.audioEngine.applyEnvelope(bounce, 0.01, 0.05, 0.7, 0.24);
    }

    generateTargetSound() {
        const hit = this.audioEngine.generateTone(1500, 0.2, 'sine');
        return this.audioEngine.applyEnvelope(hit, 0.01, 0.03, 0.8, 0.16);
    }

    generateDiceSound() {
        const rattle = this.audioEngine.generateNoise(0.5, 0.4);
        return this.audioEngine.applyEnvelope(rattle, 0.05, 0.1, 0.7, 0.35);
    }

    generateCardSound() {
        const flip = this.audioEngine.generateNoise(0.1, 0.3);
        return this.audioEngine.applyEnvelope(flip, 0.01, 0.02, 0.8, 0.07);
    }

    generatePuzzleSound() {
        const click = this.audioEngine.generateTone(800, 0.2, 'sine');
        return this.audioEngine.applyEnvelope(click, 0.01, 0.03, 0.7, 0.16);
    }

    generateUnwrapSound() {
        const rustle = this.audioEngine.generateNoise(0.8, 0.4);
        return this.audioEngine.applyEnvelope(rustle, 0.05, 0.2, 0.7, 0.55);
    }

    generateKeySound() {
        const jingle = this.audioEngine.generateTone(1200, 0.4, 'sine');
        return this.audioEngine.applyEnvelope(jingle, 0.01, 0.05, 0.6, 0.34);
    }

    generateOldKeySound() {
        const creak = this.audioEngine.generateTone(200, 0.8, 'sawtooth');
        return this.audioEngine.applyEnvelope(creak, 0.05, 0.2, 0.8, 0.55);
    }

    generateBlingSound() {
        const shine = this.audioEngine.generateSweep(1500, 3000, 0.6, 'sine');
        return this.audioEngine.applyEnvelope(shine, 0.01, 0.1, 0.5, 0.49);
    }

    generateRegalSound() {
        const fanfare = this.audioEngine.generateTone(523, 1.0, 'sine'); // C5
        return this.audioEngine.applyEnvelope(fanfare, 0.1, 0.2, 0.8, 0.7);
    }

    // Get list of popular emojis for the UI
    getPopularEmojis() {
        return this.popularEmojis;
    }

    // Clear sound cache
    clearCache() {
        this.soundCache.clear();
    }
}