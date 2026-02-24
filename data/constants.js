// ========== APP METADATA ==========
const APP_VERSION = '1.0.0';
const FEEDBACK_EMAIL = 'planetstrength@nobodystudios.com';
const FOLLOW_URL = 'https://www.instagram.com/nobodystudios/';
const DONATE_URL = 'https://account.venmo.com/u/bensoup';

// ========== TIMING CONSTANTS ==========
const TIMING = {
  TRIPLE_TAP_WINDOW: 1000,
  LONG_PRESS_AVATAR: 1500,
  LONG_PRESS_REST_DAY: 2000,
  TOAST_DURATION: 1500,
  MESSAGE_DURATION: 3200,
  DEBOUNCE_STORAGE: 500
};

// ========== THRESHOLDS ==========
const THRESHOLDS = {
  REST_DAY_PROMPT_DAYS: 4,           // Days of inactivity before showing "But Did You Die?" prompt
  MOTIVATION_PROBABILITY: 0.35,      // Chance of showing motivation message on return (35%)
  RAGE_TAP_COUNT: 5,                 // Taps required to trigger rage tap easter egg
  MIXED_CORE_RATIO: 0.35,            // Ratio of mixed core days to detect pattern
  MIN_SESSIONS_FOR_PATTERNS: 4,      // Minimum sessions before detecting workout patterns
  WEEKLY_FREQUENCY_THRESHOLD: 4,     // Weekly workouts to qualify as "consistent"
  UNIQUE_MUSCLE_GROUPS_THRESHOLD: 4  // Unique groups to qualify as "varied"
};

// ========== DURATION OPTIONS ==========
const DURATION_OPTIONS = [30, 45, 60]; // Cardio duration options in minutes

// ========== STORAGE KEYS ==========
const STORAGE_KEYS = {
  VERSION: 3,
  META: 'ps_v3_meta',
  ONBOARDING: 'ps_onboarding_complete',
  ACTIVE_SESSION: 'ps_active_session',
  DRAFT_SESSION: 'ps_draft_session',
  TODAY_WORKOUT: 'ps_today_workout',
  TODAY_SESSION: 'ps_today_session',
  REST_DAYS: 'restDayDates',
  LAST_OPEN: 'ps_last_open',
  THEME_MODE: 'ps_theme_mode',
  DARK_VARIANT: 'ps_dark_variant',
  DEBUG: 'ps_debug'
};

// Legacy aliases for backward compatibility
const STORAGE_VERSION = STORAGE_KEYS.VERSION;
const STORAGE_KEY = STORAGE_KEYS.META;
const ONBOARDING_KEY = STORAGE_KEYS.ONBOARDING;
const ACTIVE_SESSION_KEY = STORAGE_KEYS.ACTIVE_SESSION;
const DRAFT_SESSION_KEY = STORAGE_KEYS.DRAFT_SESSION;
const TODAY_WORKOUT_KEY = STORAGE_KEYS.TODAY_WORKOUT;
const TODAY_SESSION_KEY = STORAGE_KEYS.TODAY_SESSION;
const REST_DAY_KEY = STORAGE_KEYS.REST_DAYS;
const LAST_OPEN_KEY = STORAGE_KEYS.LAST_OPEN;
const THEME_MODE_KEY = STORAGE_KEYS.THEME_MODE;
const DARK_VARIANT_KEY = STORAGE_KEYS.DARK_VARIANT;

// ========== USER PROFILE OPTIONS ==========
const AVATARS = ["🦁","🦍","🦖","💪","🏃","🧘","🤖","👽","🦊","⚡"];

const EXPERIENCE_LEVELS = [
  { label: 'Beginner', desc: '0–3 months', detail: 'New to lifting or restarting' },
  { label: 'Novice', desc: '3–9 months', detail: 'Learning form + consistency' },
  { label: 'Intermediate', desc: '1–2 years', detail: 'Progressing steadily' },
  { label: 'Advanced', desc: '3+ years', detail: 'Dialed in + consistent' }
];

const ACTIVITY_LEVELS = [
  { label: 'Sedentary', emoji: '🪑', desc: 'Desk job, minimal movement', multiplier: 0.85 },
  { label: 'Lightly Active', emoji: '🚶', desc: 'Some walking', multiplier: 0.95 },
  { label: 'Moderately Active', emoji: '🏃', desc: 'Regular movement', multiplier: 1.0 },
  { label: 'Very Active', emoji: '💪', desc: 'Physical + training', multiplier: 1.1 },
  { label: 'Athlete', emoji: '🏆', desc: 'High volume training', multiplier: 1.2 }
];

const GOALS = [
  { id: 'strength', label: 'Strength Gain', emoji: '💪', desc: 'Push weight up, focus on PRs', bias: { reps: 'lower', cardio: 'lower' } },
  { id: 'recomp', label: 'Body Recomp', emoji: '🔄', desc: 'Build strength while leaning out', bias: { reps: 'middle', cardio: 'middle' } },
  { id: 'fatloss', label: 'Fat Loss', emoji: '🔥', desc: 'Consistency + reps + recovery', bias: { reps: 'higher', cardio: 'higher' } },
  { id: 'health', label: 'General Health', emoji: '❤️', desc: 'Keep it simple and sustainable', bias: { reps: 'middle', cardio: 'middle' } }
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', emoji: '✅', desc: 'Could do 3+ more reps' },
  { value: 'good', label: 'Good', emoji: '💪', desc: '1–2 reps in tank' },
  { value: 'hard', label: 'Hard', emoji: '😤', desc: 'Barely finished' },
  { value: 'failed', label: 'Failed', emoji: '❌', desc: "Could not complete" }
];

// ========== GYM CONFIGURATIONS ==========
const GYM_TYPES = {
  planet: { 
    label: "Planet Fitness",
    emoji: "🟣",
    machines: true,
    dumbbells: { available: true, max: 75, increments: [5] },
    barbells: { available: true, standardBar: 45 },
    machineStackCap: 260
  },
  commercial: {
    label: "Commercial Gym",
    emoji: "🏋️",
    desc: "LA Fitness, Golds, 24 Hour, etc",
    machines: true,
    dumbbells: { available: true, max: 120, increments: [2.5, 5] },
    barbells: { available: true, standardBar: 45 },
    machineStackCap: 300
  },
  iron: {
    label: "Powerlifting Gym",
    emoji: "⚡",
    desc: "Serious iron, heavy weights",
    machines: false,
    dumbbells: { available: true, max: 150, increments: [2.5, 5, 10] },
    barbells: { available: true, standardBar: 45 },
    machineStackCap: null
  },
  home: {
    label: "Home Gym",
    emoji: "🏠",
    machines: false,
    dumbbells: { available: true, max: 100, increments: [5] },
    barbells: { available: true, standardBar: 45 },
    machineStackCap: null
  }
};

// ========== CARDIO TYPES ==========
const CARDIO_TYPES = {
  swimming: {
    name: 'Swimming',
    emoji: '🏊',
    color: 'cyan',
    regularActivities: [
      { id: 'laps', label: 'Swimming Laps', emoji: '🏊' },
      { id: 'water_walk', label: 'Water Walking', emoji: '🚶' },
      { id: 'water_aerobics', label: 'Water Aerobics', emoji: '💃' },
      { id: 'treading', label: 'Treading Water', emoji: '🌊' },
      { id: 'casual', label: 'Casual Swim', emoji: '😎' }
    ],
    proMetrics: ['distance', 'pace', 'strokes']
  },
  running: {
    name: 'Running',
    emoji: '🏃',
    color: 'orange',
    regularActivities: [
      { id: 'treadmill', label: 'Treadmill', emoji: '🏃' },
      { id: 'outdoor', label: 'Outdoor Run', emoji: '🌳' },
      { id: 'walk', label: 'Walking', emoji: '🚶' },
      { id: 'hiit', label: 'HIIT/Intervals', emoji: '⚡' },
      { id: 'cooldown', label: 'Cool Down Walk', emoji: '🧘' }
    ],
    proMetrics: ['distance', 'pace', 'elevation']
  }
};

// ========== MOTIVATIONAL QUOTES ==========
// NOTE: homeQuotes, postWorkoutQuotes, restDayQuotes, motivationalQuotes
// and getCoachMessage have moved to data/copy.js

// NOTE: MUSCLE_BADGE_CONFIG remains in script.js as it contains JSX elements
