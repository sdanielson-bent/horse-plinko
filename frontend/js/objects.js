const OBJECT_TYPES = {
  ball: {
    name: "Ball",
    type: "circle",
    radius: 12,
    mass: 1,
    restitution: 0.6,
    friction: 0.1,
    color: "#FF6B6B",
    render: {
      fillStyle: "#FF6B6B",
      strokeStyle: "#C92A2A",
      lineWidth: 2,
    },
  },
  horse: {
    name: "Horse",
    type: "circle",
    radius: 10,
    mass: 1.2,
    restitution: 0.5,
    friction: 0.15,
    color: "#8B4513",
    emoji: "🐴",
  },
  "beach-ball": {
    name: "Beach Ball",
    type: "circle",
    radius: 10,
    mass: 0.8,
    restitution: 0.7,
    friction: 0.05,
    color: "#4ECDC4",
    emoji: "🏖️",
  },
};

function getObjectConfig(objectType) {
  return OBJECT_TYPES[objectType] || OBJECT_TYPES.ball;
}

function getAllObjectTypes() {
  return Object.keys(OBJECT_TYPES);
}
