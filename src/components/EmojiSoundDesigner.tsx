'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioEngine } from '@/lib/audioEngine';
import { EmojiSoundMapper } from '@/lib/emojiMappings';
import { ClickCounter } from '@/lib/clickCounter';
import ClickCounters from '@/components/ClickCounters';

// Animated emoji interface for floating effects
interface AnimatedEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function EmojiSoundDesigner() {
  const [currentEmoji, setCurrentEmoji] = useState('🔔');
  const [userClicks, setUserClicks] = useState(0);
  const [globalClicks, setGlobalClicks] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' });
  const [customEmoji, setCustomEmoji] = useState('');
  const [animatedEmojis, setAnimatedEmojis] = useState<AnimatedEmoji[]>([]);

  const audioEngineRef = useRef<AudioEngine | null>(null);
  const soundMapperRef = useRef<EmojiSoundMapper | null>(null);
  const currentSoundRef = useRef<AudioBuffer | null>(null);

  // Initialize audio engine on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioEngineRef.current = new AudioEngine();
      soundMapperRef.current = new EmojiSoundMapper(audioEngineRef.current);
      
      // Load initial counters
      loadCounters();
    }
  }, []);

  const loadCounters = async () => {
    try {
      const counters = await ClickCounter.getBothCounters();
      setUserClicks(counters.userClicks);
      setGlobalClicks(counters.globalClicks);
    } catch (error) {
      console.error('Error loading counters:', error);
    }
  };

  const showMessage = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'info' }), 3000);
  }, []);

  // Function to spawn animated emojis
  const spawnAnimatedEmoji = useCallback((emoji: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newEmoji: AnimatedEmoji = {
      id,
      emoji,
      x: Math.random() * 80 + 10, // Random position between 10% and 90% of screen width
      y: Math.random() * 60 + 20, // Random position between 20% and 80% of screen height
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5, // Scale between 0.5 and 1
    };

    setAnimatedEmojis(prev => [...prev, newEmoji]);

    // Remove the emoji after animation completes
    setTimeout(() => {
      setAnimatedEmojis(prev => prev.filter(e => e.id !== id));
    }, 4000);
  }, []);

  const generateCurrentSound = useCallback(async () => {
    if (!soundMapperRef.current) return null;
    
    try {
      const soundBuffer = soundMapperRef.current.getSoundForEmoji(currentEmoji);
      currentSoundRef.current = soundBuffer;
      return soundBuffer;
    } catch (error) {
      console.error('Error generating sound:', error);
      showMessage('Error generating sound. Please try again.', 'error');
      return null;
    }
  }, [currentEmoji, showMessage]);

  const playCurrentSound = useCallback(async () => {
    if (isPlaying || !audioEngineRef.current) return;

    try {
      setIsPlaying(true);
      setIsLoading(true);

      // Generate sound if not cached
      if (!currentSoundRef.current) {
        await generateCurrentSound();
      }

      if (currentSoundRef.current) {
        const source = await audioEngineRef.current.playBuffer(currentSoundRef.current);
        
        if (source) {
          // Increment both counters
          const counters = await ClickCounter.incrementBothCounters();
          setUserClicks(counters.userClicks);
          setGlobalClicks(counters.globalClicks);

          showMessage(`🎵 Playing ${currentEmoji} sound!`, 'success');
          
          // Spawn single animated emoji for fun effect
          spawnAnimatedEmoji(currentEmoji);
          
          // Reset playing state when sound ends
          source.onended = () => {
            setIsPlaying(false);
          };
          
          // Auto-reset after maximum duration
          setTimeout(() => {
            setIsPlaying(false);
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      showMessage('Error playing sound. Check your audio settings.', 'error');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, generateCurrentSound, showMessage, currentEmoji, spawnAnimatedEmoji]);

  const downloadCurrentSound = useCallback(async () => {
    if (!audioEngineRef.current) return;

    try {
      // Generate sound if not cached
      if (!currentSoundRef.current) {
        await generateCurrentSound();
      }

      if (!currentSoundRef.current) {
        showMessage('No sound to download. Please generate a sound first.', 'error');
        return;
      }

      // Convert to WAV blob
      const wavBlob = audioEngineRef.current.bufferToWav(currentSoundRef.current);
      
      // Create download link
      const url = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emoji-${currentEmoji}-sound.wav`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      showMessage(`Downloaded sound for ${currentEmoji}!`, 'success');
    } catch (error) {
      console.error('Error downloading sound:', error);
      showMessage('Error downloading sound. Please try again.', 'error');
    }
  }, [generateCurrentSound, showMessage, currentEmoji]);

  const setCurrentEmojiAndGenerate = useCallback((emoji: string) => {
    setCurrentEmoji(emoji);
    currentSoundRef.current = null; // Clear cached sound
    
    // Pre-generate the sound for better responsiveness
    if (soundMapperRef.current) {
      setTimeout(() => generateCurrentSound(), 100);
    }
  }, [generateCurrentSound]);

  const handleCustomEmojiSubmit = useCallback(() => {
    const emoji = customEmoji.trim();
    if (emoji && isValidEmoji(emoji)) {
      setCurrentEmojiAndGenerate(emoji);
      setCustomEmoji('');
    } else {
      showMessage('Please enter a valid emoji!', 'error');
    }
  }, [customEmoji, setCurrentEmojiAndGenerate, showMessage]);

  const resetUserCounter = useCallback(() => {
    ClickCounter.resetUserClicks();
    setUserClicks(0);
    showMessage('Your counter has been reset!', 'info');
  }, [showMessage]);

  const isValidEmoji = (text: string): boolean => {
    // Simple check for basic emoji presence and length
    return text.length >= 1 && text.length <= 2 && /[\uD800-\uDBFF]/.test(text) || /[\u2600-\u27BF]/.test(text);
  };

  const popularEmojis = soundMapperRef.current?.getPopularEmojis() || [
    '🔔', '😂', '🚗', '🦎', '🐱', '✨', '💥', '🎉',
    '🐶', '🎵', '⚡', '🌊', '👏', '🍎', '📱', '⚽',
    '🚂', '🎸', '💨', '🔥', '🎯', '🦆', '📞', '🥁'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
            🎵 Emoji Sound Designer
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            Click any emoji to hear its cartoon sound effect and compete with users worldwide!
          </p>
        </header>

        {/* Click Counters */}
        <ClickCounters 
          userClicks={userClicks}
          globalClicks={globalClicks}
          onReset={resetUserCounter}
        />

        {/* Main Emoji Display - Made smaller */}
        <div className="text-center mb-12 relative">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
            <button
              onClick={playCurrentSound}
              disabled={isPlaying || isLoading}
              className={`text-[8rem] md:text-[10rem] p-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/30 transition-all duration-500 hover:scale-110 hover:from-white/30 hover:to-white/20 hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed ${
                isPlaying ? 'animate-bounce-soft shadow-[0_0_100px_rgba(255,255,255,0.5)]' : 'hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]'
              }`}
              title={`Click to hear ${currentEmoji} sound`}
            >
              {currentEmoji}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={playCurrentSound}
              disabled={isPlaying || isLoading}
              className={`px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
                isPlaying ? 'from-yellow-500 to-yellow-600' : ''
              }`}
            >
              <span className="text-2xl mr-2">{isLoading ? '🔄' : isPlaying ? '⏸️' : '▶️'}</span>
              {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Play Sound'}
            </button>
            
            <button
              onClick={downloadCurrentSound}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="text-2xl mr-2">💾</span>
              Download WAV
            </button>
          </div>
        </div>

        {/* Emoji Grid - Made smaller and more compact */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-center mb-4 text-white/90">Choose Your Emoji:</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 justify-items-center">
            {popularEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setCurrentEmojiAndGenerate(emoji)}
                className={`text-2xl md:text-3xl p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-white/20 ${
                  emoji === currentEmoji ? 'bg-white/30 scale-105 shadow-lg' : 'bg-white/5 hover:bg-white/15'
                }`}
                title={`Click to select ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Emoji Input - Made more compact */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-3 text-white/90">Or Enter Any Emoji:</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="text"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomEmojiSubmit()}
              placeholder="🎉"
              maxLength={2}
              className="text-xl md:text-2xl p-3 rounded-lg text-center bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-16 text-white placeholder-white/60"
            />
            <button
              onClick={handleCustomEmojiSubmit}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-all duration-200 text-sm"
            >
              Use This Emoji
            </button>
          </div>
        </div>

        {/* Animated Floating Emojis */}
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {animatedEmojis.map((animatedEmoji) => (
            <div
              key={animatedEmoji.id}
              className="absolute text-6xl animate-float-and-flip"
              style={{
                left: `${animatedEmoji.x}%`,
                top: `${animatedEmoji.y}%`,
                transform: `rotate(${animatedEmoji.rotation}deg) scale(${animatedEmoji.scale})`,
                animation: `float-and-flip 4s ease-out forwards`,
              }}
            >
              {animatedEmoji.emoji}
            </div>
          ))}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl font-bold z-50 transition-all duration-300 ${
            message.type === 'success' ? 'bg-green-500' :
            message.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-white/60">
          <p>Sound effects generated using Web Audio API • Click counts are tracked locally and globally</p>
        </footer>
      </div>
    </div>
  );
}