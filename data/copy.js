// ============================================================
// PLANET STRENGTH — COPY
// Edit all UI text here. Strings are grouped by screen/context.
// ============================================================

// ── BRAND ───────────────────────────────────────────────────
const COPY_BRAND = {
  name: 'Planet Strength',
  tagline: 'Built by Nobody.',
  subtagline: 'For everybody.',
};

// ── MANIFESTO TICKER ────────────────────────────────────────
// Scrolls across the top of every screen.
// Alternating items get yellow highlight treatment.
const COPY_TICKER = [
  'Trust Nobody.',
  'Progress is a private conversation between you and the weights.',
  'No logins. No noise. No participation trophies.',
  'Show up. Log the work. Repeat.',
  'Built by Nobody.',
  'Maintenance is a biological requirement. Do the work.',
  'Nobody asked. We built it anyway.',
  'Your data stays yours. Always.',
  'Gravity is the only judge.',
  'The bar doesn\'t care about your excuses.',
];

// ── ONBOARDING ───────────────────────────────────────────────
// Steps shown before the form. type: 'intro' renders title/subhead/body.
const COPY_ONBOARDING_STEPS = [
  {
    type: 'intro',
    emoji: '🪐',
    title: 'Planet Strength',
    subhead: 'A tracker that gets out of your way.',
    body: 'Log sets fast.\nWatch numbers move.\nNo programs. No guilt. No noise.',
  },
  {
    type: 'intro',
    emoji: '💪',
    title: 'You vs. You.',
    subhead: null,
    body: 'Add a rep. Add a little weight.\nOr just show up again.\nThat\'s the whole game.',
  },
  { type: 'form' },
];

// ── HOME SCREEN ──────────────────────────────────────────────
const COPY_HOME = {
  welcomeDefault: 'Welcome back',
  headerSubtitle: 'Let\'s build.',
  ctaButton: 'Build Today\'s Workout',
  tilesQuickStart: 'Quick Start',
  tilesTemplates: 'Templates',
  tilesTemplatesAccent: 'Start',
  tilesTemplatesSubtitle: 'Without Thinking',
  tilesPrevious: 'Previous',
  tilesLastSession: 'Last Session',
  inspirationLabel: 'Inspiration',
};

// ── WORKOUT SCREEN ───────────────────────────────────────────
const COPY_WORKOUT = {
  headerSubtitle: 'Let\'s build.',
  sessionModeSub: 'Log as you go.',
  draftModeSub: 'Edit and start when ready.',
  emptySession: 'Add exercises to get started.',
  addExercise: '+ Add exercise',
  finishWorkout: 'Finish Workout',
  startToday: 'Start Today',
  draftedToday: 'Drafted for today',
  browseLibrary: 'Browse library',
  closeLibrary: 'Close library',
  searchPlaceholder: 'Search exercises...',
  noExercisesMatch: 'No exercises match.',
};

// ── EXERCISE LOGGER (EquipmentDetail modal) ──────────────────
const COPY_LOGGER = {
  tabLog: 'Log',
  tabCues: 'Cues & Info',
  addSet: '+ Add Set',
  setsLabel: 'Sets',
  noSetsYet: 'Log your first set above.',
  finishLabel: 'Done',
  finishCta: 'Close Exercise',
  unlockSuggestion: 'Log 2 sessions to unlock a progression suggestion.',
};

// ── COACH / PUSH MESSAGES ────────────────────────────────────
// Short toasts shown contextually.
const COPY_PUSH = {
  workoutSaved: 'Logged.',
  restDayLogged: 'Rest day. Good call.',
  restDayRemoved: 'Rest day removed.',
  readyDefault: 'Ready when you are.',
  welcomeBack: [
    'Welcome back.',
    'Good to see you.',
    'Ready when you are.',
  ],
  welcomeBackLong: 'Welcome back. Pick up where you left off.',
};

// ── COACH STRIP MESSAGES ─────────────────────────────────────
// Shown on home based on streak + sessions this week.
const getCoachMessage = ({ streak, sessionsThisWeek }) => {
  if (streak >= 4) return `${streak}-day streak. Don\'t stop now.`;
  if (sessionsThisWeek === 0) return 'First session of the week. Set the tone.';
  if (sessionsThisWeek >= 3) return `${sessionsThisWeek} sessions this week. Momentum is real.`;
  return 'Show up. Log the work. Let the numbers do the talking.';
};

// ── QUOTES — HOME (daily rotation) ──────────────────────────
const homeQuotes = [
  { text: 'Get busy living, or get busy dying.', movie: 'The Shawshank Redemption' },
  { text: 'Do. Or do not. There is no try.', movie: 'Star Wars: The Empire Strikes Back' },
  { text: 'Why do we fall? So we can learn to pick ourselves up.', movie: 'Batman Begins' },
  { text: 'Just keep swimming.', movie: 'Finding Nemo' },
  { text: 'Carpe diem. Seize the day.', movie: 'Dead Poets Society' },
  { text: 'Pain is temporary. Quitting lasts forever.', movie: 'Rocky IV' },
  { text: 'What we do in life echoes in eternity.', movie: 'Gladiator' },
  { text: 'Every accomplishment starts with the decision to try.', movie: 'Rudy' },
];

// ── QUOTES — POST WORKOUT ────────────────────────────────────
const postWorkoutQuotes = [
  { text: 'It\'s what you do right now that makes a difference.', movie: 'Black Hawk Down' },
  { text: 'It\'s not who I am underneath, but what I do that defines me.', movie: 'Batman Begins' },
  { text: 'You are what you choose to be.', movie: 'The Iron Giant' },
  { text: 'Every man dies. Not every man really lives.', movie: 'Braveheart' },
  { text: 'What we do in life echoes in eternity.', movie: 'Gladiator' },
  { text: 'The measure of a man is what he does with power.', movie: 'Gladiator' },
];

// ── QUOTES — REST DAY ────────────────────────────────────────
const restDayQuotes = [
  { text: 'Rest is not quitting. Rest is reloading.', movie: 'Nobody' },
  { text: 'There\'s a time for daring and a time for caution.', movie: 'Dead Poets Society' },
  { text: 'Recovery is part of the work.', movie: 'Planet Strength' },
  { text: 'Hakuna Matata.', movie: 'The Lion King' },
  { text: 'Keep breathing.', movie: 'Gravity' },
];

// ── QUOTES — MOTIVATIONAL (analytics / patterns) ─────────────
const motivationalQuotes = [
  { quote: 'Get busy living, or get busy dying.', author: 'The Shawshank Redemption' },
  { quote: 'It\'s not about how hard you hit. It\'s about how hard you can get hit and keep moving forward.', author: 'Rocky Balboa' },
  { quote: 'Do, or do not. There is no try.', author: 'Star Wars: The Empire Strikes Back' },
  { quote: 'Why do we fall? So we can learn to pick ourselves up.', author: 'Batman Begins' },
  { quote: 'Great men are not born great, they grow great.', author: 'The Godfather' },
  { quote: 'The future is not set. There is no fate but what we make.', author: 'Terminator 2: Judgment Day' },
  { quote: 'It\'s what you do right now that makes a difference.', author: 'Black Hawk Down' },
  { quote: 'Carpe diem. Seize the day. Make your lives extraordinary.', author: 'Dead Poets Society' },
  { quote: 'We are who we choose to be. Now choose.', author: 'Spider-Man' },
  { quote: 'You have power over your mind—not outside events.', author: 'Gladiator' },
  { quote: 'Every man dies. Not every man really lives.', author: 'Braveheart' },
  { quote: 'You are what you choose to be.', author: 'The Iron Giant' },
  { quote: 'Even the smallest person can change the course of the future.', author: 'The Lord of the Rings' },
  { quote: 'Sometimes you gotta run before you can walk.', author: 'Iron Man' },
  { quote: 'What we do in life echoes in eternity.', author: 'Gladiator' },
  { quote: 'Life moves fast. Stop and look around once in a while.', author: 'Ferris Bueller\'s Day Off' },
  { quote: 'You have to believe in yourself.', author: 'Rocky II' },
  { quote: 'No one knows what they\'re capable of until they try.', author: 'Gattaca' },
];
