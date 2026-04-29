    const buildMuscleDistribution = (history = {}, rangeDays = 30) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Math.max(rangeDays - 1, 0));
      cutoff.setHours(0, 0, 0, 0);
      const counts = {
        chest: 0,
        back: 0,
        legs: 0,
        core: 0,
        arms: 0,
        shoulders: 0
      };

      Object.entries(history || {}).forEach(([equipId, arr]) => {
        const eq = EQUIPMENT_DB[equipId];
        safeArray(arr).forEach(session => {
          if (!session?.date) return;
          const time = new Date(session.date).getTime();
          if (!Number.isFinite(time) || time < cutoff.getTime()) return;
          const group = normalizeMuscleGroup(session.muscleGroup || eq);
          if (group && counts[group] !== undefined) counts[group] += 1;
        });
      });

      return counts;
    };

    const MUSCLE_BADGE_CONFIG = {
      chest: {
        tint: 'var(--tint-chest)',
        icon: <path d="M3 12h4l2 6 4-12 3 9h5" />
      },
      back: {
        tint: 'var(--tint-back)',
        icon: <path d="M12 3 4.5 6.5V12c0 4.5 3.3 8.6 7.5 9 4.2-.4 7.5-4.5 7.5-9V6.5L12 3Z" />
      },
      legs: {
        tint: 'var(--tint-legs)',
        icon: <path d="M6 4v8l4 4 4-4V4M10 16l-2 4M14 16l2 4" />
      },
      core: {
        tint: 'var(--tint-core)',
        icon: <path d="M5 7h14M5 12h14M5 17h14" />
      },
      arms: {
        tint: 'var(--tint-arms)',
        icon: <path d="M4 12h3l1-3h8l1 3h3M6 12v4M18 12v4" />
      },
      shoulders: {
        tint: 'var(--tint-shoulders)',
        icon: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M7 7l2 2M15 7l-2 2M7 17l2-2M15 17l-2-2" />
      },
      neutral: {
        tint: 'color-mix(in srgb, var(--muted) 35%, var(--surface))',
        icon: <path d="M4 12h16M12 4v16" />
      }
    };

    const renderMuscleBadge = (muscleGroup) => {
      const key = normalizeMuscleGroup(muscleGroup);
      const config = MUSCLE_BADGE_CONFIG[key] || MUSCLE_BADGE_CONFIG.neutral;
      return (
        <span className="muscle-badge" style={{ '--badge-tint': config.tint }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {config.icon}
          </svg>
        </span>
      );
    };

    const getLastWorkedDateForGroup = (muscleGroup, history = {}, exerciseMeta = {}) => {
      if (!muscleGroup) return null;
      const target = normalizeMuscleGroup(muscleGroup);
      let latest = null;
      Object.entries(exerciseMeta || {}).forEach(([id, meta]) => {
        if (!meta || meta.type === 'cardio' || meta.type === 'easterEgg') return;
        const group = normalizeMuscleGroup(meta);
        if (!group || group !== target) return;
        safeArray(history?.[id]).forEach(session => {
          if (!session?.date) return;
          const time = new Date(session.date).getTime();
          if (!Number.isFinite(time)) return;
          if (!latest || time > latest.getTime()) {
            latest = new Date(time);
          }
        });
      });
      return latest;
    };

    const formatLastWorkedLabel = (lastDate, now = new Date()) => {
      if (!lastDate) {
        return 'Not logged yet';
      }
      const msPerDay = 24 * 60 * 60 * 1000;
      const nowDate = now instanceof Date ? now : new Date(now);
      const diffDays = Math.floor((nowDate - lastDate) / msPerDay);
      if (diffDays <= 7) {
        const weekday = lastDate.toLocaleDateString(undefined, { weekday: 'short' });
        return `Last worked • ${weekday}`;
      }
      const dateStr = lastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return `Last worked • ${dateStr}`;
    };

    const getLastUsedDateForExercise = (exerciseId, history = {}, cardioHistory = {}) => {
      if (!exerciseId) return null;
      let latest = null;
      if (exerciseId.startsWith('cardio_')) {
        const cardioType = exerciseId.replace('cardio_', '');
        safeArray(cardioHistory?.[cardioType]).forEach(session => {
          if (!session?.date) return;
          const time = new Date(session.date).getTime();
          if (!Number.isFinite(time)) return;
          if (!latest || time > latest.getTime()) {
            latest = new Date(time);
          }
        });
      }
      safeArray(history?.[exerciseId]).forEach(session => {
        if (!session?.date) return;
        const time = new Date(session.date).getTime();
        if (!Number.isFinite(time)) return;
        if (!latest || time > latest.getTime()) {
          latest = new Date(time);
        }
      });
      return latest;
    };

    const formatDaysAgo = (lastDate, now = new Date()) => {
      if (!lastDate) return 'Not used yet';

      const msPerDay = 24 * 60 * 60 * 1000;
      const nowDate = now instanceof Date ? now : new Date(now);
      const diffDays = Math.floor((nowDate - lastDate) / msPerDay);

      if (diffDays < 1) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays <= 30) return `${diffDays} days ago`;
      return 'Over a month ago';
    };

    const getLastWorkoutDate = (history = {}, cardioHistory = {}) => {
      const dates = [];
      Object.values(history || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (s?.date) dates.push(new Date(s.date));
        });
      });
      Object.values(cardioHistory || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (s?.date) dates.push(new Date(s.date));
        });
      });
      if (dates.length === 0) return null;
      return new Date(Math.max(...dates.map(d => d.getTime())));
    };

    const buildLastSessionSummary = (history, lastWorkoutLabel) => {
      if (!history || !lastWorkoutLabel) return null;
      const sessions = [];
      Object.entries(history || {}).forEach(([exerciseId, arr]) => {
        safeArray(arr).forEach(session => {
          if (!session?.date) return;
          sessions.push({ ...session, exerciseId });
        });
      });
      if (sessions.length === 0) return null;
      sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      const lastSessionDate = sessions[0]?.date;
      if (!lastSessionDate) return null;
      const lastSessionKey = toDayKey(new Date(lastSessionDate));
      const lastExercises = sessions.filter(session => toDayKey(new Date(session.date)) === lastSessionKey);
      const totalSets = lastExercises.reduce((sum, session) => sum + safeArray(session.sets).length, 0);
      const muscleCounts = {};
      lastExercises.forEach(session => {
        const eq = EQUIPMENT_DB[session.exerciseId];
        const key = resolveMuscleGroup(eq);
        muscleCounts[key] = (muscleCounts[key] || 0) + 1;
      });
      const primaryMuscle = Object.entries(muscleCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      const parts = [`Last session · ${lastWorkoutLabel}`];
      if (totalSets) parts.push(`${totalSets} sets`);
      if (primaryMuscle) parts.push(primaryMuscle);

      const detailParts = [];
      if (primaryMuscle) detailParts.push(primaryMuscle);
      if (totalSets) detailParts.push(`${totalSets} sets`);

      return {
        full: parts.join(' • '),
        short: lastWorkoutLabel,
        detail: detailParts.join(' • ')
      };
    };

    // ========== EXTRACTED DATA ==========
    // The following are now loaded from separate files in /data:
    // - data/constants.js: AVATARS, homeQuotes, postWorkoutQuotes, restDayQuotes, GYM_TYPES,
    //   EXPERIENCE_LEVELS, ACTIVITY_LEVELS, GOALS, DIFFICULTY_LEVELS,
    //   CARDIO_TYPES, motivationalQuotes, TIMING, THRESHOLDS, STORAGE_KEYS
    // - data/equipment.js: EQUIPMENT_DB
    // - data/workoutPlans.js: WORKOUT_PLANS, BIG_BASICS

    // ========== UTILITIES ==========
    const clampTo5 = (n) => Math.max(10, Math.round(n / 5) * 5);
    const safeArray = (value) => (Array.isArray(value) ? value : []);

    if (typeof WORKOUT_PLANS === 'object' && WORKOUT_PLANS !== null) {
      WORKOUT_PLANS.Push = {
        machines: ["chest_press", "shoulder_press", "pec_fly", "cable_tricep"],
        dumbbells: [],
        barbells: []
      };
      WORKOUT_PLANS.Pull = {
        machines: ["lat_pulldown", "seated_row", "cable_bicep"],
        dumbbells: ["db_row"],
        barbells: []
      };
      WORKOUT_PLANS.Legs = {
        machines: ["leg_press", "leg_extension", "leg_curl"],
        dumbbells: ["db_goblet_squat"],
        barbells: []
      };
      WORKOUT_PLANS.Core = {
        machines: ["ab_crunch", "back_extension", "cable_woodchop"],
        dumbbells: ["plank_bodyweight"],
        barbells: []
      };
      WORKOUT_PLANS["Full Body"] = {
        machines: ["chest_press", "lat_pulldown", "leg_press"],
        dumbbells: ["db_shoulder_press"],
        barbells: []
      };
    }

    // useDebounce hook is now loaded from hooks/useDebounce.js
    // usePersistedState hook is now loaded from hooks/usePersistedState.js

        // Storage keys are now loaded from data/constants.js

    const uniqueDayKeysFromHistory = (history, cardioHistory = {}, restDays = [], dayEntries = null) => {
      if (dayEntries && Object.keys(dayEntries).length > 0) {
        return Object.keys(dayEntries).sort();
      }

      const keys = new Set();
      // Add workout days
      Object.values(history || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (s?.date) keys.add(toDayKey(new Date(s.date)));
        });
      });
      // Add cardio days
      Object.values(cardioHistory || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (s?.date) keys.add(toDayKey(new Date(s.date)));
        });
      });
      // Add rest days
      (restDays || []).forEach(d => keys.add(d));
      return Array.from(keys).sort();
    };

    const computeStreak = (history, cardioHistory = {}, restDays = [], dayEntries = null) => {
      const days = uniqueDayKeysFromHistory(history, cardioHistory, restDays, dayEntries);
      if (days.length === 0) return { current: 0, best: 0, lastDayKey: null, hasToday: false };

      let best = 1, run = 1;
      for (let i=1;i<days.length;i++){
        const prev = new Date(days[i-1]);
        const cur = new Date(days[i]);
        const diff = (cur - prev) / 86400000;
        if (diff === 1) { run++; best = Math.max(best, run); }
        else run = 1;
      }

      const todayKey = toDayKey(new Date());
      let current = 1;
      let i = days.length - 1;
      let anchor = days[i];

      while (i > 0) {
        const a = new Date(days[i-1]);
        const b = new Date(days[i]);
        const diff = (b - a) / 86400000;
        if (diff === 1) current++;
        else break;
        i--;
      }

      return { current, best, lastDayKey: anchor, hasToday: anchor === todayKey };
    };

    const buildDayEntriesFromHistory = (history = {}, cardioHistory = {}, restDays = []) => {
      const entries = {};
      Object.values(history || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (!s?.date) return;
          const key = toDayKey(new Date(s.date));
          entries[key] = entries[key] || { type: 'workout', date: key, exercises: [] };
        });
      });
      Object.values(cardioHistory || {}).forEach(arr => {
        safeArray(arr).forEach(s => {
          if (!s?.date) return;
          const key = toDayKey(new Date(s.date));
          entries[key] = entries[key] || { type: 'workout', date: key, exercises: [] };
        });
      });
      (restDays || []).forEach(d => {
        entries[d] = entries[d] || { type: 'rest', date: d, exercises: [] };
      });
      return entries;
    };

    const createSeededRandom = (seed = 42) => {
      let value = seed % 2147483647;
      if (value <= 0) value += 2147483646;
      return () => {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
      };
    };

    const generateDemoData = (days = 30) => {
      const rng = createSeededRandom(917202);
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - (days - 1));
      const totalDays = Math.max(7, days);
      const workoutDayIndices = new Set();
      for (let weekStart = 0; weekStart < totalDays; weekStart += 7) {
        const available = [];
        for (let offset = 0; offset < 7; offset += 1) {
          if (weekStart + offset < totalDays) available.push(weekStart + offset);
        }
        const plannedWorkouts = Math.min(available.length, 3 + Math.floor(rng() * 3));
        const shuffled = [...available].sort(() => rng() - 0.5);
        shuffled.slice(0, plannedWorkouts).forEach(idx => workoutDayIndices.add(idx));
      }

      const equipmentByGroup = {};
      Object.entries(EQUIPMENT_DB).forEach(([id, eq]) => {
        if (!eq || eq.type === 'cardio' || eq.type === 'easterEgg') return;
        const group = resolveMuscleGroup(eq);
        if (group === 'Other') return;
        if (!equipmentByGroup[group]) equipmentByGroup[group] = [];
        equipmentByGroup[group].push(id);
      });

      const muscleGroups = Object.keys(equipmentByGroup);
      const pickFromGroup = (group, count) => {
        const pool = equipmentByGroup[group] || [];
        const picks = [];
        const copy = [...pool];
        while (copy.length > 0 && picks.length < count) {
          const idx = Math.floor(rng() * copy.length);
          picks.push(copy.splice(idx, 1)[0]);
        }
        return picks;
      };

      const buildSets = (eq) => {
        const base = eq?.type === 'machine' ? 35 : eq?.type === 'barbell' ? 65 : eq?.type === 'dumbbell' ? 15 : 20;
        const spread = eq?.type === 'barbell' ? 95 : 55;
        return Array.from({ length: 3 }, () => ({
          weight: Math.max(5, Math.round(base + rng() * spread)),
          reps: 6 + Math.floor(rng() * 7)
        }));
      };

      const history = {};
      const cardioHistory = {};
      const restDays = [];
      const sortedDays = Array.from(workoutDayIndices).sort((a, b) => a - b);
      sortedDays.forEach((dayIndex) => {
        const date = new Date(start);
        date.setDate(start.getDate() + dayIndex);
        const timeRoll = rng();
        if (timeRoll < 0.45) date.setHours(18 + Math.floor(rng() * 3), 10 + Math.floor(rng() * 40));
        else if (timeRoll < 0.75) date.setHours(6 + Math.floor(rng() * 3), 5 + Math.floor(rng() * 50));
        else date.setHours(12 + Math.floor(rng() * 3), 5 + Math.floor(rng() * 50));

        const focusRoll = rng();
        const focusGroup = focusRoll < 0.2 ? 'Legs'
          : focusRoll < 0.38 ? 'Back'
            : focusRoll < 0.56 ? 'Chest'
              : focusRoll < 0.72 ? 'Shoulders'
                : focusRoll < 0.86 ? 'Arms'
                  : 'Core';

        const exerciseCount = 3 + Math.floor(rng() * 3);
        const exerciseIds = new Set();
        pickFromGroup(focusGroup, Math.min(2, exerciseCount)).forEach(id => exerciseIds.add(id));
        while (exerciseIds.size < exerciseCount) {
          const group = muscleGroups[Math.floor(rng() * muscleGroups.length)];
          const picks = pickFromGroup(group, 1);
          if (picks.length > 0) exerciseIds.add(picks[0]);
          if (exerciseIds.size >= exerciseCount) break;
        }

        exerciseIds.forEach((exerciseId) => {
          const eq = EQUIPMENT_DB[exerciseId];
          const session = {
            date: date.toISOString(),
            sets: buildSets(eq),
            notes: rng() < 0.18 ? 'Felt steady today.' : undefined
          };
          history[exerciseId] = [...(history[exerciseId] || []), session];
        });

        if (rng() < 0.32) {
          const cardioType = rng() < 0.7 ? 'running' : 'swimming';
          const duration = 18 + Math.floor(rng() * 28);
          const distance = cardioType === 'running' ? Number((1.2 + rng() * 3.4).toFixed(1)) : Math.round(500 + rng() * 1200);
          const intensity = rng() < 0.4 ? 'easy' : rng() < 0.75 ? 'moderate' : 'strong';
          const session = {
            date: date.toISOString(),
            duration,
            distance,
            intensity
          };
          cardioHistory[cardioType] = [...(cardioHistory[cardioType] || []), session];
        }
      });

      const dayEntries = buildDayEntriesFromHistory(history, cardioHistory, restDays);
      return { history, cardioHistory, restDays, dayEntries };
    };

    const normalizeHistory = (obj) => {
      const safe = {};
      if (!obj || typeof obj !== 'object') return safe;
      Object.entries(obj).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          safe[key] = [];
          return;
        }
        const entries = value
          .filter(item => item && typeof item === 'object' && !Array.isArray(item))
          .filter(item => item.date)
          .map(item => {
            const sets = Array.isArray(item.sets)
              ? item.sets
                .filter(set => set && typeof set === 'object')
                .map(set => ({
                  reps: Number(set.reps),
                  weight: Number(set.weight)
                }))
                .filter(set => Number.isFinite(set.reps) && Number.isFinite(set.weight))
              : [];
            return { ...item, sets };
          });
        safe[key] = entries;
      });
      return safe;
    };

    const normalizeCardioHistory = (obj) => {
      const safe = {};
      if (!obj || typeof obj !== 'object') return safe;
      Object.entries(obj).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          safe[key] = [];
          return;
        }
        const entries = value
          .filter(item => item && typeof item === 'object' && !Array.isArray(item))
          .filter(item => item.date)
          .map(item => ({
            ...item,
            duration: Number(item.duration),
            distance: item.distance !== undefined && item.distance !== null ? Number(item.distance) : undefined,
            intensity: item.intensity || item.effort || null
          }))
          .filter(item => Number.isFinite(item.duration) && item.duration > 0);
        safe[key] = entries;
      });
      return safe;
    };

    const normalizeDayEntries = (obj, history, cardioHistory, restDays) => {
      if (!obj || typeof obj !== 'object') {
        return buildDayEntriesFromHistory(history, cardioHistory, restDays);
      }
      const entries = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (!value || typeof value !== 'object') return;
        entries[key] = {
          type: value.type || 'workout',
          date: value.date || key,
          exercises: Array.isArray(value.exercises) ? value.exercises.filter(Boolean) : []
        };
      });
      return Object.keys(entries).length > 0 ? entries : buildDayEntriesFromHistory(history, cardioHistory, restDays);
    };

    let demoDataCache = null;
    const getEffectiveData = (realData, demoEnabled) => {
      const base = realData || {};
      const source = demoEnabled
        ? (demoDataCache || (demoDataCache = generateDemoData(30)))
        : {
          history: base.history,
          cardioHistory: base.cardioHistory,
          restDays: base.restDays,
          dayEntries: base.dayEntries
        };
      const history = normalizeHistory(source.history);
      const cardioHistory = normalizeCardioHistory(source.cardioHistory);
      const restDays = Array.isArray(source.restDays) ? source.restDays.filter(Boolean) : [];
      const dayEntries = normalizeDayEntries(source.dayEntries, history, cardioHistory, restDays);
      return { history, cardioHistory, restDays, dayEntries };
    };

    const buildPatternsFromHistory = (history = {}, cardioHistory = {}) => {
      const sessions = [];
      const seen = new Set();
      Object.entries(history || {}).forEach(([equipId, arr]) => {
        safeArray(arr).forEach(session => {
          if (!session?.date) return;
          const key = `${session.date}-${equipId}-${session.type || 'strength'}`;
          if (seen.has(key)) return;
          seen.add(key);
          sessions.push({ ...session, equipId, type: session.type || (EQUIPMENT_DB[equipId]?.type === 'cardio' ? 'cardio' : 'strength') });
        });
      });
      Object.entries(cardioHistory || {}).forEach(([cardioType, arr]) => {
        safeArray(arr).forEach(session => {
          if (!session?.date) return;
          const key = `${session.date}-${cardioType}-cardio`;
          if (seen.has(key)) return;
          seen.add(key);
          sessions.push({ ...session, equipId: `cardio_${cardioType}`, type: 'cardio' });
        });
      });

      if (sessions.length < 4) return [];

      const totalWorkoutDays = new Set(sessions.map(s => toDayKey(new Date(s.date)))).size;
      const firstDate = sessions.reduce((min, s) => Math.min(min, new Date(s.date).getTime()), Date.now());
      const lastDate = sessions.reduce((max, s) => Math.max(max, new Date(s.date).getTime()), 0);
      const weeksSpan = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24 * 7)) || 1);
      const strengthSessions = sessions.filter(s => s.type !== 'cardio');
      const cardioSessions = sessions.filter(s => s.type === 'cardio');

      const patterns = [];
      const addPattern = (pattern) => {
        if (!pattern?.title) return;
        if (patterns.find(item => item.title === pattern.title)) return;
        patterns.push(pattern);
      };

      const timeBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      sessions.forEach(s => {
        const hour = new Date(s.date).getHours();
        if (hour >= 5 && hour < 11) timeBuckets.morning += 1;
        else if (hour >= 11 && hour < 17) timeBuckets.afternoon += 1;
        else if (hour >= 17 && hour < 22) timeBuckets.evening += 1;
        else timeBuckets.night += 1;
      });
      const totalSessions = sessions.length || 1;
      const topBucket = Object.entries(timeBuckets).sort((a, b) => b[1] - a[1])[0];
      if (topBucket && topBucket[1] / totalSessions >= 0.45) {
        const label = topBucket[0] === 'morning' ? 'morning' : topBucket[0] === 'afternoon' ? 'midday' : topBucket[0] === 'evening' ? 'evening' : 'late night';
        const emoji = topBucket[0] === 'morning' ? '🌤️' : topBucket[0] === 'afternoon' ? '🕛' : topBucket[0] === 'evening' ? '🌙' : '✨';
        addPattern({ title: `You usually train in the ${label}.`, subtext: 'Your logs cluster there most often.', icon: emoji });
      } else if (timeBuckets.morning > 0 && timeBuckets.evening > 0) {
        addPattern({ title: 'You bounce between morning and evening sessions.', subtext: 'Your schedule stays flexible.', icon: '🧭' });
      }

      if (strengthSessions.length > 0) {
        const groupCounts = {};
        strengthSessions.forEach(s => {
          const eq = EQUIPMENT_DB[s.equipId];
          if (!eq) return;
          const group = resolveMuscleGroup(eq);
          groupCounts[group] = (groupCounts[group] || 0) + 1;
        });
        const sortedGroups = Object.entries(groupCounts).sort((a, b) => b[1] - a[1]);
        const topGroup = sortedGroups[0]?.[0];
        const upperGroups = ['Chest', 'Back', 'Shoulders', 'Arms'];
        if (topGroup) {
          const label = upperGroups.includes(topGroup) ? 'Upper body' : topGroup;
          addPattern({ title: `${label} shows up most often.`, subtext: 'That focus keeps repeating.', icon: '🏋️' });
        }

        const legsCount = groupCounts.Legs || 0;
        if (legsCount > 0) {
          const legsPerWeek = legsCount / weeksSpan;
          if (legsPerWeek >= 0.7 && legsPerWeek <= 1.4) {
            addPattern({ title: 'Legs happen about once a week.', subtext: 'A steady lower-body rhythm.', icon: '🦵' });
          } else if (legsPerWeek > 1.4) {
            addPattern({ title: 'Legs show up most weeks.', subtext: 'Lower body stays in the mix.', icon: '🦵' });
          }
        }

        const typeCounts = { machine: 0, free: 0 };
        strengthSessions.forEach(s => {
          const eq = EQUIPMENT_DB[s.equipId];
          if (!eq) return;
          if (eq.type === 'machine') typeCounts.machine += 1;
          if (['dumbbell', 'barbell', 'kettlebell', 'bodyweight'].includes(eq.type)) typeCounts.free += 1;
        });
        const typeTotal = typeCounts.machine + typeCounts.free;
        if (typeTotal > 0) {
          const machinePct = typeCounts.machine / typeTotal;
          const freePct = typeCounts.free / typeTotal;
          if (machinePct >= 0.3 && freePct >= 0.3) {
            addPattern({ title: 'You mix machines and free weights.', subtext: 'Best of both worlds.', icon: '⚙️' });
          } else if (machinePct > 0.7) {
            addPattern({ title: 'Machines are a go-to for you.', subtext: 'Steady, consistent loading.', icon: '🛠️' });
          } else if (freePct > 0.7) {
            addPattern({ title: 'Free weights lead the way.', subtext: 'Lots of variety in your lifts.', icon: '🏋️‍♀️' });
          }
        }

        const coreDays = new Set();
        const mixedCoreDays = new Set();
        Object.entries(history || {}).forEach(([equipId, arr]) => {
          const eq = EQUIPMENT_DB[equipId];
          if (!eq) return;
          const group = resolveMuscleGroup(eq);
          safeArray(arr).forEach(s => {
            if (!s?.date) return;
            const key = toDayKey(new Date(s.date));
            if (group === 'Core') coreDays.add(key);
          });
        });
        Object.entries(history || {}).forEach(([equipId, arr]) => {
          const eq = EQUIPMENT_DB[equipId];
          if (!eq) return;
          const group = resolveMuscleGroup(eq);
          safeArray(arr).forEach(s => {
            if (!s?.date) return;
            const key = toDayKey(new Date(s.date));
            if (group !== 'Core' && coreDays.has(key)) mixedCoreDays.add(key);
          });
        });
        if (mixedCoreDays.size > 0 && totalWorkoutDays > 0 && mixedCoreDays.size / totalWorkoutDays >= 0.35) {
          addPattern({ title: 'You often include core work alongside your main lifts.', subtext: 'A balanced finish.', icon: '🧘' });
        }

        const uniqueGroups = Object.keys(groupCounts).filter(group => groupCounts[group] > 0);
        if (uniqueGroups.length >= 4) {
          addPattern({ title: 'You rotate through multiple muscle groups.', subtext: 'Your plan stays well-rounded.', icon: '🧩' });
        }
      }

      if (cardioSessions.length > 0) {
        const cardioPerWeek = cardioSessions.length / weeksSpan;
        if (cardioPerWeek >= 1) {
          addPattern({ title: 'Cardio shows up most weeks.', subtext: 'A steady dose of conditioning.', icon: '🏃' });
        } else {
          addPattern({ title: 'You sprinkle in cardio sessions.', subtext: 'Just enough for balance.', icon: '🏃' });
        }
      }

      const durations = [];
      cardioSessions.forEach(session => {
        if (Number.isFinite(session.duration) && session.duration > 0) durations.push(session.duration);
        if (Array.isArray(session.entries) && session.entries.length > 0) {
          session.entries.forEach(entry => {
            if (Number.isFinite(entry.durationMin) && entry.durationMin > 0) durations.push(entry.durationMin);
          });
        }
      });
      if (durations.length >= 3) {
        const sorted = [...durations].sort((a, b) => a - b);
        const mid = sorted[Math.floor(sorted.length / 2)];
        const rounded = Math.round(mid / 5) * 5;
        addPattern({ title: `Your most common workout length is about ${rounded} minutes.`, subtext: 'A steady, repeatable window.', icon: '⏱️' });
      }

      if (totalWorkoutDays > 0) {
        const perWeek = totalWorkoutDays / weeksSpan;
        if (perWeek >= 4) {
          addPattern({ title: 'You log workouts most weeks.', subtext: 'Nice, steady momentum.', icon: '📅' });
        } else if (perWeek >= 2) {
          addPattern({ title: 'You usually get in a couple sessions each week.', subtext: 'Solid rhythm without overthinking.', icon: '📆' });
        }
      }

      const weekdayCount = sessions.filter(s => {
        const day = new Date(s.date).getDay();
        return day >= 1 && day <= 5;
      }).length;
      const weekendCount = sessions.length - weekdayCount;
      if (weekdayCount / totalSessions >= 0.7) {
        addPattern({ title: 'Weekdays are your training anchor.', subtext: 'You keep it consistent through the week.', icon: '🗓️' });
      } else if (weekendCount / totalSessions >= 0.5) {
        addPattern({ title: 'Weekends are your training anchor.', subtext: 'You make the most of open time.', icon: '🎯' });
      }

      return patterns.slice(0, 8);
    };

    const deriveRecentExercises = (history = {}, limit = 12) => {
      const flat = [];
      Object.entries(history || {}).forEach(([id, sessions]) => {
        (Array.isArray(sessions) ? sessions : []).forEach(s => {
          if (s?.date) flat.push({ id, date: s.date });
        });
      });
      flat.sort((a, b) => new Date(b.date) - new Date(a.date));
      const seen = new Set();
      const result = [];
      for (const item of flat) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        result.push(item.id);
        if (result.length >= limit) break;
      }
      return result;
    };

    const deriveUsageCountsFromHistory = (history = {}) => {
      const counts = {};
      Object.entries(history || {}).forEach(([id, sessions]) => {
        (Array.isArray(sessions) ? sessions : []).forEach(s => {
          const increment = Math.max(1, Array.isArray(s?.sets) ? s.sets.length : 0);
          counts[id] = (counts[id] || 0) + increment;
        });
      });
      return counts;
    };

    const normalizeSearch = (value = '') => value.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    // SEARCH_ALIASES, fuzzyMatchExercises, calculatePlateLoading, getProgressionAdvice
    // → moved to data/search.js


    const Card = ({ children, className = '', onClick, style }) => (
      <div
        onClick={onClick}
        style={style}
        className={`ps-card ${className}`}
      >
        {children}
      </div>
    );

    const InlineMessage = ({ message }) => {
      if (!message) return null;
      return (
        <div className="px-4 pt-3">
          <div className="inline-message">{message}</div>
        </div>
      );
    };

    const UndoToast = ({ message, onUndo }) => {
      if (!message) return null;
      return (
        <div className="toast toast--undo" role="status" aria-live="polite">
          <span>{message}</span>
          <button onClick={onUndo} className="toast-action">Undo</button>
        </div>
      );
    };

    const TemplatePicker = ({ isOpen, onClose, onSelect, plans = [] }) => {
      if (!isOpen) return null;

      return (
        <div className="template-picker-backdrop">
          <div className="template-picker card-enter">
            <div className="template-picker-header">
              <h2 className="template-picker-title">Start from template</h2>
              <button
                type="button"
                className="btn-secondary-flat ps-tap text-xs"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
            <div className="template-picker-list">
              {plans.map((plan) => (
                <button
                  key={plan.id || plan.name}
                  type="button"
                  className="template-picker-item ps-card-interactive ps-tap"
                  onClick={() => onSelect(plan)}
                >
                  <div className="template-picker-name">{plan.name}</div>
                  {plan.description && (
                    <div className="template-picker-desc">{plan.description}</div>
                  )}
                  {Array.isArray(plan.exercises) && (
                    <div className="template-picker-meta">
                      {plan.exercises.length} exercises
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const ToastHost = ({ toasts }) => {
      if (!toasts.length) return null;

      return (
        <div className="toast-host">
          {toasts.map((toast) => (
            <div key={toast.id} className="toast card-enter">
              <div className="toast-text">{toast.message}</div>
            </div>
          ))}
        </div>
      );
    };

    // ========== LOCKER VIEW ==========


    const computeStrengthScore = (_profile, history) => {
          const ids = Object.keys(EQUIPMENT_DB).filter(id => EQUIPMENT_DB[id]?.type !== 'cardio');
          const logged = ids.filter(id => Array.isArray(history[id]) && history[id].length > 0);
    
          if (logged.length === 0) {
            return { score: 0, avgPct: 0, coveragePct: 0, loggedCount: 0, total: ids.length };
          }
    
          const ratios = logged.map(id => {
            const sessions = Array.isArray(history[id]) ? history[id] : [];
            if (sessions.length === 0) return 0;
            const first = sessions[0];
            const best = getBestForEquipment(sessions);
            const firstBest = getBestForEquipment([first]);
            if (!firstBest || !best) return 0.3;
            const improvement = Math.max(0, best - firstBest);
            const pct = Math.min(1, (improvement / (firstBest || 1)) * 0.5 + 0.5);
            return pct;
          });
    
          const avg = ratios.reduce((a,b)=>a+b,0) / ratios.length;
          const coverage = logged.length / ids.length;
          const score01 = (avg * 0.7) + (coverage * 0.3);
          const score = Math.round(score01 * 100);
    
          return { score, avgPct: Math.round(avg*100), coveragePct: Math.round(coverage*100), loggedCount: logged.length, total: ids.length };
        };

    const computeAchievements = ({ history, cardioHistory = {}, strengthScoreObj, streakObj }) => {
      const days = uniqueDayKeysFromHistory(history, cardioHistory);
      const strengthSessions = Object.values(history || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
      const cardioSessions = Object.values(cardioHistory || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
      const sessionsTotal = strengthSessions + cardioSessions;
      const equipmentLogged = Object.keys(EQUIPMENT_DB).filter(id => Array.isArray(history[id]) && history[id].length > 0).length;

      const unlocks = [
        { id: 'first', title: 'First Log', desc: 'Logged your first session', unlocked: sessionsTotal >= 1, emoji: '✅' },
        { id: '3days', title: '3-Day Streak', desc: '3 consecutive training days', unlocked: streakObj.best >= 3, emoji: '🔥' },
        { id: '7days', title: '7-Day Streak', desc: '7 consecutive training days', unlocked: streakObj.best >= 7, emoji: '🏆' },
        { id: 'score50', title: 'Strength Tier 50', desc: 'Strength Score hit 50', unlocked: strengthScoreObj.score >= 50, emoji: '💪' },
        { id: 'score75', title: 'Strength Tier 75', desc: 'Strength Score hit 75', unlocked: strengthScoreObj.score >= 75, emoji: '⚡' },
        { id: 'equipment5', title: 'Explorer', desc: 'Logged 5+ exercises', unlocked: equipmentLogged >= 5, emoji: '🧭' },
        { id: 'days10', title: 'Show Up Club', desc: 'Trained on 10 different days', unlocked: days.length >= 10, emoji: '📅' },
      ];

      return unlocks;
    };
