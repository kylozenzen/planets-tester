// ========== WORKOUT PLANS ==========
// Pre-built workout splits organized by equipment type

const WORKOUT_PLANS = {
  Push: {
    machines: ["chest_press", "shoulder_press", "pec_fly", "cable_tricep"],
    dumbbells: ["db_bench_press", "db_shoulder_press"],
    barbells: ["bb_bench", "bb_overhead_press"]
  },
  Pull: {
    machines: ["lat_pulldown", "seated_row", "cable_bicep", "ab_crunch"],
    dumbbells: ["db_row", "db_curl"],
    barbells: ["bb_deadlift", "bb_row"]
  },
  Legs: {
    machines: ["leg_press", "leg_extension", "leg_curl", "ab_crunch"],
    dumbbells: ["db_goblet_squat", "db_lunge"],
    barbells: ["bb_squat"]
  },
  FullBody: {
    machines: ["chest_press", "lat_pulldown", "leg_press"],
    dumbbells: ["db_row"],
    barbells: ["bb_deadlift"]
  }
};

// ========== TEMPLATE PICKS ==========
// Friendly template descriptions for the picker modal

const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    key: 'Push',
    name: 'Upper body — push',
    description: 'Chest, shoulders, and triceps with simple press movements.',
    exerciseIds: ["chest_press", "shoulder_press", "db_bench_press", "bb_bench"],
    createdFrom: 'template'
  },
  {
    id: 'pull',
    key: 'Pull',
    name: 'Upper body — pull',
    description: 'Back and biceps using rows and pull-downs.',
    exerciseIds: ["lat_pulldown", "seated_row", "db_row", "bb_row"],
    createdFrom: 'template'
  },
  {
    id: 'legs',
    key: 'Legs',
    name: 'Leg day',
    description: 'Quads, hamstrings, and glutes without overcomplicating it.',
    exerciseIds: ["leg_press", "leg_curl", "db_goblet_squat", "bb_squat"],
    createdFrom: 'template'
  },
  {
    id: 'full_body',
    key: 'FullBody',
    name: 'Full body basics',
    description: 'One round that hits upper, lower, and posterior chain.',
    exerciseIds: ["chest_press", "leg_press", "db_row", "bb_deadlift"],
    createdFrom: 'template'
  }
];

// ========== BIG BASICS ==========
// Core exercises shown by default - the foundational movements everyone should know

const BIG_BASICS = [
  // Machines (6 core)
  "chest_press", 
  "lat_pulldown", 
  "seated_row", 
  "shoulder_press", 
  "leg_press", 
  "leg_curl",
  // Dumbbells (4 core)
  "db_bench_press", 
  "db_row", 
  "db_shoulder_press", 
  "db_curl",
  // Barbells (5 core)
  "bb_squat", 
  "bb_bench", 
  "bb_deadlift", 
  "bb_row", 
  "bb_overhead_press"
];
