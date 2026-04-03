class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.horseNeighBuffer = null;
    this.enabled = true;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      await this.loadSlotSounds();
      await this.loadHorseNeigh();
      this.initialized = true;
      console.log("Sound system initialized");
    } catch (error) {
      console.warn("Web Audio API not supported, using fallback", error);
      this.enabled = false;
    }
  }

  async loadSlotSounds() {
    const slotSounds = [
      { id: 0, frequency: 200 },
      { id: 1, frequency: 250 },
      { id: 2, frequency: 300 },
      { id: 3, frequency: 350 },
      { id: 4, frequency: 400 },
      { id: 5, frequency: 350 },
      { id: 6, frequency: 300 },
      { id: 7, frequency: 250 },
      { id: 8, frequency: 500 },
    ];

    slotSounds.forEach((sound) => {
      this.sounds[`slot${sound.id}`] = {
        frequency: sound.frequency,
        duration: sound.id === 4 ? 0.5 : 0.2,
      };
    });
  }

  async loadHorseNeigh() {
    try {
      const response = await fetch("/assets/sounds/horse-neigh.m4a");
      const arrayBuffer = await response.arrayBuffer();
      this.horseNeighBuffer =
        await this.audioContext.decodeAudioData(arrayBuffer);
      console.log("Horse neigh sound loaded");
    } catch (error) {
      console.warn("Failed to load horse neigh sound:", error);
    }
  }

  playSlotSound(slotId) {
    if (!this.enabled || !this.audioContext) return;

    const soundConfig = this.sounds[`slot${slotId}`];
    if (!soundConfig) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = slotId === 4 ? "square" : "sine";
      oscillator.frequency.setValueAtTime(
        soundConfig.frequency,
        this.audioContext.currentTime,
      );

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + soundConfig.duration,
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }

  playMultiBallSound() {
    this.playSlotSound(4);

    setTimeout(() => {
      if (this.enabled && this.audioContext) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          800,
          this.audioContext.currentTime + 0.3,
        );

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + 0.3,
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }
    }, 100);
  }

  playHorseNeigh() {
    console.log("playHorseNeigh called");
    console.log("enabled:", this.enabled);
    console.log("audioContext:", this.audioContext);
    console.log("horseNeighBuffer:", this.horseNeighBuffer);

    if (!this.enabled || !this.audioContext) {
      console.warn("Audio not enabled or context not available");
      return;
    }

    if (!this.horseNeighBuffer) {
      console.warn("Horse neigh buffer not loaded, falling back to slot sound");
      this.playSlotSound(0);
      return;
    }

    try {
      // Create a buffer source node (one-time use)
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      // Set the audio buffer
      source.buffer = this.horseNeighBuffer;

      // Connect: source → gain → destination
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Set volume (0.8 for loud neigh)
      gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);

      // Play the sound
      source.start(this.audioContext.currentTime);
      console.log("Horse neigh playing!");
    } catch (error) {
      console.error("Error playing horse neigh:", error);
    }
  }
}

const soundManager = new SoundManager();
