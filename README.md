# 🎵 Emoji Sound Designer

A playful web application that generates cartoon-like sound effects for any emoji! Click an emoji button and hear its matching sound effect, then download it as a WAV file.

## Features

- **Giant Emoji Button**: Click any emoji to hear its sound effect
- **Extensive Sound Library**: Over 80 custom sound mappings for different emoji categories
- **Real-time Audio Generation**: Uses Web Audio API to generate sounds on-the-fly
- **WAV Export**: Download generated sounds as high-quality WAV files
- **Responsive Design**: Works on desktop and mobile devices
- **Custom Emoji Support**: Enter any emoji to generate a sound effect

## How to Use

1. **Choose an Emoji**: 
   - Click any emoji from the grid
   - Or enter a custom emoji in the input field

2. **Play the Sound**:
   - Click the giant emoji button
   - Or use the "Play Sound" button

3. **Download the Sound**:
   - Click "Download WAV" to save the sound effect
   - Files are saved as `emoji-[emoji]-sound.wav`

## Sound Categories

### Animals 🐱
- Cat (🐱): Soft meow
- Dog (🐶): Playful bark
- Lizard (🦎): Squeaky chirp
- Frog (🐸): Deep croak
- Bird (🐦): High-pitched chirp

### Vehicles 🚗
- Car (🚗): Playful honk
- Train (🚂): Steam whistle
- Plane (✈️): Engine sound
- Helicopter (🚁): Rotor sound

### Objects & Tools 🔔
- Bell (🔔): Clear bell ring
- Phone (📞): Classic ring tone
- Guitar (🎸): Strum sound
- Drum (🥁): Kick drum

### Emotions 😂
- Laughter (😂): Silly giggling
- Crying (😭): Sobbing sound
- Snoring (😴): Deep snore

### Effects ✨
- Sparkle (✨): Magical chimes
- Boom (💥): Cartoon explosion
- Thunder (⚡): Rolling thunder

### And Many More!
The app includes custom sound mappings for over 80 different emojis across various categories.

## Technical Details

### Audio Engine
- Built with Web Audio API
- Generates sounds using oscillators, noise, and frequency sweeps
- Applies ADSR envelopes for natural sound shaping
- Supports multiple waveform types (sine, square, sawtooth, triangle)

### Sound Generation
- **Duration**: 1-3 seconds per sound effect
- **Format**: 44.1kHz, 16-bit WAV
- **Style**: Cartoon-like, playful sounds
- **Quality**: High clarity, no silence padding

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

*Note: Requires a modern browser with Web Audio API support*

## File Structure

```
kimi-game/
├── index.html          # Main HTML page
├── styles.css          # Styling and animations
├── audio-engine.js     # Web Audio API sound generation
├── emoji-mappings.js   # Emoji to sound mapping system
├── app.js             # Main application logic
└── README.md          # This file
```

## API Usage

The application exposes a global function for programmatic use:

```javascript
// Generate a sound for any emoji
const wavBlob = await generateEmojiSound('🔔');

// Use the blob as needed (play, download, etc.)
const url = URL.createObjectURL(wavBlob);
```

## Running the Application

1. **Local Development**:
   ```bash
   # Navigate to the project directory
   cd kimi-game
   
   # Start a local server (Python example)
   python -m http.server 8000
   
   # Open http://localhost:8000 in your browser
   ```

2. **Direct File Access**:
   - Simply open `index.html` in a modern web browser
   - Some features may require a server due to browser security restrictions

## Performance Notes

- Sounds are generated on-demand and cached for better performance
- Audio context is suspended when page is not visible to save resources
- Large emoji sets may take a moment to initialize

## Customization

### Adding New Emoji Sounds

Edit `emoji-mappings.js` to add new emoji mappings:

```javascript
// Add to the emojiMappings object
'🆕': () => this.generateCustomSound(),

// Implement the custom sound generator
generateCustomSound() {
    const sound = this.audioEngine.generateTone(440, 1.0, 'sine');
    return this.audioEngine.applyEnvelope(sound, 0.1, 0.2, 0.7, 0.7);
}
```

### Modifying Sound Parameters

Adjust sound characteristics in `audio-engine.js`:
- Frequency ranges
- Duration
- Waveform types
- Envelope parameters (attack, decay, sustain, release)

## Browser Permissions

The application may request microphone permissions in some browsers, but it only generates audio output - no recording or input is performed.

## Troubleshooting

### No Sound Output
1. Check browser audio settings
2. Ensure volume is turned up
3. Try clicking the page first (required for audio context activation)
4. Check browser console for error messages

### Performance Issues
1. Close other audio-intensive applications
2. Try refreshing the page
3. Use a modern browser with good Web Audio API support

### Download Issues
1. Check browser download settings
2. Ensure pop-ups are allowed for the site
3. Try right-clicking the download button and "Save as..."

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the emoji sound library!

---

*Built with ❤️ using Web Audio API*