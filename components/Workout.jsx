const Workout = ({ profile, history, cardioHistory, colorfulExerciseCards, onSelectExercise, settings, setSettings, recentExercises, starredExercises, onToggleStarred, exerciseUsageCounts, activeSession, onFinishSession, onStartWorkoutFromBuilder, onAddExerciseFromSearch, onPushMessage, onRemoveSessionExercise, onSwapSessionExercise, onStartEmptySession, isRestDay, onCancelSession, sessionIntent, onApplyTemplate, openTemplatesFromHome, onConsumedOpenTemplatesFromHome, onOpenSettings, onToggleRestDay, onQuickLogSet }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [libraryVisible, setLibraryVisible] = useState(settings.showAllExercises);
  const [swapState, setSwapState] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showCompactSearch, setShowCompactSearch] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const sessionCardRef = useRef(null);
  const lastSessionStatusRef = useRef(activeSession?.status || null);
  const lastQuickLogRef = useRef({ key: '', at: 0 });

  useEffect(() => {
    if (openTemplatesFromHome) {
      setIsTemplatePickerOpen(true);
      onConsumedOpenTemplatesFromHome?.();
    }
  }, [openTemplatesFromHome, onConsumedOpenTemplatesFromHome]);

  const gymType = GYM_TYPES[profile.gymType];

  const availableEquipment = useMemo(() => {
    const ids = Object.keys(EQUIPMENT_DB);
    return ids.filter(id => {
      const eq = EQUIPMENT_DB[id];
      if (eq.type === 'cardio') return true;
      if (eq.type === 'easterEgg') return true;
      if (eq.type === 'machine') return gymType?.machines;
      if (eq.type === 'dumbbell') return gymType?.dumbbells?.available;
      if (eq.type === 'barbell') return gymType?.barbells?.available;
      return false;
    });
  }, [gymType]);

  const filteredRecents = recentExercises.filter(id => availableEquipment.includes(id)).slice(0, 10);
  const filteredStarred = (starredExercises || []).filter(id => availableEquipment.includes(id));
  const todayKey = toDayKey(new Date());
  const hasSession = !!activeSession;
  const hasTodayWorkout = hasSession && activeSession?.date === todayKey;
  const mode = !hasTodayWorkout ? 'idle' : 'active';
  const isSessionMode = mode === 'active';
  const sessionEntries = useMemo(() => {
    if (!activeSession || activeSession.date !== todayKey) return [];
    return activeSession.items || [];
  }, [activeSession, todayKey]);
  const sessionLogsByExercise = activeSession?.date === todayKey ? (activeSession?.logsByExercise || {}) : {};
  const sessionHasLogged = sessionEntries.some(entry => (sessionLogsByExercise[entry.exerciseId || entry.id] || []).length > 0);
  const sessionExerciseCount = sessionEntries.length;
  const sessionSetCount = sessionEntries.reduce((sum, entry) => sum + ((sessionLogsByExercise[entry.exerciseId || entry.id] || []).length), 0);
  const finishSummaryBase = `${sessionExerciseCount} exercises • ${sessionSetCount} sets`;
  const finishSummaryIntent = sessionIntent === 'calm'
    ? 'Calm pace'
    : sessionIntent === 'recovery'
      ? 'Recovery pace'
      : '';
  const finishSummaryText = finishSummaryIntent ? `${finishSummaryBase} • ${finishSummaryIntent}` : finishSummaryBase;

  const filterOptions = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

  const templatePlans = useMemo(() => {
    if (!WORKOUT_PLANS) return [];
    const labels = {
      Push: {
        name: 'Push Day',
        description: 'Upper body – chest, shoulders & triceps.'
      },
      Pull: {
        name: 'Pull Day',
        description: 'Upper body – back & biceps focus.'
      },
      Legs: {
        name: 'Legs Day',
        description: 'Lower body – quads, glutes & hamstrings.'
      },
      Core: {
        name: 'Core Day',
        description: 'Core & abs – anti-slouch session.'
      },
      'Full Body': {
        name: 'Full Body Day',
        description: 'Balanced mix of upper & lower body.'
      }
    };

    const planOrder = ['Push', 'Pull', 'Legs', 'Core', 'Full Body'];
    return planOrder
      .filter((name) => WORKOUT_PLANS[name])
      .map((name) => {
        const plan = WORKOUT_PLANS[name] || {};
        const exerciseIds = [
          ...(plan.machines || []),
          ...(plan.dumbbells || []),
          ...(plan.barbells || [])
        ];
        const uniqueIds = Array.from(new Set(exerciseIds));
        const label = labels[name] || {};
        return {
          id: name.toLowerCase().replace(/\\s+/g, '-'),
          name: label.name || `${name} Day`,
          description: label.description || `A focused ${name.toLowerCase()} template.`,
          exercises: uniqueIds.map((exerciseId) => {
            const eq = EQUIPMENT_DB[exerciseId] || {};
            return {
              id: exerciseId,
              name: eq.name || exerciseId,
              muscleGroup: eq.target || null,
              equipment: eq.type || null
            };
          })
        };
      });
  }, []);

  const resolveGroup = (eq) => {
    if (eq?.type === 'cardio') return 'Cardio';
    const target = (eq?.target || '').toLowerCase();
    if (target.includes('chest') || target.includes('pec')) return 'Chest';
    if (target.includes('back') || target.includes('lat')) return 'Back';
    if (target.includes('leg') || target.includes('quad') || target.includes('hamstring') || target.includes('glute') || target.includes('calf') || target.includes('thigh')) return 'Legs';
    if (target.includes('shoulder') || target.includes('delt')) return 'Shoulders';
    if (target.includes('bicep') || target.includes('tricep') || target.includes('arm') || target.includes('forearm')) return 'Arms';
    if (target.includes('core') || target.includes('ab')) return 'Core';
    return 'Other';
  };

  const formatOptionLabel = (value, type) => {
    if (!value) return '';
    if (type === 'equipment') {
      if (value === 'free') return 'Free weights';
      if (value === 'machines') return 'Machines';
      if (value === 'mixed') return 'Mixed';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const starredSet = useMemo(() => new Set(starredExercises || []), [starredExercises]);
  const baseOrder = useMemo(() => {
    return new Map(availableEquipment.map((id, idx) => [id, idx]));
  }, [availableEquipment]);

  const sortByStarWithinGroup = useCallback((ids) => {
    return [...ids].sort((a, b) => {
      const groupA = resolveGroup(EQUIPMENT_DB[a]);
      const groupB = resolveGroup(EQUIPMENT_DB[b]);
      if (groupA !== groupB) {
        return (baseOrder.get(a) ?? 0) - (baseOrder.get(b) ?? 0);
      }
      const aStar = starredSet.has(a);
      const bStar = starredSet.has(b);
      if (aStar !== bStar) return aStar ? -1 : 1;
      return (baseOrder.get(a) ?? 0) - (baseOrder.get(b) ?? 0);
    });
  }, [baseOrder, starredSet]);

  const filteredPool = useMemo(() => {
    let pool = [];
    if (activeFilter === 'All') pool = availableEquipment;
    else if (activeFilter === 'Cardio') pool = availableEquipment.filter(id => EQUIPMENT_DB[id]?.type === 'cardio');
    else pool = availableEquipment.filter(id => resolveGroup(EQUIPMENT_DB[id]) === activeFilter);
    return sortByStarWithinGroup(pool);
  }, [activeFilter, availableEquipment, sortByStarWithinGroup]);

  // Use debounced query for search results (better performance)
  const searchResults = useMemo(() => {
    const pool = filteredPool;
    if (!debouncedSearchQuery.trim()) return [];
    return fuzzyMatchExercises(debouncedSearchQuery, pool);
  }, [debouncedSearchQuery, filteredPool]);

  useEffect(() => {
    setLibraryVisible(settings.showAllExercises);
  }, [settings.showAllExercises]);

  useEffect(() => {
    if (mode === 'idle') {
      setShowCompactSearch(false);
    }
  }, [mode]);


  useEffect(() => {
    if (!debouncedSearchQuery.trim() || !searchResultsRef.current) return;
    requestAnimationFrame(() => {
      searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [debouncedSearchQuery, searchResults.length]);

  useEffect(() => {
    const prevStatus = lastSessionStatusRef.current;
    if (activeSession?.status === 'active' && prevStatus !== 'active') {
      requestAnimationFrame(() => {
        sessionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    lastSessionStatusRef.current = activeSession?.status || null;
  }, [activeSession?.status]);


  const getExerciseIcon = (eq) => {
    if (!eq) return '🏋️‍♂️';
    if (eq.emoji) return eq.emoji;
    if (eq.type === 'cardio') return eq.cardioGroup === 'swimming' ? '🏊' : '🏃';
    if (eq.type === 'machine') return '⚙️';
    if (eq.type === 'dumbbell') return '🏋️';
    return '🏋️‍♂️';
  };

  const renderStarIcon = (isStarred) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={isStarred ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const getLastStrengthSet = useCallback((exerciseId) => {
    const sessions = safeArray(history?.[exerciseId]);
    if (sessions.length === 0) return null;
    const lastSession = sessions.reduce((latest, session) => {
      if (!latest) return session;
      const latestTime = new Date(latest.date || 0).getTime();
      const sessionTime = new Date(session.date || 0).getTime();
      return sessionTime > latestTime ? session : latest;
    }, null);
    const sets = safeArray(lastSession?.sets);
    if (!sets.length) return null;
    return sets[sets.length - 1];
  }, [history]);

  const getExerciseSessionAnchor = useCallback((exerciseId) => {
    const sessions = safeArray(history?.[exerciseId]);
    if (!sessions.length) return null;
    const latest = sessions.reduce((acc, session) => {
      if (!acc) return session;
      return new Date(session.date || 0).getTime() > new Date(acc.date || 0).getTime() ? session : acc;
    }, null);
    if (!latest) return null;
    const weights = safeArray(latest.sets).map(s => Number(s?.weight)).filter(w => Number.isFinite(w) && w > 0);
    const reps = safeArray(latest.sets).map(s => Number(s?.reps)).filter(r => Number.isFinite(r) && r > 0);
    const weight = Number(latest.anchorWeight) || (weights.length ? Math.max(...weights) : null);
    const repsValue = Number(latest.anchorReps) || (reps.length ? Math.round(reps.reduce((a, b) => a + b, 0) / reps.length) : null);
    if (!weight || !repsValue) return null;
    return { weight, reps: repsValue };
  }, [history]);

  const getSuggestedSet = useCallback((exerciseId) => {
    const currentSessionSets = safeArray(sessionLogsByExercise?.[exerciseId]);
    const sessionLast = currentSessionSets[currentSessionSets.length - 1];
    const historyLast = getLastStrengthSet(exerciseId);
    const anchor = getExerciseSessionAnchor(exerciseId);
    const source = sessionLast || historyLast || anchor;
    const weight = Number(source?.weight);
    const reps = Number(source?.reps);
    if (!weight || !reps) return null;
    return { weight, reps };
  }, [sessionLogsByExercise, getLastStrengthSet, getExerciseSessionAnchor]);

  const handleQuickLog = useCallback((exerciseId) => {
    const suggestion = getSuggestedSet(exerciseId);
    if (!suggestion) return;
    const key = `${exerciseId}-${suggestion.weight}-${suggestion.reps}`;
    const now = Date.now();
    if (lastQuickLogRef.current.key === key && now - lastQuickLogRef.current.at < 900) return;
    lastQuickLogRef.current = { key, at: now };
    onQuickLogSet?.(exerciseId, suggestion);
  }, [getSuggestedSet, onQuickLogSet]);

  const buildExerciseMeta = useCallback((exerciseId) => {
    const eq = EQUIPMENT_DB[exerciseId];
    if (!eq || eq.type === 'cardio') return 'No sets logged yet';
    const lastSet = getLastStrengthSet(exerciseId);
    if (!lastSet) return 'No sets logged yet';
    const weight = Number(lastSet.weight);
    const reps = Number(lastSet.reps);
    const hasWeight = Number.isFinite(weight) && weight > 0;
    const hasReps = Number.isFinite(reps) && reps > 0;
    if (hasWeight && hasReps) return `Last: ${weight} lb × ${reps}`;
    if (hasWeight) return `Last: ${weight} lb`;
    if (hasReps) return `Last: Bodyweight × ${reps}`;
    return 'No sets logged yet';
  }, [getLastStrengthSet]);

  const renderExerciseRow = (id, actionLabel = 'Add', onAction) => {
    const eq = EQUIPMENT_DB[id];
    if (!eq) return null;
    const isComingSoon = !!eq.comingSoon;
    const allowAdd = hasTodayWorkout && !isRestDay && !isComingSoon;
    const categoryClass = colorfulExerciseCards ? resolveCategoryClass(eq.target || eq.muscles || '') : '';
    const badgeGroup = normalizeMuscleGroup(eq);
    const isStarred = starredSet.has(id);
    const metaLabel = buildExerciseMeta(id);
    const muscleLabel = eq.type === 'cardio' ? 'Cardio' : eq.target;
    return (
      <div
        key={id}
        className={`exercise-library-card w-full p-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between ${categoryClass}`}
      >
        <div className="flex items-center gap-3 text-left flex-1 min-w-0">
          <div className="exercise-badge-wrapper">
            {renderMuscleBadge(badgeGroup)}
          </div>
          <div className="min-w-0">
            <div className="font-bold workout-heading text-sm leading-tight">{eq.name}</div>
            <div className="exercise-meta">{metaLabel}</div>
            {isComingSoon && (
              <div className="text-[11px] text-gray-400 font-semibold">Coming Soon</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] workout-muted">{muscleLabel}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleStarred?.(id); }}
              className={`exercise-favorite-button ${isStarred ? 'is-starred' : ''}`}
              aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
            >
              {renderStarIcon(isStarred)}
            </button>
          </div>
          {allowAdd && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); (onAction ? onAction(id) : (swapState ? (onSwapSessionExercise?.(swapState.index, id), setSwapState(null), setLibraryVisible(false)) : onAddExerciseFromSearch?.(id))); }}
              className="cues-accent font-semibold text-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderExerciseTile = (id) => {
    const eq = EQUIPMENT_DB[id];
    if (!eq) return null;
    const isComingSoon = !!eq.comingSoon;
    const allowAdd = hasTodayWorkout && !isRestDay && !isComingSoon;
    const categoryClass = colorfulExerciseCards ? resolveCategoryClass(eq.target || eq.muscles || '') : '';
    const badgeGroup = normalizeMuscleGroup(eq);
    const isStarred = starredSet.has(id);
    const metaLabel = buildExerciseMeta(id);
    const muscleLabel = eq.type === 'cardio' ? 'Cardio' : eq.target;
    return (
      <div key={id} className={`tile text-left exercise-library-card ${categoryClass}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="exercise-badge-wrapper">
            {renderMuscleBadge(badgeGroup)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] workout-muted">{muscleLabel}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleStarred?.(id); }}
              className={`exercise-favorite-button ${isStarred ? 'is-starred' : ''}`}
              aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
            >
              {renderStarIcon(isStarred)}
            </button>
          </div>
        </div>
        <div className="font-bold workout-heading text-sm leading-tight">{eq.name}</div>
        <div className="exercise-meta">{metaLabel}</div>
        {isComingSoon && (
          <div className="text-[11px] text-gray-400 font-semibold mt-1">Coming Soon</div>
        )}
        {allowAdd && (
          <div className="tile-actions">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (swapState) { onSwapSessionExercise?.(swapState.index, id); setSwapState(null); setLibraryVisible(false); } else { onAddExerciseFromSearch?.(id); } }}
              className="tile-action primary"
            >
              Add
            </button>
          </div>
        )}
      </div>
    );
  };

        const handleSearchAdd = (id) => {
    if (!id) return;
    if (!hasTodayWorkout) return;
    const alreadyAdded = sessionEntries.some(entry => (entry.exerciseId || entry.id) === id);
    if (alreadyAdded) {
      onPushMessage?.('Already added');
      setSearchQuery('');
      requestAnimationFrame(() => {
        sessionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    if (swapState) { onSwapSessionExercise?.(swapState.index, id); setSwapState(null); setLibraryVisible(false); } else { onAddExerciseFromSearch?.(id); }
    setSearchQuery('');
    requestAnimationFrame(() => {
      sessionCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBrowseAll = () => {
    setLibraryVisible(prev => !prev);
    setActiveFilter('All');
  };

  const handleSearchFocus = () => {
    if (!showCompactSearch) {
      setShowCompactSearch(true);
      requestAnimationFrame(() => {
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        searchInputRef.current?.focus();
      });
      return;
    }
    setShowCompactSearch(false);
  };

  const showIdleControls = mode === 'idle';
  const showCompactControls = mode !== 'idle';
  const showCompactSearchInput = showCompactControls && (showCompactSearch || !!searchQuery);
  const workoutHeaderSubtitle = isSessionMode ? 'Workout active' : "Workout, Let's build.";

  return (
    <div className="flex flex-col h-full bg-gray-50 workout-shell relative">
      <div className="ps-hero-header sticky top-0 z-20">
        <div className="ps-hero-header__inner">
          <div className="ps-hero-header__left">
            <div className="ps-hero-header__brand select-none">PLANET STRENGTH</div>
            <div className="ps-hero-header__welcome">
              {workoutHeaderSubtitle}
            </div>
          </div>
          <div className="ps-hero-header__icons">
            <button type="button" className="ps-nav-icon-btn" onClick={onToggleRestDay} title="Rest day">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            </button>
            <button type="button" className="ps-nav-icon-btn" onClick={onOpenSettings} title="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button type="button" className="ps-nav-icon-btn ps-nav-icon-btn--avatar" onClick={onOpenSettings} title="Profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto pb-28 px-4 space-y-4 workout-scroll ${isSessionMode ? 'workout-scroll--with-footer' : ''}`}>
        {showIdleControls && (
          <Card className="space-y-3 workout-card mt-5 start-today-card card-enter ps-card-interactive">
            <div>
              <div className="text-xs font-bold workout-muted uppercase">Start Today</div>
              <div className="text-base font-black workout-heading">Build today's session</div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => onStartEmptySession?.()}
                disabled={isRestDay || hasTodayWorkout}
                className={`w-full py-3 rounded-xl font-bold active:scale-[0.98] ${
                  (isRestDay || hasTodayWorkout) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'accent-button'
                }`}
              >
                {hasTodayWorkout ? 'Drafted for today' : 'Start Today'}
              </button>
              <button
                onClick={handleBrowseAll}
                disabled={isRestDay}
                className={`w-full py-3 rounded-xl border font-bold active:scale-[0.98] ${
                  isRestDay ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'ps-browse-library-btn'
                }`}
              >
                {libraryVisible ? 'Close library' : 'Browse library'}
              </button>
            </div>
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                ref={searchInputRef}
                disabled={isRestDay}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:text-gray-400"
              />
            </div>
            {!hasTodayWorkout && !isRestDay && (
              <div className="text-[11px] workout-muted">Add exercises and start logging.</div>
            )}
          </Card>
        )}

        {showCompactControls && (
          <Card className="workout-card mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-bold workout-muted uppercase">
                Workout active
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="pill-button"
                  onClick={handleBrowseAll}
                  disabled={isRestDay}
                >
                  {libraryVisible ? 'Close' : 'Browse all'}
                </button>
                <button
                  type="button"
                  className="pill-button"
                  onClick={handleSearchFocus}
                  disabled={isRestDay}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="pill-button"
                  onClick={() => setIsTemplatePickerOpen(true)}
                  disabled={isRestDay}
                >
                  Template
                </button>
              </div>
            </div>
          </Card>
        )}

        {showCompactSearchInput && (
          <Card className="workout-card">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                ref={searchInputRef}
                disabled={isRestDay}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:text-gray-400"
              />
            </div>
          </Card>
        )}

        {searchQuery && (
          <div ref={searchResultsRef}>
            <Card className="space-y-2 workout-card">
              <div className="text-xs font-bold workout-muted uppercase">Search Results</div>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map(id => renderExerciseRow(id, swapState ? 'Swap' : 'Add', handleSearchAdd))}
                </div>
              ) : (
                <div className="text-xs workout-muted">No matches yet. Try a different keyword.</div>
              )}
            </Card>
          </div>
        )}

        {!isRestDay && hasTodayWorkout && (
          <Card className="space-y-3 workout-card" ref={sessionCardRef}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold workout-muted uppercase">Workout active</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black workout-heading">Today's Workout</div>
                  {activeSession?.createdFrom === 'generated' && (
                    <span className="session-badge">Generated</span>
                  )}
                </div>
                <div className="text-[11px] workout-muted">Log as you go</div>
              </div>
              <button
                onClick={() => {
                  onCancelSession?.(isSessionMode, sessionHasLogged);
                  setLibraryVisible(false);
                  setSearchQuery('');
                  setActiveFilter('All');
                  setSwapState(null);
                }}
                className="session-cancel-button"
              >
                Cancel workout
              </button>
            </div>
            {sessionEntries.length === 0 ? (
              <div className="text-xs workout-muted">Workout ready. Add exercises to get started.</div>
            ) : (
              <div className="space-y-2">
                {sessionEntries.map((entry, idx) => {
                  const entryId = entry.exerciseId || entry.id;
                  const eq = EQUIPMENT_DB[entryId];
                  const entryName = eq?.name || entry.name || entry.label || entryId;
                  const entryMuscle = entry.kind === 'cardio' ? 'Cardio' : (eq?.target || entry.muscleGroup || 'Strength');
                  const entrySetCount = (sessionLogsByExercise[entryId] || []).length;
                  const quickSet = entry.kind !== 'cardio' ? getSuggestedSet(entryId) : null;
                  const categoryClass = colorfulExerciseCards ? resolveCategoryClass(entry.muscleGroup || EQUIPMENT_DB[entryId]?.target || '') : '';
                  return (
                  <div
                    key={entryId}
                    onClick={() => onSelectExercise(entryId, 'session')}
                    className={`session-entry-row active-workout-row ${categoryClass}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSelectExercise(entryId, 'session'); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="active-workout-main">
                      <div className="active-workout-name" style={{ color: 'var(--white)', opacity: 1 }}>{entryName}</div>
                      <div className="active-workout-category">{entryMuscle}</div>
                    </div>
                    <div className="active-workout-controls">
                      <span className="active-workout-setcount">
                        {entrySetCount} {entry.kind === 'cardio' ? 'entries' : 'sets'}
                      </span>
                      <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (quickSet) {
                                handleQuickLog(entryId);
                              } else {
                                onSelectExercise(entryId, 'session');
                              }
                            }}
                            className="active-workout-btn active-workout-btn--primary active-workout-btn--logset ps-tap"
                          >
                            + Set
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelectExercise(entryId, 'session'); }}
                            className="active-workout-btn active-workout-btn--secondary active-workout-btn--edit ps-tap"
                          >
                            Edit
                          </button>
                        </>
                      {entry.kind !== 'cardio' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSwapState({ index: idx });
                            setLibraryVisible(true);
                          }}
                          className="active-workout-btn active-workout-btn--secondary active-workout-btn--swap ps-tap"
                        >
                          Swap
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemoveSessionExercise?.(entryId); }}
                        className="active-workout-btn active-workout-btn--icon ps-tap"
                        aria-label={`Remove ${entry.name || entry.label}`}
                      >
                        <Icon name="Trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )})}
              </div>
            )}
            <div className="space-y-2">
              <button
                onClick={() => searchInputRef.current?.focus()}
                className="w-full py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white text-gray-900 active:scale-[0.98]"
              >
                + Add exercise
              </button>
                          </div>
          </Card>
        )}

        {!isRestDay && !isSessionMode && (libraryVisible || searchQuery) && (
          <>
            {filteredRecents.length > 0 && (
              <Card className="space-y-2 workout-card">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold workout-muted uppercase">Recent</div>
                </div>
                <div className="space-y-2">
                  {filteredRecents.map(id => renderExerciseRow(id, swapState ? 'Swap' : 'Add'))}
                </div>
              </Card>
            )}
          </>
        )}

        {libraryVisible && !isRestDay && (
          <Card className="space-y-2 workout-card">
            {swapState && (
              <div className="text-xs font-bold workout-muted">
                Swapping: {EQUIPMENT_DB[sessionEntries[swapState.index]?.exerciseId || sessionEntries[swapState.index]?.id]?.name || 'Exercise'} — tap any exercise to swap
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold workout-muted uppercase">Full Library</div>
              <button onClick={() => setLibraryVisible(false)} className="text-xs cues-accent font-bold">Close</button>
            </div>
            <div className="filter-chip-row no-scrollbar">
              {filterOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
                  className={`filter-chip ${activeFilter === option ? 'active' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="exercise-grid">
              {filteredPool.map(id => renderExerciseTile(id))}
            </div>
          </Card>
        )}

      </div>

      {isSessionMode && (
        <div className="finish-footer">
          <div className="finish-bar">
            <div className="finish-summary text-sm font-semibold text-gray-600">
              {finishSummaryText}
            </div>
            <button
              onClick={onFinishSession}
              className="finish-button accent-button w-auto py-3 px-5 rounded-2xl font-bold shadow-lg active:scale-[0.98]"
            >
              Finish Workout
            </button>
          </div>
        </div>
      )}

      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        plans={templatePlans}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelect={(plan) => {
          onApplyTemplate?.(plan);
          setIsTemplatePickerOpen(false);
        }}
      />
    </div>
  );
};
