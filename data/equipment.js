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
};
