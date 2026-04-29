// ========== SESSION MANAGER HOOK ==========
// Centralizes all active session mutation logic.
// Replaces the scattered updateActiveSession / updateSessionLogs /
// finishActiveSession calls in App so they run in a safe, predictable order.
//
// Depends on: storage.js, data/constants.js (STORAGE_KEYS)
// Used by: App component

const useSessionManager = ({
  todayKey,
  isRestDay,
  activeSession,
  setActiveSession,
  history,
  setHistory,
  cardioHistory,
  setCardioHistory,
  dayEntries,
  setDayEntries,
  appState,
  setAppState,
  todayWorkoutType,
  recordDayEntry,
  recordExerciseUse,
  showToast,
  pushMessage,
  postWorkoutQuotes,
  getRandomQuote,
  setShowPostWorkout,
  setShowPostWorkoutCelebration,
  setPostWorkoutQuote,
  postWorkoutTimerRef,
  postWorkoutCelebrationRef,
  setActiveEquipment,
  setActiveCardio,
  setDraftPlan,
  setDismissedDraftDate,
  setSessionStartNotice,
  setTab,
}) => {

  // ─── buildSessionItem ───────────────────────────────────────────────────────
  const buildSessionItem = React.useCallback((exerciseId, kind = 'strength') => {
    const equipment = EQUIPMENT_DB[exerciseId];
    const derivedKind = equipment?.type === 'cardio' ? 'cardio' : kind;
    const name = equipment?.name || 'Exercise';
    const muscleGroup = equipment?.target || '';
    return {
      exerciseId,
      name,
      muscleGroup,
      kind: derivedKind,
      sets: 0,
      id: exerciseId,
      label: name
    };
  }, []);

  // ─── createEmptySession ─────────────────────────────────────────────────────
  const createEmptySession = React.useCallback((overrides = {}) => ({
    date: todayKey,
    status: 'draft',
    items: [],
    logsByExercise: {},
    createdFrom: overrides.createdFrom || 'manual',
    ...overrides
  }), [todayKey]);

  // ─── updateSessionLogs ──────────────────────────────────────────────────────
  // Safe: uses functional setActiveSession, no stale closure risk.
  const updateSessionLogs = React.useCallback((exerciseId, sets) => {
    if (!exerciseId) return;

    // Easter egg: 69 / 420 weight
    sets.forEach(set => {
      const w = Number(set.weight);
      if (w === 69 || w === 420) {
        // Caller handles showing NiceToast — we just pass through
      }
    });

    setActiveSession(prev => {
      if (!prev || prev.date !== todayKey) return prev;
      const items = [...(prev.items || [])];
      const logsByExercise = { ...(prev.logsByExercise || {}) };
      const idx = items.findIndex(item => (item.exerciseId || item.id) === exerciseId);

      logsByExercise[exerciseId] = sets;

      if (idx >= 0) {
        items[idx] = { ...items[idx], sets: sets.length };
      }

      return { ...prev, items, logsByExercise };
    });
  }, [todayKey, setActiveSession]);

  // ─── quickLogSet ────────────────────────────────────────────────────────────
  // Debounce window reduced to 400ms (was 900ms — too aggressive).
  const quickLogSubmitRef = React.useRef({ key: '', at: 0 });

  const quickLogSet = React.useCallback((exerciseId, set) => {
    const weight = Number(set?.weight);
    const reps = Number(set?.reps);
    if (!exerciseId || !weight || !reps) return false;

    const now = Date.now();
    const dedupeKey = `${exerciseId}-${weight}-${reps}`;
    if (quickLogSubmitRef.current.key === dedupeKey && now - quickLogSubmitRef.current.at < 400) {
      return false; // still debounce but shorter window
    }
    quickLogSubmitRef.current = { key: dedupeKey, at: now };

    setActiveSession(prev => {
      if (!prev || prev.date !== todayKey) return prev;
      const items = [...(prev.items || [])];
      const logsByExercise = { ...(prev.logsByExercise || {}) };
      const existingLogs = logsByExercise[exerciseId] || [];
      const nextLogs = [...existingLogs, { weight, reps }];

      logsByExercise[exerciseId] = nextLogs;

      const idx = items.findIndex(item => (item.exerciseId || item.id) === exerciseId);
      if (idx >= 0) {
        items[idx] = { ...items[idx], sets: nextLogs.length };
      }

      return { ...prev, items, logsByExercise };
    });

    showToast?.('Set saved');
    return true;
  }, [todayKey, setActiveSession, showToast]);

  // ─── saveExerciseSession ────────────────────────────────────────────────────
  // Replaces handleSaveSession. Does NOT call updateActiveSession internally —
  // caller is responsible for keeping logsByExercise in sync via updateSessionLogs.
  const saveExerciseSession = React.useCallback((exerciseId, session, options = {}) => {
    if (isRestDay || !session) return;

    const normalizedSession = {
      ...session,
      sets: [...(session.sets || [])]
    };
    const sessionDay = toDayKey(new Date(session.date));

    setHistory(prev => {
      const prevSessions = prev[exerciseId] || [];
      const existingIdx = prevSessions.findIndex(s => toDayKey(new Date(s.date)) === sessionDay);
      const updated = [...prevSessions];
      if (existingIdx >= 0) updated[existingIdx] = normalizedSession;
      else updated.push(normalizedSession);
      return { ...prev, [exerciseId]: updated };
    });

    setAppState(prev => ({
      ...prev,
      lastWorkoutType: todayWorkoutType,
      lastWorkoutDayKey: sessionDay
    }));

    recordExerciseUse?.(exerciseId, session.sets || []);
    recordDayEntry?.(sessionDay, 'workout', {
      exercises: Array.from(new Set([...(dayEntries[sessionDay]?.exercises || []), exerciseId]))
    });

    if (!options.quiet) {
      pushMessage?.('Logged.');
    }
  }, [
    isRestDay, setHistory, setAppState, todayWorkoutType,
    recordExerciseUse, recordDayEntry, dayEntries, pushMessage
  ]);

  // ─── saveCardioSession ──────────────────────────────────────────────────────
  const saveCardioSession = React.useCallback((exerciseId, entries = []) => {
    if (isRestDay || !exerciseId) return;
    const eq = EQUIPMENT_DB[exerciseId];
    const cardioType = exerciseId.startsWith('cardio_')
      ? exerciseId.replace('cardio_', '')
      : exerciseId;
    const totalMinutes = entries.reduce((sum, e) => sum + (e.durationMin || e.minutes || 0), 0);
    const session = {
      date: new Date().toISOString(),
      type: 'cardio',
      entries: [...entries],
      duration: totalMinutes || null,
      cardioLabel: eq?.name || 'Cardio',
      cardioType,
      cardioGroup: eq?.cardioGroup || null
    };

    setHistory(prev => {
      const prevSessions = prev[exerciseId] || [];
      const sessionDay = toDayKey(new Date(session.date));
      const existingIdx = prevSessions.findIndex(s => toDayKey(new Date(s.date)) === sessionDay);
      const updated = [...prevSessions];
      if (existingIdx >= 0) updated[existingIdx] = session;
      else updated.push(session);
      return { ...prev, [exerciseId]: updated };
    });

    if (exerciseId.startsWith('cardio_')) {
      setCardioHistory(prev => {
        const prevSessions = prev[cardioType] || [];
        const sessionDay = toDayKey(new Date(session.date));
        const existingIdx = prevSessions.findIndex(s => toDayKey(new Date(s.date)) === sessionDay);
        const updated = [...prevSessions];
        if (existingIdx >= 0) updated[existingIdx] = session;
        else updated.push(session);
        return { ...prev, [cardioType]: updated };
      });
    }

    recordDayEntry?.(todayKey, 'workout', {
      exercises: Array.from(new Set([...(dayEntries[todayKey]?.exercises || []), exerciseId]))
    });
  }, [isRestDay, setHistory, setCardioHistory, recordDayEntry, todayKey, dayEntries]);

  // ─── finishSession ──────────────────────────────────────────────────────────
  // Fixed: reads logsByExercise from activeSession snapshot ONCE, then
  // iterates without triggering intermediate re-renders. State is cleared
  // at the end, not mid-loop.
  const finishSession = React.useCallback((sessionSnapshot) => {
    if (!sessionSnapshot) return;

    const logsByExercise = sessionSnapshot.logsByExercise || {};
    const sessionItems = sessionSnapshot.items || [];
    const sessionDate = new Date().toISOString();
    const exerciseIds = [];

    // Write to history — batch all saves before touching activeSession
    sessionItems.forEach(item => {
      const exerciseId = item.exerciseId || item.id;
      const logs = logsByExercise[exerciseId] || [];
      if (!logs.length) return;

      exerciseIds.push(exerciseId);

      if (item.kind === 'cardio') {
        saveCardioSession(exerciseId, logs);
      } else {
        saveExerciseSession(exerciseId, {
          date: sessionDate,
          type: 'strength',
          sets: logs
        }, { quiet: true });
      }
    });

    // Record day entry ONCE after all saves
    if (exerciseIds.length > 0) {
      recordDayEntry?.(toDayKey(new Date()), 'workout', { exercises: exerciseIds });
    }

    // NOW clear all session state in one batch
    setActiveSession(null);
    setDraftPlan?.(null);
    setDismissedDraftDate?.(null);
    setActiveEquipment?.(null);
    setActiveCardio?.(null);
    setSessionStartNotice?.(null);

    // Post-workout celebration
    const chosenQuote = getRandomQuote?.(postWorkoutQuotes);
    setPostWorkoutQuote?.(chosenQuote);
    setShowPostWorkout?.(true);
    setShowPostWorkoutCelebration?.(true);

    if (postWorkoutCelebrationRef?.current) clearTimeout(postWorkoutCelebrationRef.current);
    postWorkoutCelebrationRef && (postWorkoutCelebrationRef.current = setTimeout(
      () => setShowPostWorkoutCelebration?.(false), 720
    ));

    if (postWorkoutTimerRef?.current) clearTimeout(postWorkoutTimerRef.current);
    postWorkoutTimerRef && (postWorkoutTimerRef.current = setTimeout(
      () => setShowPostWorkout?.(false), 3600
    ));

    setTab?.('home');
    showToast?.('Session saved. Future you says thanks.');
  }, [
    saveCardioSession, saveExerciseSession, recordDayEntry,
    setActiveSession, setDraftPlan, setDismissedDraftDate,
    setActiveEquipment, setActiveCardio, setSessionStartNotice,
    getRandomQuote, postWorkoutQuotes, setPostWorkoutQuote,
    setShowPostWorkout, setShowPostWorkoutCelebration,
    postWorkoutCelebrationRef, postWorkoutTimerRef,
    setTab, showToast
  ]);

  // ─── updateSessionItemsByIds ─────────────────────────────────────────────────
  const updateSessionItemsByIds = React.useCallback((ids = [], options = {}) => {
    const uniqueIds = Array.from(new Set(ids));
    setActiveSession(prev => {
      const base = (!prev || prev.date !== todayKey)
        ? createEmptySession({ createdFrom: options.createdFrom || 'manual' })
        : prev;
      const existingItems = base.items || [];
      const items = uniqueIds.map(id => {
        const existing = existingItems.find(item => (item.exerciseId || item.id) === id);
        if (existing) return existing;
        return buildSessionItem(id);
      });
      const logsByExercise = { ...(base.logsByExercise || {}) };
      uniqueIds.forEach(id => {
        if (!logsByExercise[id]) logsByExercise[id] = [];
      });
      // Remove logs for exercises no longer in session
      Object.keys(logsByExercise).forEach(key => {
        if (!uniqueIds.includes(key)) delete logsByExercise[key];
      });
      return {
        ...base,
        status: options.status || base.status,
        createdFrom: options.createdFrom || base.createdFrom || 'manual',
        items,
        logsByExercise
      };
    });
  }, [todayKey, setActiveSession, createEmptySession, buildSessionItem]);

  return {
    buildSessionItem,
    createEmptySession,
    updateSessionLogs,
    quickLogSet,
    saveExerciseSession,
    saveCardioSession,
    finishSession,
    updateSessionItemsByIds,
  };
};
