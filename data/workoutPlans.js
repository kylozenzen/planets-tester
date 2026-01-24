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
  }
};

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

// ========== BEGINNER STARTER EXERCISES ==========
// Safe, machine-based exercises for new lifters

const BEGINNER_EXERCISES = [
  { 
    id: 'chest_press', 
    name: 'Chest Press', 
    emoji: '⚙️', 
    desc: 'Great for building chest strength', 
    why: 'Machine guides your movement' 
  },
  { 
    id: 'lat_pulldown', 
    name: 'Lat Pulldown', 
    emoji: '⚙️', 
    desc: 'Builds a strong back', 
    why: 'Easier than pull-ups' 
  },
  { 
    id: 'leg_press', 
    name: 'Leg Press', 
    emoji: '⚙️', 
    desc: 'Powerful legs, safe form', 
    why: 'No balance required' 
  },
  { 
    id: 'seated_row', 
    name: 'Seated Row', 
    emoji: '⚙️', 
    desc: 'Posture and back strength', 
    why: 'Simple pulling motion' 
  },
  { 
    id: 'shoulder_press', 
    name: 'Shoulder Press', 
    emoji: '⚙️', 
    desc: 'Strong shoulders', 
    why: 'Machine stabilizes weight' 
  },
  { 
    id: 'leg_curl', 
    name: 'Leg Curl', 
    emoji: '⚙️', 
    desc: 'Hamstring strength', 
    why: 'Isolates one muscle group' 
  },
  { 
    id: 'ab_crunch', 
    name: 'Ab Crunch Machine', 
    emoji: '⚙️', 
    desc: 'Core strength', 
    why: 'Controlled movement' 
  },
  { 
    id: 'pec_fly', 
    name: 'Pec Fly', 
    emoji: '⚙️', 
    desc: 'Chest definition', 
    why: 'Isolated chest work' 
  }
];
