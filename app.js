// Main application logic for Emoji Sound Designer
class EmojiSoundApp {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.soundMapper = new EmojiSoundMapper(this.audioEngine);
        this.currentEmoji = '🔔';
        this.currentSound = null;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateEmojiGrid();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Giant emoji button click
        const giantBtn = document.getElementById('giantEmojiBtn');
        giantBtn.addEventListener('click', () => this.playCurrentSound());

        // Play button
        const playBtn = document.getElementById('playBtn');
        playBtn.addEventListener('click', () => this.playCurrentSound());

        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => this.downloadCurrentSound());

        // Custom emoji input
        const customInput = document.getElementById('customEmojiInput');
        const useCustomBtn = document.getElementById('useCustomBtn');
        
        useCustomBtn.addEventListener('click', () => {
            const emoji = customInput.value.trim();
            if (emoji && this.isValidEmoji(emoji)) {
                this.setCurrentEmoji(emoji);
                customInput.value = '';
            } else {
                this.showMessage('Please enter a valid emoji!', 'error');
            }
        });

        // Allow Enter key on custom input
        customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                useCustomBtn.click();
            }
        });

        // Allow clicking emoji options
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-option')) {
                this.setCurrentEmoji(e.target.textContent);
            }
        });
    }

    populateEmojiGrid() {
        const grid = document.getElementById('emojiGrid');
        const emojis = this.soundMapper.getPopularEmojis();
        
        grid.innerHTML = '';
        emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-option';
            button.textContent = emoji;
            button.title = `Click to select ${emoji}`;
            
            if (emoji === this.currentEmoji) {
                button.classList.add('selected');
            }
            
            grid.appendChild(button);
        });
    }

    setCurrentEmoji(emoji) {
        this.currentEmoji = emoji;
        this.currentSound = null; // Clear cached sound
        this.updateDisplay();
        this.updateEmojiSelection();
        
        // Pre-generate the sound for better responsiveness
        this.generateCurrentSound();
    }

    updateDisplay() {
        const giantBtn = document.getElementById('giantEmojiBtn');
        giantBtn.textContent = this.currentEmoji;
        
        // Update page title
        document.title = `${this.currentEmoji} Emoji Sound Designer`;
    }

    updateEmojiSelection() {
        const options = document.querySelectorAll('.emoji-option');
        options.forEach(option => {
            if (option.textContent === this.currentEmoji) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    async generateCurrentSound() {
        try {
            this.currentSound = this.soundMapper.getSoundForEmoji(this.currentEmoji);
            this.showMessage(`Sound generated for ${this.currentEmoji}!`, 'success');
        } catch (error) {
            console.error('Error generating sound:', error);
            this.showMessage('Error generating sound. Please try again.', 'error');
        }
    }

    async playCurrentSound() {
        if (this.isPlaying) return;

        try {
            this.isPlaying = true;
            this.updatePlayButton(true);

            // Generate sound if not cached
            if (!this.currentSound) {
                await this.generateCurrentSound();
            }

            if (this.currentSound) {
                const source = await this.audioEngine.playBuffer(this.currentSound);
                
                // Add visual feedback
                this.animateEmojiButton();
                
                // Reset playing state when sound ends
                source.onended = () => {
                    this.isPlaying = false;
                    this.updatePlayButton(false);
                };
                
                // Auto-reset after maximum duration
                setTimeout(() => {
                    this.isPlaying = false;
                    this.updatePlayButton(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
            this.showMessage('Error playing sound. Check your audio settings.', 'error');
            this.isPlaying = false;
            this.updatePlayButton(false);
        }
    }

    updatePlayButton(isPlaying) {
        const playBtn = document.getElementById('playBtn');
        if (isPlaying) {
            playBtn.textContent = '⏸️ Playing...';
            playBtn.disabled = true;
        } else {
            playBtn.textContent = '▶️ Play Sound';
            playBtn.disabled = false;
        }
    }

    animateEmojiButton() {
        const giantBtn = document.getElementById('giantEmojiBtn');
        giantBtn.style.transform = 'scale(1.2)';
        giantBtn.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            giantBtn.style.transform = 'scale(1)';
            giantBtn.style.transition = 'transform 0.3s ease';
        }, 150);
    }

    async downloadCurrentSound() {
        try {
            // Generate sound if not cached
            if (!this.currentSound) {
                await this.generateCurrentSound();
            }

            if (!this.currentSound) {
                this.showMessage('No sound to download. Please generate a sound first.', 'error');
                return;
            }

            // Convert to WAV blob
            const wavBlob = this.audioEngine.bufferToWav(this.currentSound);
            
            // Create download link
            const url = URL.createObjectURL(wavBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `emoji-${this.currentEmoji}-sound.wav`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up URL
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            this.showMessage(`Downloaded sound for ${this.currentEmoji}!`, 'success');
        } catch (error) {
            console.error('Error downloading sound:', error);
            this.showMessage('Error downloading sound. Please try again.', 'error');
        }
    }

    isValidEmoji(text) {
        // Basic emoji validation - checks if the text contains emoji characters
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        return emojiRegex.test(text) && text.length <= 2;
    }

    showMessage(text, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('app-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'app-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                transition: all 0.3s ease;
                transform: translateX(100%);
            `;
            document.body.appendChild(messageEl);
        }

        // Set message style based on type
        switch (type) {
            case 'success':
                messageEl.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                messageEl.style.backgroundColor = '#f44336';
                break;
            default:
                messageEl.style.backgroundColor = '#2196F3';
        }

        messageEl.textContent = text;
        
        // Show message
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 10);

        // Hide message after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
        }, 3000);
    }

    // Method to generate sound for any emoji (for external API use)
    async generateSoundForEmoji(emoji) {
        if (!this.isValidEmoji(emoji)) {
            throw new Error('Invalid emoji provided');
        }

        try {
            const soundBuffer = this.soundMapper.getSoundForEmoji(emoji);
            const wavBlob = this.audioEngine.bufferToWav(soundBuffer);
            return wavBlob;
        } catch (error) {
            console.error('Error generating sound for emoji:', emoji, error);
            throw error;
        }
    }

    // Get information about sound mappings
    getSoundInfo(emoji) {
        const hasMapping = this.soundMapper.emojiMappings.hasOwnProperty(emoji);
        return {
            emoji: emoji,
            hasCustomMapping: hasMapping,
            soundType: hasMapping ? 'custom' : 'generic'
        };
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Global app instance
    window.emojiSoundApp = new EmojiSoundApp();
    
    // Expose API for external use
    window.generateEmojiSound = async (emoji) => {
        return await window.emojiSoundApp.generateSoundForEmoji(emoji);
    };
    
    console.log('🎵 Emoji Sound Designer loaded successfully!');
    console.log('API: Use generateEmojiSound("🔔") to generate sounds programmatically');
});

// Handle page visibility changes to pause audio context when needed
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.emojiSoundApp) {
        // Suspend audio context to save resources
        if (window.emojiSoundApp.audioEngine.audioContext.state === 'running') {
            window.emojiSoundApp.audioEngine.audioContext.suspend();
        }
    } else if (window.emojiSoundApp) {
        // Resume audio context when page becomes visible
        if (window.emojiSoundApp.audioEngine.audioContext.state === 'suspended') {
            window.emojiSoundApp.audioEngine.audioContext.resume();
        }
    }
});