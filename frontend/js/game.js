class PlinkoGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.physics = new PhysicsEngine(this.canvas);
    this.renderer = new GameRenderer(this.canvas, this.physics);

    this.currentObjectType = "ball";
    this.totalScore = 0;
    this.slotData = [];

    this.initializeUI();
    this.initializeSounds();
    this.setupPhysicsCallbacks();
    this.startGameLoop();
  }

  async initializeSounds() {
    await soundManager.init();
  }

  initializeUI() {
    this.dropBtn = document.getElementById("dropBtn");
    this.activeCountEl = document.getElementById("activeCount");
    this.lastSlotEl = document.getElementById("lastSlot");
    this.totalScoreEl = document.getElementById("totalScore");

    this.dropBtn.addEventListener("click", () => this.dropObject());

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.dropObject();
      }
    });

    const objectButtons = document.querySelectorAll(".object-btn");
    objectButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        objectButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentObjectType = btn.dataset.object;
      });
    });

    this.loadSlotData();
  }

  async loadSlotData() {
    try {
      const response = await fetch("/api/slots");
      this.slotData = await response.json();
      console.log("Loaded slot data:", this.slotData);
    } catch (error) {
      console.warn("Failed to load slot data, using defaults", error);
      this.slotData = Array.from({ length: 9 }, (_, i) => ({
        slot_id: i,
        name: `Slot ${i}`,
        value: i === 4 ? 20 : i === 8 ? 50 : 5,
        is_multi_ball: i === 4,
      }));
    }
  }

  setupPhysicsCallbacks() {
    this.physics.onSlotHit = (slotId, body) => {
      this.handleSlotHit(slotId, body);
    };
  }

  dropObject() {
    const body = this.physics.dropObject(this.currentObjectType);
    this.updateStats();
  }

  handleSlotHit(slotId, body) {
    const slotInfo = this.slotData[slotId] || {
      value: 0,
      is_multi_ball: false,
    };

    console.log(
      "handleSlotHit called - slotId:",
      slotId,
      "objectType:",
      body.objectType,
    );

    // Play horse neigh for horse objects, regular sound for others
    if (body.objectType === "horse") {
      console.log("Playing horse neigh!");
      soundManager.playHorseNeigh();
    } else {
      console.log("Playing slot sound:", slotId);
      soundManager.playSlotSound(slotId);
    }

    this.totalScore += slotInfo.value;
    this.lastSlotEl.textContent = `${slotId} (${slotInfo.name || slotId})`;
    this.totalScoreEl.textContent = this.totalScore;

    if (slotInfo.is_multi_ball) {
      setTimeout(() => {
        soundManager.playMultiBallSound();
        this.physics.spawnMultiBall(this.currentObjectType);
        this.updateStats();
      }, 100);
    }
  }

  startGameLoop() {
    this.renderer.start();

    setInterval(() => {
      this.physics.update();
      this.updateStats();
    }, 1000 / 60);
  }

  updateStats() {
    const activeCount = this.physics.getActiveObjectCount();
    this.activeCountEl.textContent = activeCount;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new PlinkoGame();
  console.log("Plinko game initialized!");
});
