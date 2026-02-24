// ========== SEARCH & EXERCISE UTILITIES ==========
// Pure utility functions — no React, no state.
// Depends on: EQUIPMENT_DB (data/equipment.js), normalizeSearch (data/constants.js or utils)
// Extracted from script.js for clarity.

const SEARCH_ALIASES = {
  rdl: 'romanian deadlift',
  ohp: 'overhead press',
  bp: 'bench press',
  'lat pulldown': 'lat pulldown lat pull-down lat pull down',
  dl: 'deadlift',
  squat: 'squat back squat',
  row: 'row bent-over row',
};

const fuzzyMatchExercises = (query, pool) => {
  const normalized = normalizeSearch(query);
  if (!normalized) return pool.slice(0, 20);

  const scores = pool.map((id) => {
    const eq = EQUIPMENT_DB[id];
    const haystack = [
      eq?.name || '',
      eq?.target || '',
      (eq?.tags || []).join(' '),
      Object.entries(SEARCH_ALIASES)
        .filter(([alias]) => normalized.includes(alias))
        .map(([, str]) => str)
        .join(' ')
    ].join(' ').toLowerCase();

    const baseScore = haystack.startsWith(normalized) ? 2 : (haystack.includes(normalized) ? 1 : 0);
    return { id, score: baseScore };
  }).filter(item => item.score > 0);

  return scores.sort((a, b) => b.score - a.score).map(s => s.id).slice(0, 20);
};

const calculatePlateLoading = (targetWeight, barWeight = 45) => {
  const plateOptions = [45, 35, 25, 10, 5, 2.5];
  const perSide = (targetWeight - barWeight) / 2;

  if (perSide <= 0) return { plates: [], perSide: 0, total: barWeight, display: 'Empty bar' };

  const plates = [];
  let remaining = perSide;

  for (const plate of plateOptions) {
    while (remaining >= plate) {
      plates.push(plate);
      remaining -= plate;
    }
  }

  const totalPerSide = plates.reduce((sum, p) => sum + p, 0);
  const total = barWeight + (totalPerSide * 2);

  return {
    plates,
    perSide: totalPerSide,
    total,
    display: plates.length > 0 ? plates.join(' + ') + ' per side' : 'Empty bar'
  };
};

const getProgressionAdvice = (sessions, currentBest) => {
  if (!sessions || sessions.length < 2) return null;
  const recentSessions = sessions.slice(-3);
  let easyCount = 0, goodCount = 0, hardCount = 0, atBest = 0;

  recentSessions.forEach(session => {
    (Array.isArray(session.sets) ? session.sets : []).forEach(set => {
      if (set.weight === currentBest) {
        atBest++;
        if (set.difficulty === 'easy') easyCount++;
        if (set.difficulty === 'good') goodCount++;
        if (set.difficulty === 'hard') hardCount++;
      }
    });
  });

  if (atBest >= 3 && (easyCount >= 2 || (easyCount + goodCount >= 3))) return { type: 'ready', message: 'Ready to bump weight next time' };
  if (atBest >= 2 && (goodCount + hardCount >= 2)) return { type: 'building', message: 'Keep building - you are close' };
  return null;
};
