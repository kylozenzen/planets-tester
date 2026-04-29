// ========== EQUIPMENT DATABASE ==========
// Complete database of all exercises with multipliers, cues, and metadata

const EQUIPMENT_DB = {
  // ========== CARDIO ==========
  "cardio_running": {
    type: 'cardio',
    name: "Running",
    target: "Cardio",
    tags: ["Cardio", "Full Body"],
    cardioGroup: "running",
    emoji: "🏃"
  },
  "cardio_swimming": {
    type: 'cardio',
    name: "Swimming",
    target: "Cardio",
    tags: ["Cardio", "Full Body"],
    cardioGroup: "swimming",
    emoji: "🏊"
  },

  // ========== MACHINES ==========
  "chest_press": { 
    type: 'machine',
    name: "Chest Press", 
    target: "Chest", 
    muscles: "Chest, Triceps, Front Delts", 
    tags: ["Push","Upper","Full Body"], 
    stackCap: 260, 
    multipliers: { Male: [0.3,0.55,0.85,1.15], Female: [0.2,0.35,0.55,0.75] }, 
    cues: ["Handles mid-chest.", "Elbows ~45°.", "Shoulder blades back."], 
    progression: "Add weight when you can do 12+ controlled reps." 
  },
  "pec_fly": { 
    type: 'machine',
    name: "Pec Fly", 
    target: "Chest", 
    muscles: "Chest, Front Delts", 
    tags: ["Push","Upper"], 
    stackCap: 200, 
    multipliers: { Male: [0.2,0.35,0.55,0.8], Female: [0.12,0.25,0.4,0.6] }, 
    cues: ["Soft bend in elbows.", "Move from shoulders."], 
    progression: "Increase when 12+ reps feel easy with full ROM." 
  },
  "shoulder_press": { 
    type: 'machine',
    name: "Shoulder Press", 
    target: "Shoulders", 
    muscles: "Delts, Triceps", 
    tags: ["Push","Upper","Full Body"], 
    stackCap: 200, 
    multipliers: { Male: [0.2,0.4,0.65,0.95], Female: [0.12,0.25,0.4,0.6] }, 
    cues: ["Start at ear level.", "Press straight up.", "Brace core."], 
    progression: "Increase when 10–12 reps feel solid." 
  },
  "cable_tricep": { 
    type: 'machine',
    name: "Cable Tricep Push", 
    target: "Triceps", 
    muscles: "Triceps", 
    tags: ["Push","Upper"], 
    stackCap: 70, 
    ratio: 0.5, 
    multipliers: { Male: [0.25,0.4,0.6,0.85], Female: [0.18,0.3,0.45,0.65] }, 
    cues: ["Elbows pinned.", "Full extension."], 
    progression: "Increase when 12+ reps feel clean." 
  },
  "lat_pulldown": { 
    type: 'machine',
    name: "Lat Pulldown", 
    target: "Back", 
    muscles: "Lats, Biceps", 
    tags: ["Pull","Upper","Full Body"], 
    stackCap: 250, 
    multipliers: { Male: [0.35,0.6,0.9,1.2], Female: [0.25,0.4,0.65,0.9] }, 
    cues: ["Pull to clavicle.", "No swinging.", "Back does the work."], 
    progression: "Add weight when 12+ reps are controlled." 
  },
  "seated_row": { 
    type: 'machine',
    name: "Seated Row", 
    target: "Back", 
    muscles: "Back, Biceps", 
    tags: ["Pull","Upper"], 
    stackCap: 250, 
    multipliers: { Male: [0.4,0.65,1.0,1.35], Female: [0.28,0.45,0.7,0.95] }, 
    cues: ["Chest to pad.", "Pull to lower ribs."], 
    progression: "Progress when all sets are clean." 
  },
  "cable_bicep": { 
    type: 'machine',
    name: "Cable Bicep Curl", 
    target: "Biceps", 
    muscles: "Biceps, Forearms", 
    tags: ["Pull","Upper"], 
    stackCap: 60, 
    ratio: 0.5, 
    multipliers: { Male: [0.15,0.25,0.4,0.55], Female: [0.1,0.2,0.3,0.4] }, 
    cues: ["Elbows fixed.", "Slow negative."], 
    progression: "Increase when 12+ strict reps are easy." 
  },
  "leg_press": { 
    type: 'machine',
    name: "Leg Press", 
    target: "Legs", 
    muscles: "Quads, Glutes, Hamstrings", 
    tags: ["Push","Legs","Full Body"], 
    stackCap: 700, 
    multipliers: { Male: [1.0,1.6,2.3,3.0], Female: [0.7,1.1,1.6,2.2] }, 
    cues: ["No knee lockout.", "Controlled depth."], 
    progression: "Add weight when 15+ reps are strong and safe." 
  },
  "leg_extension": { 
    type: 'machine',
    name: "Leg Extension", 
    target: "Quads", 
    muscles: "Quadriceps", 
    tags: ["Push","Legs"], 
    stackCap: 200, 
    multipliers: { Male: [0.35,0.6,0.9,1.2], Female: [0.25,0.45,0.7,0.95] }, 
    cues: ["Align knee with pivot.", "Control descent."], 
    progression: "Increase when 12–15 reps are easy." 
  },
  "leg_curl": { 
    type: 'machine',
    name: "Leg Curl", 
    target: "Hamstrings", 
    muscles: "Hamstrings", 
    tags: ["Pull","Legs"], 
    stackCap: 200, 
    multipliers: { Male: [0.35,0.55,0.8,1.05], Female: [0.25,0.4,0.6,0.8] }, 
    cues: ["Hips down.", "Smooth reps."], 
    progression: "Increase when reps are controlled." 
  },
  "back_extension": { 
    type: 'machine',
    name: "Back Extension", 
    target: "Lower Back", 
    muscles: "Lower Back, Glutes", 
    tags: ["Pull","Legs","Core"], 
    stackCap: 200, 
    multipliers: { Male: [0.35,0.55,0.8,1.05], Female: [0.25,0.4,0.6,0.8] }, 
    cues: ["Pivot at hips.", "No hyperextension.", "Controlled movement."], 
    progression: "Increase when 15+ reps feel strong." 
  },
  "ab_crunch": { 
    type: 'machine',
    name: "Ab Crunch", 
    target: "Core", 
    muscles: "Abs", 
    tags: ["Core","Full Body"], 
    stackCap: 200, 
    multipliers: { Male: [0.3,0.5,0.75,1.0], Female: [0.2,0.35,0.55,0.75] }, 
    cues: ["Ribs to pelvis.", "Exhale."], 
    progression: "Increase when 20+ reps are clean." 
  },
  "hip_abduction": {
    type: 'machine',
    name: "Hip Abduction",
    target: "Glutes",
    muscles: "Glutes, Hip Abductors",
    tags: ["Push","Legs"],
    stackCap: 200,
    multipliers: { Male: [0.3,0.5,0.75,1.0], Female: [0.25,0.45,0.7,0.95] },
    cues: ["Press knees out.", "Control the return.", "Don't lean forward."],
    progression: "Add weight when 15+ reps feel controlled."
  },
  "hip_adduction": {
    type: 'machine',
    name: "Hip Adduction",
    target: "Inner Thighs",
    muscles: "Adductors, Inner Thighs",
    tags: ["Push","Legs"],
    stackCap: 200,
    multipliers: { Male: [0.3,0.5,0.75,1.0], Female: [0.25,0.45,0.7,0.95] },
    cues: ["Squeeze knees together.", "Controlled movement.", "Don't use momentum."],
    progression: "Add weight when 15+ reps feel strong."
  },
  "calf_raise": {
    type: 'machine',
    name: "Calf Raise",
    target: "Calves",
    muscles: "Calves",
    tags: ["Push","Legs"],
    stackCap: 300,
    multipliers: { Male: [0.5,0.8,1.2,1.6], Female: [0.35,0.6,0.9,1.2] },
    cues: ["Full stretch at bottom.", "Rise onto toes.", "Squeeze at top."],
    progression: "Add weight when 15-20 reps feel easy."
  },
  "smith_machine": {
    type: 'machine',
    name: "Smith Machine Squat",
    target: "Legs",
    muscles: "Quads, Glutes",
    tags: ["Push","Legs","Full Body"],
    stackCap: 500,
    multipliers: { Male: [0.6,1.0,1.5,2.0], Female: [0.4,0.7,1.1,1.5] },
    cues: ["Feet forward.", "Bar on traps.", "Controlled descent."],
    progression: "Add weight when 10+ reps are solid."
  },
  "cable_wood_chop": {
    type: 'machine',
    name: "Cable Wood Chop",
    target: "Core",
    muscles: "Obliques, Core, Shoulders",
    tags: ["Core","Full Body"],
    stackCap: 150,
    ratio: 0.5,
    multipliers: { Male: [0.2,0.35,0.55,0.75], Female: [0.15,0.25,0.4,0.55] },
    cues: ["Rotate from core.", "Arms extended.", "Control both directions."],
    progression: "Increase when 12-15 reps per side feel controlled."
  },
  "preacher_curl": {
    type: 'machine',
    name: "Preacher Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull","Upper"],
    stackCap: 120,
    multipliers: { Male: [0.2,0.35,0.5,0.7], Female: [0.12,0.22,0.35,0.5] },
    cues: ["Arms flat on pad.", "Full extension at bottom.", "Strict form."],
    progression: "Add weight when 10-12 strict reps are easy."
  },

  // ========== DUMBBELLS ==========
  "db_bench_press": {
    type: 'dumbbell',
    name: "Dumbbell Bench Press",
    target: "Chest",
    muscles: "Chest, Triceps, Front Delts",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.15, 0.25, 0.4, 0.55], Female: [0.1, 0.18, 0.28, 0.38] },
    cues: ["Dumbbells at chest level.", "Press up and slightly in.", "Control the descent."],
    progression: "Increase weight when you can do 12 reps with good form."
  },
  "db_row": {
    type: 'dumbbell',
    name: "Dumbbell Row",
    target: "Back",
    muscles: "Back, Biceps",
    tags: ["Pull","Upper"],
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.12, 0.22, 0.35, 0.48] },
    cues: ["Row to hip.", "Elbow stays close.", "Squeeze at top."],
    progression: "Add weight when 10-12 reps feel controlled."
  },
  "db_shoulder_press": {
    type: 'dumbbell',
    name: "Dumbbell Shoulder Press",
    target: "Shoulders",
    muscles: "Delts, Triceps",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Start at shoulders.", "Press straight up.", "Control the descent."],
    progression: "Increase when 10-12 reps are solid."
  },
  "db_goblet_squat": {
    type: 'dumbbell',
    name: "Goblet Squat",
    target: "Legs",
    muscles: "Quads, Glutes",
    tags: ["Push","Legs"],
    multipliers: { Male: [0.25, 0.4, 0.6, 0.8], Female: [0.18, 0.3, 0.45, 0.6] },
    cues: ["Hold at chest.", "Squat deep.", "Drive through heels."],
    progression: "Add weight when 15+ reps feel strong."
  },
  "db_lunge": {
    type: 'dumbbell',
    name: "Dumbbell Lunges",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push","Legs"],
    multipliers: { Male: [0.15, 0.25, 0.4, 0.55], Female: [0.1, 0.18, 0.28, 0.4] },
    cues: ["Step forward.", "Knee at 90°.", "Push back to start."],
    progression: "Increase when all reps are controlled."
  },
  "db_curl": {
    type: 'dumbbell',
    name: "Dumbbell Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull","Upper"],
    multipliers: { Male: [0.1, 0.18, 0.28, 0.4], Female: [0.06, 0.12, 0.2, 0.28] },
    cues: ["Elbows fixed.", "Curl to shoulder.", "Slow negative."],
    progression: "Add weight when 12+ strict reps are easy."
  },
  "db_incline_bench": {
    type: 'dumbbell',
    name: "Incline Dumbbell Bench",
    target: "Chest",
    muscles: "Upper Chest, Front Delts",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Bench at 30-45°.", "Press up and in.", "Control the descent."],
    progression: "Add weight when 10-12 reps feel solid."
  },
  "db_lateral_raise": {
    type: 'dumbbell',
    name: "Lateral Raise",
    target: "Shoulders",
    muscles: "Side Delts",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.06, 0.12, 0.2, 0.3], Female: [0.04, 0.08, 0.14, 0.22] },
    cues: ["Slight bend in elbows.", "Lift to shoulder height.", "Control down."],
    progression: "Increase when 12-15 reps are controlled."
  },
  "db_front_raise": {
    type: 'dumbbell',
    name: "Front Raise",
    target: "Shoulders",
    muscles: "Front Delts",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.06, 0.12, 0.2, 0.3], Female: [0.04, 0.08, 0.14, 0.22] },
    cues: ["Arms straight.", "Raise to eye level.", "Controlled movement."],
    progression: "Add weight when 12-15 reps feel easy."
  },
  "db_shrug": {
    type: 'dumbbell',
    name: "Dumbbell Shrug",
    target: "Traps",
    muscles: "Traps, Upper Back",
    tags: ["Pull","Upper"],
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.12, 0.22, 0.35, 0.5] },
    cues: ["Shrug straight up.", "Hold at top.", "Control down."],
    progression: "Increase when 12+ reps are strong."
  },
  "db_rdl": {
    type: 'dumbbell',
    name: "Dumbbell Romanian DL",
    target: "Hamstrings",
    muscles: "Hamstrings, Glutes, Lower Back",
    tags: ["Pull","Legs"],
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.15, 0.25, 0.4, 0.55] },
    cues: ["Hinge at hips.", "Slight knee bend.", "Feel hamstring stretch."],
    progression: "Add weight when 10-12 reps feel controlled."
  },
  "db_hammer_curl": {
    type: 'dumbbell',
    name: "Hammer Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms, Brachialis",
    tags: ["Pull","Upper"],
    multipliers: { Male: [0.1, 0.18, 0.28, 0.4], Female: [0.06, 0.12, 0.2, 0.28] },
    cues: ["Palms facing in.", "Curl up.", "Keep elbows still."],
    progression: "Increase when 12+ reps are strict."
  },
  "db_tricep_kickback": {
    type: 'dumbbell',
    name: "Tricep Kickback",
    target: "Triceps",
    muscles: "Triceps",
    tags: ["Push","Upper"],
    multipliers: { Male: [0.06, 0.12, 0.2, 0.3], Female: [0.04, 0.08, 0.14, 0.22] },
    cues: ["Elbow fixed at side.", "Extend arm back.", "Squeeze at top."],
    progression: "Add weight when 12-15 reps feel controlled."
  },

  // ========== BARBELLS ==========
  "bb_squat": {
    type: 'barbell',
    name: "Barbell Squat",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push","Legs"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.8, 1.2, 1.7, 2.2], Female: [0.5, 0.9, 1.3, 1.7] },
    cues: ["Bar on traps.", "Depth to parallel.", "Drive through heels."],
    progression: "Add weight when you hit 8+ reps with good depth."
  },
  "bb_bench": {
    type: 'barbell',
    name: "Barbell Bench Press",
    target: "Chest",
    muscles: "Chest, Triceps, Front Delts",
    tags: ["Push","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.5, 0.8, 1.1, 1.4], Female: [0.25, 0.45, 0.65, 0.85] },
    cues: ["Bar to mid-chest.", "Elbows 45°.", "Feet planted."],
    progression: "Increase when you can do 8-10 solid reps."
  },
  "bb_deadlift": {
    type: 'barbell',
    name: "Barbell Deadlift",
    target: "Back",
    muscles: "Back, Glutes, Hamstrings",
    tags: ["Pull","Legs"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [1.0, 1.5, 2.0, 2.5], Female: [0.6, 1.0, 1.4, 1.8] },
    cues: ["Bar over mid-foot.", "Chest up.", "Drive through floor."],
    progression: "Add weight when 6-8 reps are strong."
  },
  "bb_row": {
    type: 'barbell',
    name: "Barbell Row",
    target: "Back",
    muscles: "Back, Biceps",
    tags: ["Pull","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.4, 0.65, 0.9, 1.2], Female: [0.25, 0.45, 0.65, 0.85] },
    cues: ["Hinge at hips.", "Row to belly.", "No swinging."],
    progression: "Increase when 10+ reps are controlled."
  },
  "bb_overhead_press": {
    type: 'barbell',
    name: "Overhead Press",
    target: "Shoulders",
    muscles: "Delts, Triceps",
    tags: ["Push","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.3, 0.5, 0.7, 0.95], Female: [0.18, 0.3, 0.45, 0.6] },
    cues: ["Bar at clavicle.", "Press straight up.", "Lockout overhead."],
    progression: "Add weight when 8-10 reps are solid."
  },
  "bb_rdl": {
    type: 'barbell',
    name: "Romanian Deadlift",
    target: "Hamstrings",
    muscles: "Hamstrings, Glutes, Lower Back",
    tags: ["Pull","Legs"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.6, 1.0, 1.4, 1.8], Female: [0.4, 0.7, 1.0, 1.3] },
    cues: ["Hinge at hips.", "Bar close to legs.", "Feel hamstring stretch."],
    progression: "Add weight when 8-10 reps feel strong."
  },
  "bb_front_squat": {
    type: 'barbell',
    name: "Front Squat",
    target: "Quads",
    muscles: "Quads, Core, Upper Back",
    tags: ["Push","Legs"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.6, 1.0, 1.4, 1.8], Female: [0.4, 0.7, 1.0, 1.3] },
    cues: ["Bar on front delts.", "Elbows high.", "Chest up."],
    progression: "Increase when 8+ reps are solid."
  },
  "bb_sumo_deadlift": {
    type: 'barbell',
    name: "Sumo Deadlift",
    target: "Legs",
    muscles: "Glutes, Quads, Hamstrings",
    tags: ["Pull","Legs"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.9, 1.4, 1.9, 2.4], Female: [0.55, 0.95, 1.35, 1.75] },
    cues: ["Wide stance.", "Bar over mid-foot.", "Drive through floor."],
    progression: "Add weight when 6-8 reps are strong."
  },
  "bb_close_grip_bench": {
    type: 'barbell',
    name: "Close-Grip Bench",
    target: "Triceps",
    muscles: "Triceps, Chest",
    tags: ["Push","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.4, 0.7, 1.0, 1.3], Female: [0.22, 0.4, 0.6, 0.8] },
    cues: ["Hands shoulder-width.", "Elbows in.", "Touch lower chest."],
    progression: "Increase when 8-10 reps are controlled."
  },
  "bb_incline_bench": {
    type: 'barbell',
    name: "Incline Barbell Bench",
    target: "Upper Chest",
    muscles: "Upper Chest, Front Delts, Triceps",
    tags: ["Push","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.4, 0.7, 1.0, 1.3], Female: [0.22, 0.4, 0.6, 0.8] },
    cues: ["Bench at 30-45°.", "Bar to upper chest.", "Press straight up."],
    progression: "Add weight when 8-10 reps feel solid."
  },
  "bb_curl": {
    type: 'barbell',
    name: "Barbell Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull","Upper"],
    needsBarWeight: true,
    plateOptions: [25, 10, 5, 2.5],
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.12, 0.22, 0.35, 0.5] },
    cues: ["Elbows at sides.", "Curl to shoulders.", "Control down."],
    progression: "Increase when 10-12 strict reps are easy."
  },
  "bb_shrug": {
    type: 'barbell',
    name: "Barbell Shrug",
    target: "Traps",
    muscles: "Traps, Upper Back",
    tags: ["Pull","Upper"],
    needsBarWeight: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.4, 0.7, 1.0, 1.4], Female: [0.25, 0.45, 0.7, 0.95] },
    cues: ["Shrug straight up.", "Hold at top.", "Don't roll shoulders."],
    progression: "Add weight when 12+ reps are strong."
  },

// ========== EQUIPMENT DATABASE UPGRADE ==========
// Planet Fitness-friendly additions: machines, Smith, dumbbells, bench work,
// assisted bodyweight, glutes, carries, cable moves, and core.
// Usage:
// const EQUIPMENT_DB = {
//   ...EXISTING_EQUIPMENT_DB,
//   ...EQUIPMENT_DB_UPGRADES
// };

  // ========== CARDIO / PF COMMON ==========
  "cardio_treadmill_walk": {
    type: "cardio",
    name: "Treadmill Walk",
    target: "Cardio",
    tags: ["Cardio", "Beginner", "Full Body"],
    cardioGroup: "walking",
    emoji: "🚶",
    cues: ["Tall posture.", "Easy pace to start.", "Use incline only if joints feel good."],
    progression: "Add 2–5 minutes or slight incline as endurance improves."
  },
  "cardio_treadmill_incline": {
    type: "cardio",
    name: "Incline Treadmill Walk",
    target: "Cardio",
    tags: ["Cardio", "Glutes", "Full Body"],
    cardioGroup: "walking",
    emoji: "⛰️",
    cues: ["Shorter steps.", "Don't hang on the rails.", "Keep effort controlled."],
    progression: "Increase incline before speed."
  },
  "cardio_elliptical": {
    type: "cardio",
    name: "Elliptical",
    target: "Cardio",
    tags: ["Cardio", "Low Impact", "Full Body"],
    cardioGroup: "elliptical",
    emoji: "🔁",
    cues: ["Smooth stride.", "Use handles lightly.", "Keep knees tracking forward."],
    progression: "Add resistance or time gradually."
  },
  "cardio_bike": {
    type: "cardio",
    name: "Stationary Bike",
    target: "Cardio",
    tags: ["Cardio", "Low Impact", "Legs"],
    cardioGroup: "bike",
    emoji: "🚲",
    cues: ["Seat height near hip level.", "Smooth pedal stroke.", "Don't lock knees."],
    progression: "Add resistance or intervals."
  },
  "cardio_recumbent_bike": {
    type: "cardio",
    name: "Recumbent Bike",
    target: "Cardio",
    tags: ["Cardio", "Low Impact", "Legs"],
    cardioGroup: "bike",
    emoji: "🚲",
    cues: ["Back supported.", "Knees soft at extension.", "Steady pace."],
    progression: "Increase time first, then resistance."
  },
  "cardio_stair_climber": {
    type: "cardio",
    name: "Stair Climber",
    target: "Cardio",
    tags: ["Cardio", "Glutes", "Legs"],
    cardioGroup: "stairs",
    emoji: "🪜",
    cues: ["Stand tall.", "Light hands on rails.", "Drive through full foot."],
    progression: "Add short blocks of time before increasing speed."
  },
  "cardio_rower": {
    type: "cardio",
    name: "Rowing Machine",
    target: "Cardio",
    tags: ["Cardio", "Pull", "Full Body"],
    cardioGroup: "rowing",
    emoji: "🚣",
    cues: ["Legs, body, arms.", "Arms, body, legs on return.", "Don't yank with shoulders."],
    progression: "Add intervals or total meters."
  },

  // ========== MORE MACHINES ==========
  "machine_incline_chest_press": {
    type: "machine",
    name: "Incline Chest Press",
    target: "Upper Chest",
    muscles: "Upper Chest, Front Delts, Triceps",
    tags: ["Push", "Upper"],
    stackCap: 260,
    multipliers: { Male: [0.25, 0.45, 0.7, 0.95], Female: [0.16, 0.3, 0.48, 0.68] },
    cues: ["Handles upper-chest height.", "Shoulders down and back.", "Press up without shrugging."],
    progression: "Add weight when 10–12 reps are controlled."
  },
  "machine_decline_chest_press": {
    type: "machine",
    name: "Decline Chest Press",
    target: "Lower Chest",
    muscles: "Lower Chest, Triceps, Front Delts",
    tags: ["Push", "Upper"],
    stackCap: 260,
    multipliers: { Male: [0.3, 0.55, 0.85, 1.15], Female: [0.2, 0.35, 0.55, 0.75] },
    cues: ["Handles lower-chest line.", "Keep ribs down.", "Press forward smoothly."],
    progression: "Add weight when 10–12 reps feel clean."
  },
  "machine_rear_delt": {
    type: "machine",
    name: "Rear Delt Fly",
    target: "Rear Delts",
    muscles: "Rear Delts, Upper Back, Traps",
    tags: ["Pull", "Upper", "Shoulders"],
    stackCap: 200,
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.16, 0.26, 0.38] },
    cues: ["Chest on pad.", "Pull with elbows.", "Don't shrug."],
    progression: "Increase when 12–15 reps stay strict."
  },
  "machine_lateral_raise": {
    type: "machine",
    name: "Machine Lateral Raise",
    target: "Shoulders",
    muscles: "Side Delts",
    tags: ["Push", "Upper", "Shoulders"],
    stackCap: 150,
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Pads against upper arms.", "Raise to shoulder height.", "Control down."],
    progression: "Add weight when 12–15 reps are smooth."
  },
  "machine_bicep_curl": {
    type: "machine",
    name: "Machine Bicep Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull", "Upper"],
    stackCap: 150,
    multipliers: { Male: [0.18, 0.32, 0.48, 0.65], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["Elbows on pad.", "Curl without lifting shoulders.", "Slow negative."],
    progression: "Add weight when 10–12 reps are strict."
  },
  "machine_tricep_extension": {
    type: "machine",
    name: "Machine Tricep Extension",
    target: "Triceps",
    muscles: "Triceps",
    tags: ["Push", "Upper"],
    stackCap: 150,
    multipliers: { Male: [0.2, 0.35, 0.55, 0.75], Female: [0.12, 0.24, 0.38, 0.55] },
    cues: ["Elbows planted.", "Extend fully.", "Control return."],
    progression: "Add weight when 12 reps are clean."
  },
  "machine_glute_kickback": {
    type: "machine",
    name: "Glute Kickback Machine",
    target: "Glutes",
    muscles: "Glutes, Hamstrings",
    tags: ["Legs", "Glutes", "Pull"],
    stackCap: 200,
    multipliers: { Male: [0.25, 0.45, 0.7, 0.95], Female: [0.2, 0.35, 0.55, 0.8] },
    cues: ["Brace core.", "Drive through heel.", "Don't arch lower back."],
    progression: "Increase when 12–15 reps per side feel controlled."
  },
  "machine_seated_leg_curl": {
    type: "machine",
    name: "Seated Leg Curl",
    target: "Hamstrings",
    muscles: "Hamstrings",
    tags: ["Pull", "Legs"],
    stackCap: 200,
    multipliers: { Male: [0.35, 0.55, 0.8, 1.05], Female: [0.25, 0.4, 0.6, 0.8] },
    cues: ["Knees aligned with pivot.", "Curl down smoothly.", "Control the return."],
    progression: "Add weight when 12–15 reps are controlled."
  },
  "machine_lying_leg_curl": {
    type: "machine",
    name: "Lying Leg Curl",
    target: "Hamstrings",
    muscles: "Hamstrings",
    tags: ["Pull", "Legs"],
    stackCap: 200,
    multipliers: { Male: [0.3, 0.5, 0.75, 1.0], Female: [0.22, 0.36, 0.55, 0.75] },
    cues: ["Hips down.", "Curl heels toward glutes.", "No bouncing."],
    progression: "Add weight when reps are smooth."
  },
  "machine_horizontal_leg_press": {
    type: "machine",
    name: "Horizontal Leg Press",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push", "Legs", "Glutes"],
    stackCap: 500,
    multipliers: { Male: [0.8, 1.3, 1.9, 2.5], Female: [0.55, 0.9, 1.35, 1.9] },
    cues: ["Feet shoulder-width.", "Control depth.", "Don't lock knees."],
    progression: "Add weight when 12–15 reps feel strong."
  },
  "machine_hack_squat": {
    type: "machine",
    name: "Hack Squat Machine",
    target: "Legs",
    muscles: "Quads, Glutes",
    tags: ["Push", "Legs"],
    stackCap: 600,
    multipliers: { Male: [0.7, 1.1, 1.6, 2.2], Female: [0.45, 0.75, 1.1, 1.55] },
    cues: ["Back flat on pad.", "Knees track with toes.", "Drive through mid-foot."],
    progression: "Increase when 10–12 reps are solid."
  },
  "machine_torso_rotation": {
    type: "machine",
    name: "Torso Rotation",
    target: "Core",
    muscles: "Obliques, Core",
    tags: ["Core"],
    stackCap: 150,
    multipliers: { Male: [0.15, 0.3, 0.45, 0.65], Female: [0.1, 0.2, 0.35, 0.5] },
    cues: ["Rotate from ribs.", "Hips stay planted.", "Slow return."],
    progression: "Add weight when 12–15 reps per side are controlled."
  },
  "machine_captains_chair": {
    type: "machine",
    name: "Captain's Chair Knee Raise",
    target: "Core",
    muscles: "Abs, Hip Flexors",
    tags: ["Core", "Bodyweight"],
    multipliers: { Male: [0.2, 0.35, 0.55, 0.75], Female: [0.12, 0.25, 0.4, 0.6] },
    cues: ["Back against pad.", "Lift knees without swinging.", "Exhale at top."],
    progression: "Add reps before adding straight-leg variations."
  },

  // ========== ASSISTED BODYWEIGHT ==========
  "assisted_pullup": {
    type: "machine",
    name: "Assisted Pull-Up",
    target: "Back",
    muscles: "Lats, Biceps, Upper Back",
    tags: ["Pull", "Upper", "Bodyweight"],
    stackCap: 250,
    assistanceBased: true,
    multipliers: { Male: [0.65, 0.45, 0.3, 0.15], Female: [0.75, 0.55, 0.38, 0.22] },
    cues: ["Set assistance first.", "Pull chest toward handles.", "Control the lower."],
    progression: "Use less assistance when you can hit 8–10 clean reps."
  },
  "assisted_chinup": {
    type: "machine",
    name: "Assisted Chin-Up",
    target: "Back",
    muscles: "Lats, Biceps",
    tags: ["Pull", "Upper", "Bodyweight"],
    stackCap: 250,
    assistanceBased: true,
    multipliers: { Male: [0.6, 0.42, 0.28, 0.15], Female: [0.7, 0.5, 0.35, 0.22] },
    cues: ["Palms facing you.", "Pull elbows down.", "No swinging."],
    progression: "Reduce assistance as reps improve."
  },
  "assisted_dip": {
    type: "machine",
    name: "Assisted Dip",
    target: "Triceps",
    muscles: "Triceps, Chest, Front Delts",
    tags: ["Push", "Upper", "Bodyweight"],
    stackCap: 250,
    assistanceBased: true,
    multipliers: { Male: [0.6, 0.42, 0.28, 0.15], Female: [0.7, 0.5, 0.35, 0.22] },
    cues: ["Shoulders down.", "Elbows bend back.", "Press tall at top."],
    progression: "Use less assistance when 8–10 reps are controlled."
  },

  // ========== CABLE / FUNCTIONAL TRAINER ==========
  "cable_chest_fly": {
    type: "machine",
    name: "Cable Chest Fly",
    target: "Chest",
    muscles: "Chest, Front Delts",
    tags: ["Push", "Upper"],
    stackCap: 150,
    ratio: 0.5,
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.16, 0.25, 0.38] },
    cues: ["Soft elbows.", "Hug the tree.", "Squeeze chest without shrugging."],
    progression: "Add weight when 12–15 reps are controlled."
  },
  "cable_low_row": {
    type: "machine",
    name: "Cable Low Row",
    target: "Back",
    muscles: "Lats, Mid Back, Biceps",
    tags: ["Pull", "Upper"],
    stackCap: 200,
    ratio: 0.5,
    multipliers: { Male: [0.3, 0.5, 0.75, 1.0], Female: [0.2, 0.35, 0.55, 0.75] },
    cues: ["Tall chest.", "Pull to lower ribs.", "Squeeze shoulder blades."],
    progression: "Add weight when 10–12 reps are clean."
  },
  "cable_face_pull": {
    type: "machine",
    name: "Cable Face Pull",
    target: "Rear Delts",
    muscles: "Rear Delts, Rotator Cuff, Upper Back",
    tags: ["Pull", "Upper", "Shoulders"],
    stackCap: 100,
    ratio: 0.5,
    multipliers: { Male: [0.1, 0.18, 0.28, 0.4], Female: [0.06, 0.12, 0.2, 0.3] },
    cues: ["Pull rope toward face.", "Elbows high.", "Don't lean back."],
    progression: "Add reps first, then weight."
  },
  "cable_lat_prayer": {
    type: "machine",
    name: "Straight-Arm Pulldown",
    target: "Back",
    muscles: "Lats, Core",
    tags: ["Pull", "Upper"],
    stackCap: 150,
    ratio: 0.5,
    multipliers: { Male: [0.15, 0.28, 0.42, 0.6], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["Arms mostly straight.", "Pull bar to thighs.", "Feel lats, not triceps."],
    progression: "Increase when 12–15 reps feel controlled."
  },
  "cable_glute_kickback": {
    type: "machine",
    name: "Cable Glute Kickback",
    target: "Glutes",
    muscles: "Glutes, Hamstrings",
    tags: ["Legs", "Glutes", "Pull"],
    stackCap: 100,
    ratio: 0.5,
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.1, 0.18, 0.3, 0.42] },
    cues: ["Ankle strap low pulley.", "Brace core.", "Kick back without arching."],
    progression: "Add weight when 12–15 reps per side are clean."
  },
  "cable_pull_through": {
    type: "machine",
    name: "Cable Pull-Through",
    target: "Glutes",
    muscles: "Glutes, Hamstrings, Lower Back",
    tags: ["Pull", "Legs", "Glutes"],
    stackCap: 150,
    ratio: 0.5,
    multipliers: { Male: [0.2, 0.35, 0.55, 0.75], Female: [0.15, 0.25, 0.4, 0.6] },
    cues: ["Face away from pulley.", "Hinge hips back.", "Squeeze glutes to stand."],
    progression: "Increase when 12–15 reps feel smooth."
  },
  "cable_pallof_press": {
    type: "machine",
    name: "Pallof Press",
    target: "Core",
    muscles: "Core, Obliques",
    tags: ["Core", "Anti-Rotation"],
    stackCap: 100,
    ratio: 0.5,
    multipliers: { Male: [0.08, 0.15, 0.25, 0.35], Female: [0.06, 0.12, 0.2, 0.3] },
    cues: ["Stand sideways to cable.", "Press straight out.", "Resist rotation."],
    progression: "Add hold time before weight."
  },

  // ========== SMITH MACHINE VARIATIONS ==========
  "smith_bench_press": {
    type: "machine",
    name: "Smith Machine Bench Press",
    target: "Chest",
    muscles: "Chest, Triceps, Front Delts",
    tags: ["Push", "Upper"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.45, 0.75, 1.05, 1.35], Female: [0.25, 0.42, 0.62, 0.82] },
    cues: ["Bar to mid-chest.", "Set safeties.", "Wrists stacked."],
    progression: "Add weight when 8–10 reps are solid."
  },
  "smith_incline_bench": {
    type: "machine",
    name: "Smith Incline Bench",
    target: "Upper Chest",
    muscles: "Upper Chest, Front Delts, Triceps",
    tags: ["Push", "Upper"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.38, 0.65, 0.95, 1.2], Female: [0.22, 0.38, 0.58, 0.78] },
    cues: ["Bench 30–45°.", "Bar to upper chest.", "Set safeties."],
    progression: "Add weight when 8–10 reps feel controlled."
  },
  "smith_squat": {
    type: "machine",
    name: "Smith Machine Squat",
    target: "Legs",
    muscles: "Quads, Glutes",
    tags: ["Push", "Legs", "Glutes"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.6, 1.0, 1.5, 2.0], Female: [0.4, 0.7, 1.1, 1.5] },
    cues: ["Feet slightly forward.", "Chest tall.", "Drive through mid-foot."],
    progression: "Add weight when 10 reps are clean."
  },
  "smith_hip_thrust": {
    type: "machine",
    name: "Smith Machine Hip Thrust",
    target: "Glutes",
    muscles: "Glutes, Hamstrings",
    tags: ["Glutes", "Legs", "Push"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.7, 1.1, 1.6, 2.2], Female: [0.5, 0.85, 1.25, 1.75] },
    cues: ["Upper back on bench.", "Chin tucked.", "Squeeze glutes at top."],
    progression: "Add weight when 10–12 reps feel strong."
  },
  "smith_rdl": {
    type: "machine",
    name: "Smith Machine RDL",
    target: "Hamstrings",
    muscles: "Hamstrings, Glutes, Lower Back",
    tags: ["Pull", "Legs", "Glutes"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.55, 0.9, 1.3, 1.7], Female: [0.35, 0.65, 0.95, 1.25] },
    cues: ["Soft knees.", "Hips back.", "Bar close to legs."],
    progression: "Add weight when 8–10 reps are controlled."
  },
  "smith_split_squat": {
    type: "machine",
    name: "Smith Split Squat",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push", "Legs", "Glutes"],
    needsBarWeight: true,
    smithMachine: true,
    plateOptions: [45, 35, 25, 10, 5, 2.5],
    multipliers: { Male: [0.25, 0.45, 0.7, 0.95], Female: [0.16, 0.3, 0.5, 0.7] },
    cues: ["Staggered stance.", "Front foot planted.", "Control depth."],
    progression: "Add reps before adding weight."
  },

  // ========== DUMBBELL BENCH / UPPER ==========
  "db_flat_bench_press": {
    type: "dumbbell",
    name: "Flat Dumbbell Bench Press",
    target: "Chest",
    muscles: "Chest, Triceps, Front Delts",
    tags: ["Push", "Upper"],
    multipliers: { Male: [0.15, 0.25, 0.4, 0.55], Female: [0.1, 0.18, 0.28, 0.38] },
    cues: ["Dumbbells at chest.", "Press up and slightly in.", "Control lower."],
    progression: "Increase when 10–12 reps are clean."
  },
  "db_decline_bench_press": {
    type: "dumbbell",
    name: "Decline Dumbbell Bench Press",
    target: "Lower Chest",
    muscles: "Lower Chest, Triceps, Front Delts",
    tags: ["Push", "Upper"],
    multipliers: { Male: [0.15, 0.25, 0.4, 0.55], Female: [0.1, 0.18, 0.28, 0.38] },
    cues: ["Keep shoulders packed.", "Press from lower chest.", "Avoid flaring elbows."],
    progression: "Add weight when 10–12 reps feel solid."
  },
  "db_chest_fly": {
    type: "dumbbell",
    name: "Dumbbell Chest Fly",
    target: "Chest",
    muscles: "Chest, Front Delts",
    tags: ["Push", "Upper"],
    multipliers: { Male: [0.08, 0.14, 0.22, 0.32], Female: [0.05, 0.1, 0.16, 0.24] },
    cues: ["Soft elbows.", "Lower slowly.", "Squeeze chest to return."],
    progression: "Add reps first; this one gets spicy fast."
  },
  "db_incline_chest_fly": {
    type: "dumbbell",
    name: "Incline Dumbbell Fly",
    target: "Upper Chest",
    muscles: "Upper Chest, Front Delts",
    tags: ["Push", "Upper"],
    multipliers: { Male: [0.06, 0.12, 0.2, 0.3], Female: [0.04, 0.08, 0.14, 0.22] },
    cues: ["Bench 30–45°.", "Wide arc.", "Stop before shoulder strain."],
    progression: "Add reps before adding weight."
  },
  "db_seated_shoulder_press": {
    type: "dumbbell",
    name: "Seated Dumbbell Shoulder Press",
    target: "Shoulders",
    muscles: "Delts, Triceps",
    tags: ["Push", "Upper", "Shoulders"],
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Back supported.", "Press straight up.", "Don't shrug."],
    progression: "Increase when 8–12 reps are solid."
  },
  "db_incline_row": {
    type: "dumbbell",
    name: "Chest-Supported Dumbbell Row",
    target: "Back",
    muscles: "Back, Rear Delts, Biceps",
    tags: ["Pull", "Upper"],
    multipliers: { Male: [0.18, 0.3, 0.45, 0.62], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["Chest on incline bench.", "Row elbows back.", "No swinging."],
    progression: "Add weight when 10–12 reps are clean."
  },
  "db_pullover": {
    type: "dumbbell",
    name: "Dumbbell Pullover",
    target: "Back",
    muscles: "Lats, Chest, Core",
    tags: ["Pull", "Upper"],
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Ribs down.", "Arms mostly straight.", "Pull from lats."],
    progression: "Add weight only if shoulders feel good."
  },
  "db_skull_crusher": {
    type: "dumbbell",
    name: "Dumbbell Skull Crusher",
    target: "Triceps",
    muscles: "Triceps",
    tags: ["Push", "Upper"],
    multipliers: { Male: [0.08, 0.14, 0.22, 0.32], Female: [0.05, 0.1, 0.16, 0.24] },
    cues: ["Elbows point up.", "Lower near ears.", "Extend without flaring."],
    progression: "Add reps before weight."
  },
  "db_concentration_curl": {
    type: "dumbbell",
    name: "Concentration Curl",
    target: "Biceps",
    muscles: "Biceps",
    tags: ["Pull", "Upper"],
    multipliers: { Male: [0.08, 0.14, 0.22, 0.32], Female: [0.05, 0.1, 0.16, 0.24] },
    cues: ["Elbow against thigh.", "Curl slowly.", "No body swing."],
    progression: "Increase when 10–12 strict reps are easy."
  },

  // ========== DUMBBELL LEGS / GLUTES ==========
  "db_bulgarian_split_squat": {
    type: "dumbbell",
    name: "Bulgarian Split Squat",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push", "Legs", "Glutes"],
    multipliers: { Male: [0.1, 0.18, 0.3, 0.42], Female: [0.06, 0.12, 0.22, 0.32] },
    cues: ["Back foot on bench.", "Front foot stable.", "Control the drop."],
    progression: "Add reps first. This one is legally a villain."
  },
  "db_step_up": {
    type: "dumbbell",
    name: "Dumbbell Step-Up",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Push", "Legs", "Glutes"],
    multipliers: { Male: [0.12, 0.22, 0.35, 0.5], Female: [0.08, 0.15, 0.25, 0.35] },
    cues: ["Whole foot on bench.", "Drive through front leg.", "Control down."],
    progression: "Increase reps or dumbbell weight gradually."
  },
  "db_hip_thrust": {
    type: "dumbbell",
    name: "Dumbbell Hip Thrust",
    target: "Glutes",
    muscles: "Glutes, Hamstrings",
    tags: ["Glutes", "Legs"],
    multipliers: { Male: [0.25, 0.45, 0.65, 0.9], Female: [0.18, 0.32, 0.5, 0.7] },
    cues: ["Upper back on bench.", "Dumbbell over hips.", "Squeeze glutes at top."],
    progression: "Add weight when 12–15 reps are strong."
  },
  "db_glute_bridge": {
    type: "dumbbell",
    name: "Dumbbell Glute Bridge",
    target: "Glutes",
    muscles: "Glutes, Hamstrings",
    tags: ["Glutes", "Legs"],
    multipliers: { Male: [0.2, 0.35, 0.55, 0.75], Female: [0.15, 0.28, 0.42, 0.6] },
    cues: ["Shoulders on floor.", "Dumbbell over hips.", "Don't overarch."],
    progression: "Add pauses or weight."
  },
  "db_sumo_squat": {
    type: "dumbbell",
    name: "Dumbbell Sumo Squat",
    target: "Legs",
    muscles: "Glutes, Quads, Adductors",
    tags: ["Push", "Legs", "Glutes"],
    multipliers: { Male: [0.25, 0.4, 0.6, 0.85], Female: [0.18, 0.3, 0.45, 0.65] },
    cues: ["Wide stance.", "Toes slightly out.", "Drive knees out."],
    progression: "Add weight when 12–15 reps are strong."
  },
  "db_single_leg_rdl": {
    type: "dumbbell",
    name: "Single-Leg Dumbbell RDL",
    target: "Hamstrings",
    muscles: "Hamstrings, Glutes, Balance",
    tags: ["Pull", "Legs", "Glutes"],
    multipliers: { Male: [0.08, 0.16, 0.25, 0.36], Female: [0.05, 0.1, 0.18, 0.28] },
    cues: ["Hinge at hip.", "Hips stay square.", "Use support if needed."],
    progression: "Add control before adding weight."
  },

  // ========== CARRIES ==========
  "db_farmers_carry": {
    type: "dumbbell",
    name: "Dumbbell Farmer's Carry",
    target: "Full Body",
    muscles: "Grip, Traps, Core, Legs",
    tags: ["Full Body", "Core", "Carry"],
    distanceBased: true,
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.12, 0.22, 0.35, 0.5] },
    cues: ["Stand tall.", "Shoulders down.", "Walk slow and controlled."],
    progression: "Add distance, time, or weight."
  },
  "db_suitcase_carry": {
    type: "dumbbell",
    name: "Suitcase Carry",
    target: "Core",
    muscles: "Obliques, Grip, Traps",
    tags: ["Core", "Carry", "Full Body"],
    distanceBased: true,
    multipliers: { Male: [0.18, 0.32, 0.48, 0.65], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["One dumbbell.", "Don't lean.", "Walk tall."],
    progression: "Add distance or weight per side."
  },

  // ========== BARBELL / FIXED BAR / CURL BAR ==========
  "bb_fixed_curl": {
    type: "barbell",
    name: "Fixed Bar Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull", "Upper"],
    needsBarWeight: false,
    multipliers: { Male: [0.18, 0.32, 0.48, 0.65], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["Elbows tucked.", "No swinging.", "Slow negative."],
    progression: "Add weight when 10–12 strict reps are easy."
  },
  "bb_ez_bar_curl": {
    type: "barbell",
    name: "EZ-Bar Curl",
    target: "Biceps",
    muscles: "Biceps, Forearms",
    tags: ["Pull", "Upper"],
    needsBarWeight: true,
    plateOptions: [25, 10, 5, 2.5],
    multipliers: { Male: [0.18, 0.32, 0.48, 0.65], Female: [0.1, 0.2, 0.32, 0.45] },
    cues: ["Wrists neutral.", "Elbows at sides.", "Curl without leaning."],
    progression: "Increase when 10–12 reps are strict."
  },
  "bb_ez_skull_crusher": {
    type: "barbell",
    name: "EZ-Bar Skull Crusher",
    target: "Triceps",
    muscles: "Triceps",
    tags: ["Push", "Upper"],
    needsBarWeight: true,
    plateOptions: [25, 10, 5, 2.5],
    multipliers: { Male: [0.15, 0.28, 0.42, 0.6], Female: [0.08, 0.16, 0.28, 0.4] },
    cues: ["Elbows point up.", "Lower behind head.", "Extend smoothly."],
    progression: "Add reps first, then weight."
  },

  // ========== BODYWEIGHT / BENCH CORE ==========
  "bodyweight_incline_pushup": {
    type: "bodyweight",
    name: "Incline Push-Up",
    target: "Chest",
    muscles: "Chest, Triceps, Core",
    tags: ["Push", "Upper", "Beginner"],
    multipliers: { Male: [0.25, 0.4, 0.55, 0.7], Female: [0.18, 0.3, 0.45, 0.6] },
    cues: ["Hands on bench.", "Body straight.", "Chest to bench."],
    progression: "Lower the incline as strength improves."
  },
  "bodyweight_bench_dip": {
    type: "bodyweight",
    name: "Bench Dip",
    target: "Triceps",
    muscles: "Triceps, Chest, Shoulders",
    tags: ["Push", "Upper", "Bodyweight"],
    multipliers: { Male: [0.25, 0.4, 0.6, 0.8], Female: [0.18, 0.3, 0.45, 0.65] },
    cues: ["Shoulders down.", "Elbows back.", "Keep range pain-free."],
    progression: "Add reps before elevating feet."
  },
  "bodyweight_step_up": {
    type: "bodyweight",
    name: "Bodyweight Step-Up",
    target: "Legs",
    muscles: "Quads, Glutes, Hamstrings",
    tags: ["Legs", "Glutes", "Beginner"],
    multipliers: { Male: [0.2, 0.35, 0.5, 0.7], Female: [0.15, 0.28, 0.42, 0.6] },
    cues: ["Whole foot on bench.", "Drive through front leg.", "Control down."],
    progression: "Add dumbbells when bodyweight is easy."
  },
  "bodyweight_plank": {
    type: "bodyweight",
    name: "Plank",
    target: "Core",
    muscles: "Abs, Core, Shoulders",
    tags: ["Core", "Bodyweight"],
    timeBased: true,
    multipliers: { Male: [0.2, 0.35, 0.55, 0.75], Female: [0.15, 0.3, 0.45, 0.65] },
    cues: ["Ribs down.", "Squeeze glutes.", "Don't sag."],
    progression: "Add time in 5–10 second chunks."
  },
  "bodyweight_side_plank": {
    type: "bodyweight",
    name: "Side Plank",
    target: "Core",
    muscles: "Obliques, Core, Shoulders",
    tags: ["Core", "Bodyweight"],
    timeBased: true,
    multipliers: { Male: [0.15, 0.3, 0.45, 0.65], Female: [0.12, 0.24, 0.38, 0.55] },
    cues: ["Elbow under shoulder.", "Hips up.", "Stay stacked."],
    progression: "Add time per side."
  },

  // ========== EASTER EGGS ==========
  "kung_fu": {
    type: 'easterEgg',
    name: "Kung Fu",
    target: "Mind",
    muscles: "Neo",
    tags: ["Full Body"],
    emoji: "😎"
  },
  "power_up": {
    type: 'easterEgg',
    name: "Power Up",
    target: "Spirit",
    muscles: "Saiyan",
    tags: ["Full Body"],
    emoji: "⚡"
  }
};edia Type
