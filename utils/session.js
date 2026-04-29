
    const toDayKey = (date = new Date()) => {
      const y = date.getFullYear();
      const m = String(date.getMonth()+1).padStart(2,'0');
      const d = String(date.getDate()).padStart(2,'0');
      return `${y}-${m}-${d}`;
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

      const normalizeActiveSession = (session) => {
        if (!session) return null;
        const date = session.dateKey || session.date || toDayKey(new Date());
        const logsByExercise = session.logsByExercise || session.setsByExercise || {};
        const rawItems = session.items || Object.values(session.exercises || {}).map(entry => ({
          exerciseId: entry.id,
          name: entry.label,
          sets: entry.sets || 0,
          kind: entry.kind || 'strength'
        }));
        const items = rawItems.map(item => {
          const exerciseId = item.exerciseId || item.id;
          const name = item.name || item.label || EQUIPMENT_DB[exerciseId]?.name || 'Exercise';
          const muscleGroup = item.muscleGroup || EQUIPMENT_DB[exerciseId]?.target || '';
          const derivedKind = EQUIPMENT_DB[exerciseId]?.type === 'cardio' ? 'cardio' : (item.kind || 'strength');
          const fallbackSets = item.sets || 0;
          if (!logsByExercise[exerciseId]) {
            logsByExercise[exerciseId] = derivedKind === 'cardio'
              ? []
              : Array.from({ length: fallbackSets }, () => ({ reps: null, weight: null }));
          }
          const resolvedSets = logsByExercise[exerciseId] || [];
          return {
            exerciseId,
            name,
            muscleGroup,
            kind: derivedKind,
            sets: resolvedSets.length,
            id: exerciseId,
            label: name
          };
        });
        const normalizedStatus = session.status === 'in_progress' ? 'active' : session.status;
        return {
          date,
          status: normalizedStatus || 'active',
          items,
          logsByExercise,
          createdFrom: session.createdFrom || 'manual'
        };
      };

      const normalizeDraftPlan = (draft) => {
        if (!draft) return null;
        if (draft.exercises) {
          return {
            date: draft.date || toDayKey(new Date()),
            label: draft.label || 'Workout Draft',
            exercises: draft.exercises || [],
            options: draft.options || {},
            status: 'active',
            createdFrom: draft.createdFrom || 'generated'
          };
        }
        if (draft.items) {
          return {
            date: draft.date || toDayKey(new Date()),
            label: draft.label || 'Workout Draft',
            exercises: (draft.items || []).map(item => item.id),
            options: draft.options || {},
            status: 'active',
            createdFrom: draft.createdFrom || 'generated'
          };
        }
        return null;
      };
