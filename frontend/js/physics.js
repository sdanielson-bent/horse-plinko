const { Engine, Render, World, Bodies, Body, Events } = Matter;

class PhysicsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 800;
    this.height = 600;
    this.slotWidth = this.width / 9;
    this.slotCount = 9;
    this.pegRows = 10;
    this.pegRadius = 4;
    this.wallThickness = 20;

    this.engine = Engine.create({
      gravity: { x: 0, y: 1 },
    });

    this.pegs = [];
    this.walls = [];
    this.slots = [];
    this.slotSensors = [];
    this.droppingBodies = [];

    this.initializeBoard();
    this.setupCollisionEvents();
  }

  initializeBoard() {
    const startY = 100;
    const pegSpacingY = 40;
    const pegSpacingX = this.width / (this.pegRows + 1);

    for (let row = 0; row < this.pegRows; row++) {
      const pegsInRow = row + 5;
      const rowWidth = pegsInRow * 50;
      const startX = (this.width - rowWidth) / 2;

      for (let col = 0; col < pegsInRow; col++) {
        const x = startX + col * (rowWidth / (pegsInRow - 1));
        const y = startY + row * pegSpacingY;

        const peg = Bodies.circle(x, y, this.pegRadius, {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1,
          render: {
            fillStyle: "#4A5568",
          },
          label: "peg",
        });

        this.pegs.push(peg);
        World.add(this.engine.world, peg);
      }
    }

    const leftWall = Bodies.rectangle(
      -this.wallThickness / 2,
      this.height / 2,
      this.wallThickness,
      this.height,
      { isStatic: true, render: { fillStyle: "#2D3748" }, label: "wall" },
    );

    const rightWall = Bodies.rectangle(
      this.width + this.wallThickness / 2,
      this.height / 2,
      this.wallThickness,
      this.height,
      { isStatic: true, render: { fillStyle: "#2D3748" }, label: "wall" },
    );

    this.walls.push(leftWall, rightWall);
    World.add(this.engine.world, this.walls);

    this.createSlots();
  }

  createSlots() {
    const slotY = this.height - 60;
    const slotHeight = 50;

    for (let i = 0; i < this.slotCount; i++) {
      const x = i * this.slotWidth + this.slotWidth / 2;

      const sensor = Bodies.rectangle(
        x,
        slotY,
        this.slotWidth - 4,
        slotHeight,
        {
          isStatic: true,
          isSensor: true,
          render: {
            fillStyle:
              i === 4 ? "rgba(255, 215, 0, 0.3)" : "rgba(102, 126, 234, 0.2)",
            strokeStyle: i === 4 ? "#FFD700" : "#667eea",
            lineWidth: 2,
          },
          label: `slot${i}`,
          slotId: i,
        },
      );

      this.slotSensors.push(sensor);
      World.add(this.engine.world, sensor);

      if (i < this.slotCount - 1) {
        const divider = Bodies.rectangle(
          (i + 1) * this.slotWidth,
          slotY,
          2,
          slotHeight,
          {
            isStatic: true,
            render: { fillStyle: "#CBD5E0" },
            label: "divider",
          },
        );
        this.slots.push(divider);
        World.add(this.engine.world, divider);
      }
    }
  }

  setupCollisionEvents() {
    Events.on(this.engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const sensor = bodyA.isSensor ? bodyA : bodyB.isSensor ? bodyB : null;
        const droppingBody = bodyA.isSensor
          ? bodyB
          : bodyB.isSensor
            ? bodyA
            : null;

        if (
          sensor &&
          droppingBody &&
          sensor.label.startsWith("slot") &&
          droppingBody.label === "dropping"
        ) {
          this.handleSlotCollision(sensor, droppingBody);
        }
      });
    });
  }

  handleSlotCollision(sensor, droppingBody) {
    if (droppingBody.hasLanded) return;

    droppingBody.hasLanded = true;
    const slotId = sensor.slotId;

    if (this.onSlotHit) {
      this.onSlotHit(slotId, droppingBody);
    }

    setTimeout(() => {
      this.removeBody(droppingBody);
    }, 500);
  }

  dropObject(objectType) {
    const config = getObjectConfig(objectType);
    const x = this.width / 2 + (Math.random() - 0.5) * 50;
    const y = 50;

    const body = Bodies.circle(x, y, config.radius, {
      restitution: config.restitution,
      friction: config.friction,
      mass: config.mass,
      render: config.render || { fillStyle: config.color },
      label: "dropping",
    });

    body.objectType = objectType;
    body.config = config;
    body.hasLanded = false;

    this.droppingBodies.push(body);
    World.add(this.engine.world, body);

    return body;
  }

  spawnMultiBall(objectType) {
    const objects = [];
    for (let i = 0; i < 3; i++) {
      const config = getObjectConfig(objectType);
      const offsetX = (i - 1) * 30;
      const x = this.width / 2 + offsetX + (Math.random() - 0.5) * 20;
      const y = 50;

      const body = Bodies.circle(x, y, config.radius, {
        restitution: config.restitution,
        friction: config.friction,
        mass: config.mass,
        render: config.render || { fillStyle: config.color },
        label: "dropping",
      });

      body.objectType = objectType;
      body.config = config;
      body.hasLanded = false;

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: 0,
      });

      this.droppingBodies.push(body);
      World.add(this.engine.world, body);
      objects.push(body);
    }
    return objects;
  }

  removeBody(body) {
    World.remove(this.engine.world, body);
    const index = this.droppingBodies.indexOf(body);
    if (index > -1) {
      this.droppingBodies.splice(index, 1);
    }
  }

  update() {
    Engine.update(this.engine, 1000 / 60);
  }

  getActiveObjectCount() {
    return this.droppingBodies.length;
  }

  getDimensions() {
    return { width: this.width, height: this.height };
  }
}
