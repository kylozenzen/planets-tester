const PlateCalculator = ({ targetWeight, barWeight, onClose }) => {
      const [displayWeight, setDisplayWeight] = useState(targetWeight || barWeight || '');
      
      const plates = [45, 35, 25, 10, 5, 2.5];
      
      const calculatePlates = (weight) => {
        const w = Number(weight) || 0;
        const weightPerSide = (w - barWeight) / 2;
        if (weightPerSide <= 0) return [];
        
        const result = [];
        let remaining = weightPerSide;
        
        for (const plate of plates) {
          while (remaining >= plate) {
            result.push(plate);
            remaining -= plate;
          }
        }
        
        return result;
      };
      
      const platesToLoad = calculatePlates(displayWeight);
      const actualWeight = barWeight + (platesToLoad.reduce((sum, p) => sum + p, 0) * 2);
      
      return (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-slide-up" onClick={onClose}>
          <div className="bg-white dark-mode-modal rounded-t-3xl w-full max-w-lg p-6 pb-8" style={{ maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Plate Calculator</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <Icon name="X" className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Target Weight</label>
              <input
                type="number"
                value={displayWeight}
                onChange={(e) => setDisplayWeight(e.target.value)}
                placeholder="Enter weight"
                className="w-full text-2xl font-bold text-center p-4 border-2 workout-accent-border rounded-xl workout-accent-focus outline-none bg-white text-gray-900 dark-mode-input"
              />
              <div className="text-center text-xs text-gray-500 mt-2">Bar weight: {barWeight} lbs</div>
            </div>
            
            {platesToLoad.length > 0 ? (
              <>
                <div className="workout-accent-surface rounded-xl p-4 mb-4">
                  <div className="text-center mb-3">
                    <div className="text-sm font-semibold workout-accent-text">Actual Weight</div>
                    <div className="text-3xl font-black workout-accent-text">{actualWeight} lbs</div>
                  </div>
                  
                  <div className="flex justify-center items-center gap-2 my-6">
                    <div className="text-xs text-gray-500 transform -rotate-90 whitespace-nowrap">Each Side</div>
                    <div className="flex flex-col gap-1">
                      {platesToLoad.map((plate, i) => (
                        <div
                          key={i}
                          className="workout-accent-solid rounded px-3 py-2 text-center font-bold text-sm"
                          style={{ width: `${60 + plate}px` }}
                        >
                          {plate}
                        </div>
                      ))}
                    </div>
                    <div className="w-16 h-3 bg-gray-800 rounded"></div>
                  </div>
                  
                  <div className="text-center text-xs text-gray-600">
                    Put these plates on <span className="font-bold">each side</span> of the bar
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-2">
                  {plates.map(p => {
                    const count = platesToLoad.filter(plate => plate === p).length;
                    return (
                      <div key={p} className={`text-center p-2 rounded-lg border ${
                        count > 0 ? 'workout-accent-surface' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="text-xs font-bold text-gray-900">{p}</div>
                        {count > 0 && <div className="text-xs workout-accent-text">×{count}</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏋️</div>
                <div className="text-sm">Just the bar ({barWeight} lbs)</div>
              </div>
            )}
          </div>
        </div>
      );
    };

    // ========== EQUIPMENT DETAIL ==========
    const EquipmentDetail = ({ id, profile, history, settings, onSave, onClose, onUpdateSessionLogs, sessionLogs, onRequestUndo, onShowToast, autoFocusInput, onAutoFocusComplete }) => {
      const eq = EQUIPMENT_DB[id];
      const sessions = history || [];
      const insightsEnabled = settings?.insightsEnabled !== false;
      const [activeTab, setActiveTab] = useState('workout');
      const [showLogger, setShowLogger] = useState(true);
      const [showPlateCalc, setShowPlateCalc] = useState(false);
      const [anchorWeight, setAnchorWeight] = useState('');
      const [anchorReps, setAnchorReps] = useState('');
      const [anchorAdjusted, setAnchorAdjusted] = useState(false);
      const [loggedSets, setLoggedSets] = useState([]);
      const [setInputs, setSetInputs] = useState({ weight: '', reps: '' });
      const [editingIndex, setEditingIndex] = useState(null);
      const [editValues, setEditValues] = useState({ weight: '', reps: '' });
      const [baselineInputs, setBaselineInputs] = useState({ weight: '', reps: '' });
      const [baselineConfirmed, setBaselineConfirmed] = useState(sessions.length > 0);
      const [note, setNote] = useState('');
      const [isAddingSet, setIsAddingSet] = useState(false);
      const savedRef = useRef(false);
      const latestDraftRef = useRef({ loggedSets: [], anchorWeight: '', anchorReps: '', anchorAdjusted: false, note: '' });
      const lastSetSubmitRef = useRef({ key: '', at: 0 });
      const weightInputRef = useRef(null);
      const repsInputRef = useRef(null);
      const onSaveRef = useRef(onSave);

      const best = useMemo(() => getBestForEquipment(sessions), [sessions]);
      const nextTarget = useMemo(() => getNextTarget(profile, id, best), [profile, id, best]);
      const sessionNumber = sessions.length + 1;

      const deriveSessionAnchor = (session) => {
        if (!session) return { weight: null, reps: null };
        const weights = safeArray(session.sets).map(s => s.weight || 0).filter(Boolean);
        const reps = safeArray(session.sets).map(s => s.reps || 0).filter(Boolean);
        return {
          weight: session.anchorWeight || (weights.length ? Math.max(...weights) : null),
          reps: session.anchorReps || (reps.length ? Math.round(reps.reduce((a, b) => a + b, 0) / reps.length) : null)
        };
      };

      const baselineFromHistory = useMemo(() => {
        if (!sessions || sessions.length === 0) return null;
        const first = sessions[0];
        const anchor = deriveSessionAnchor(first);
        if (first?.baselineWeight && first?.baselineReps) {
          return { weight: first.baselineWeight, reps: first.baselineReps };
        }
        if (anchor.weight && anchor.reps) return { weight: anchor.weight, reps: anchor.reps };
        return null;
      }, [sessions]);

      const recentAnchor = useMemo(() => {
        const recent = (sessions || []).slice(-3);
        if (recent.length === 0) return { weight: null, reps: null };
        const weights = recent.map(s => deriveSessionAnchor(s).weight).filter(Boolean);
        const reps = recent.map(s => deriveSessionAnchor(s).reps).filter(Boolean);
        return {
          weight: weights.length ? Math.max(...weights) : null,
          reps: reps.length ? Math.round(reps.sort((a,b) => a-b)[Math.floor(reps.length/2)]) : null
        };
      }, [sessions]);

      const lastSession = sessions[sessions.length - 1];
      const lastSessionSummary = useMemo(() => {
        if (!insightsEnabled || !lastSession || !lastSession.sets?.length) return null;
        const lastSet = lastSession.sets[lastSession.sets.length - 1];
        if (!lastSet?.weight || !lastSet?.reps) return null;
        return `${lastSet.weight} lb × ${lastSet.reps} reps`;
      }, [insightsEnabled, lastSession]);
      const defaultAnchor = useMemo(() => {
        const anchor = deriveSessionAnchor(lastSession);
        if (anchor.weight && anchor.reps) return anchor;
        if (baselineFromHistory) return baselineFromHistory;
        return { weight: null, reps: null };
      }, [lastSession, baselineFromHistory]);

      useEffect(() => {
        const weight = defaultAnchor.weight ? String(defaultAnchor.weight) : '';
        const reps = defaultAnchor.reps ? String(defaultAnchor.reps) : '';
        setAnchorWeight(weight);
        setAnchorReps(reps);
        setAnchorAdjusted(false);
        setNote('');
        setSetInputs({ weight: '', reps: '' });
        setBaselineInputs({
          weight: baselineFromHistory?.weight ? String(baselineFromHistory.weight) : '',
          reps: baselineFromHistory?.reps ? String(baselineFromHistory.reps) : ''
        });
        setBaselineConfirmed(sessions.length > 0);
        savedRef.current = false;
      }, [id, defaultAnchor, baselineFromHistory, sessions.length]);

      useEffect(() => {
        setLoggedSets(sessionLogs || []);
      }, [sessionLogs]);

      useEffect(() => {
        setSetInputs(prev => ({
          weight: prev.weight || (anchorWeight || ''),
          reps: prev.reps || (anchorReps || '')
        }));
      }, [anchorWeight, anchorReps]);

      useEffect(() => {
        if (!autoFocusInput) return;
        const shouldFocusReps = Boolean(setInputs.weight || anchorWeight);
        requestAnimationFrame(() => {
          const target = shouldFocusReps ? repsInputRef.current : weightInputRef.current;
          (target || weightInputRef.current || repsInputRef.current)?.focus();
          onAutoFocusComplete?.();
        });
      }, [autoFocusInput, anchorWeight, onAutoFocusComplete, setInputs.weight]);

      useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = previousOverflow;
        };
      }, []);

      const syncSessionSets = (nextSets) => {
        if (onUpdateSessionLogs) {
          onUpdateSessionLogs(id, nextSets);
        }
      };

      const handleQuickAddSet = () => {
        const w = Number(setInputs.weight);
        const r = Number(setInputs.reps);
        if (!w || !r || w <= 0 || r <= 0) return;
        if (isAddingSet) return;
        const now = Date.now();
        const key = `${w}-${r}`;
        if (lastSetSubmitRef.current.key === key && now - lastSetSubmitRef.current.at < 900) return;
        lastSetSubmitRef.current = { key, at: now };
        setIsAddingSet(true);
        setLoggedSets(prev => {
          const next = [...prev, { weight: w, reps: r }];
          syncSessionSets(next);
          return next;
        });
        const nextWeight = String(w);
        const nextReps = String(r);
        setAnchorWeight(nextWeight);
        setAnchorReps(nextReps);
        setAnchorAdjusted(true);
        setSetInputs({ weight: nextWeight, reps: nextReps });
        const shouldFocusReps = Boolean(nextWeight);
        requestAnimationFrame(() => {
          const target = shouldFocusReps ? repsInputRef.current : weightInputRef.current;
          (target || weightInputRef.current || repsInputRef.current)?.focus();
        });
        setTimeout(() => setIsAddingSet(false), 300);
        setEditingIndex(null);
        onShowToast?.('Set saved');
      };

      const applySetToInputs = (setLike) => {
        if (!setLike) return;
        const weight = Number(setLike.weight);
        const reps = Number(setLike.reps);
        if (!weight || !reps) return;
        const nextWeight = String(weight);
        const nextReps = String(reps);
        setSetInputs({ weight: nextWeight, reps: nextReps });
        setAnchorWeight(nextWeight);
        setAnchorReps(nextReps);
        setAnchorAdjusted(true);
      };

      const adjustSetInput = (field, delta) => {
        setSetInputs(prev => {
          const anchorValue = field === 'weight' ? Number(anchorWeight) : Number(anchorReps);
          const base = Number(prev[field]) || anchorValue || 0;
          const nextRaw = Math.max(0, base + delta);
          const nextValue = field === 'weight'
            ? String(Math.round(nextRaw * 100) / 100)
            : String(Math.round(nextRaw));
          return { ...prev, [field]: nextValue };
        });
      };

      const repeatLastSetCandidate = useMemo(() => {
        const sessionLast = loggedSets[loggedSets.length - 1];
        if (sessionLast?.weight && sessionLast?.reps) {
          return { weight: Number(sessionLast.weight), reps: Number(sessionLast.reps) };
        }
        const historyLast = lastSession?.sets?.[lastSession.sets.length - 1];
        if (historyLast?.weight && historyLast?.reps) {
          return { weight: Number(historyLast.weight), reps: Number(historyLast.reps) };
        }
        if (anchorWeight && anchorReps) {
          return { weight: Number(anchorWeight), reps: Number(anchorReps) };
        }
        return null;
      }, [loggedSets, lastSession, anchorWeight, anchorReps]);

      const handleRepeatLastSet = () => {
        if (!repeatLastSetCandidate) return;
        const w = Number(repeatLastSetCandidate.weight);
        const r = Number(repeatLastSetCandidate.reps);
        if (!w || !r) return;
        const now = Date.now();
        const key = `repeat-${w}-${r}`;
        if (lastSetSubmitRef.current.key === key && now - lastSetSubmitRef.current.at < 900) return;
        lastSetSubmitRef.current = { key, at: now };
        setLoggedSets(prev => {
          const next = [...prev, { weight: w, reps: r }];
          syncSessionSets(next);
          return next;
        });
        applySetToInputs({ weight: w, reps: r });
        onShowToast?.('Repeated set');
      };

      const startEditSet = (idx) => {
        const target = loggedSets[idx];
        if (!target) return;
        setEditingIndex(idx);
        setEditValues({ weight: String(target.weight || ''), reps: String(target.reps || '') });
      };

      const saveEditedSet = () => {
        const w = Number(editValues.weight);
        const r = Number(editValues.reps);
        if (!w || !r || w <= 0 || r <= 0 || editingIndex === null) return;
        setLoggedSets(prev => {
          const next = prev.map((set, idx) => idx === editingIndex ? { weight: w, reps: r } : set);
          syncSessionSets(next);
          return next;
        });
        setEditingIndex(null);
        onShowToast?.('Set saved');
      };

      const deleteSet = (idx) => {
        const removed = loggedSets[idx];
        if (!removed) return;
        const next = loggedSets.filter((_, i) => i !== idx);
        setLoggedSets(next);
        syncSessionSets(next);
        setEditingIndex(null);
        onRequestUndo?.({
          message: 'Removed.',
          onUndo: () => {
            setLoggedSets(prev => {
              const restored = [...prev];
              const insertAt = Math.min(idx, restored.length);
              restored.splice(insertAt, 0, removed);
              syncSessionSets(restored);
              return restored;
            });
          }
        });
      };

      const buildSessionPayload = (draft) => {
        const source = draft || { loggedSets, anchorWeight, anchorReps, anchorAdjusted, note };
        const sets = source.loggedSets || [];
        if (sets.length === 0) return null;
        const basePayload = {
          date: new Date().toISOString(),
          type: 'strength',
          sets,
          anchorWeight: Number(source.anchorWeight),
          anchorReps: Number(source.anchorReps),
          adjustedToday: source.anchorAdjusted || false,
          note: source.note || undefined
        };
        if (sessions.length === 0) {
          return {
            ...basePayload,
            baselineWeight: Number(source.anchorWeight),
            baselineReps: Number(source.anchorReps)
          };
        }
        return basePayload;
      };

      const handleSaveSession = () => {
        const payload = buildSessionPayload();
        if (payload) {
          onSave(id, payload);
          savedRef.current = true;
          return true;
        }
        return false;
      };

      useEffect(() => {
        latestDraftRef.current = { loggedSets, anchorWeight, anchorReps, anchorAdjusted, note };
      }, [loggedSets, anchorWeight, anchorReps, anchorAdjusted, note]);

      // Keep onSaveRef in sync with latest onSave prop
      useEffect(() => {
        onSaveRef.current = onSave;
      }, [onSave]);

      // Cleanup effect - only runs on unmount, uses refs to avoid stale closures
      useEffect(() => {
        return () => {
          if (!savedRef.current) {
            const payload = buildSessionPayload(latestDraftRef.current);
            if (payload && onSaveRef.current) {
              // Pass keepOpen: true to prevent closing modal during auto-save cleanup
              // The modal will be closed by onClose() separately if user initiated close
              onSaveRef.current(id, payload, { quiet: true, keepOpen: true });
              savedRef.current = true;
            }
          }
        };
      }, [id]);

      const handleClose = () => {
        handleSaveSession();
        onClose();
      };

      const isBaselineMode = sessions.length === 0 && !baselineConfirmed;

      const weightBump = (w) => {
        if (!w) return 5;
        if (w < 50) return 2.5;
        if (w < 120) return 5;
        return 10;
      };

      const overloadSuggestion = useMemo(() => {
        if (sessions.length < 2) return null;
        const numericAnchorWeight = Number(anchorWeight) || Number(baselineInputs.weight);
        const numericAnchorReps = Number(anchorReps) || Number(baselineInputs.reps);
        const baseWeight = recentAnchor.weight || numericAnchorWeight;
        const baseReps = recentAnchor.reps || numericAnchorReps;
        if (!baseWeight || !baseReps) return null;
        const bump = weightBump(baseWeight);
        return {
          nextWeight: clampTo5(baseWeight + bump),
          reps: baseReps,
          rationale: `${sessions.length >= 2 ? '2 consistent sessions' : 'Recent consistency'} → try +${bump} lb`
        };
      }, [sessions.length, anchorWeight, anchorReps, baselineInputs, recentAnchor]);

      const handleConfirmBaseline = () => {
        const w = Number(baselineInputs.weight);
        const r = Number(baselineInputs.reps);
        if (!w || !r || w <= 0 || r <= 0) return;
        setAnchorWeight(String(w));
        setAnchorReps(String(r));
        setBaselineConfirmed(true);
        setAnchorAdjusted(false);
      };

      const getPlateLoadingForSet = (weight) => {
        if (eq.type !== 'barbell' || !weight) return null;
        return calculatePlateLoading(Number(weight), profile.barWeight || 45);
      };

      return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark-mode-modal w-full max-w-md rounded-t-3xl shadow-2xl flex flex-col animate-slide-up logger-sheet" style={{maxHeight: '90dvh'}}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Icon name="ChevronLeft" className="w-6 h-6"/>
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{eq.name}</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {eq.type === 'machine' ? '⚙️' : eq.type === 'dumbbell' ? '🏋️' : '🏋️‍♂️'} {eq.muscles}
                  </p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                <Icon name="X" className="w-5 h-5"/>
              </button>
            </div>

            <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
              <button
                onClick={() => setActiveTab('workout')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === 'workout' ? 'workout-accent-text border-b-2 workout-accent-border' : 'text-gray-400'
                }`}
              >
                Log
              </button>
              {insightsEnabled && (<button
                onClick={() => setActiveTab('cues')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === 'cues' ? 'workout-accent-text border-b-2 workout-accent-border' : 'text-gray-400'
                }`}
              >
                Cues & Info
              </button>)}
            </div>

            <div className="flex-1 overflow-y-auto logger-sheet-body">
              <div className="p-5 space-y-5 h-full">
                {activeTab === 'workout' ? (
                  <>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden logger-logtoday-panel">
                      <button
                        onClick={() => setShowLogger(!showLogger)}
                        className="w-full p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Icon name="Trophy" className="w-5 h-5 workout-accent-text"/>
                          <h3 className="text-xs font-black uppercase text-gray-900">Log Today</h3>
                        </div>
                        <Icon name="ChevronDown" className={`w-5 h-5 text-gray-600 transition-transform ${showLogger ? 'rotate-180' : ''}`}/>
                      </button>

                      {showLogger && (
                        <div className="px-4 pb-4 space-y-3 animate-expand">
                          {isBaselineMode && (
                            <div className="p-3 rounded-2xl baseline-card space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">🧭</div>
                                <div className="flex-1">
                                  <div className="text-[10px] font-black uppercase baseline-accent">Set your starting point</div>
                                  <p className="text-sm baseline-primary font-semibold leading-relaxed">
                                    Set a weight and reps to begin. You can change these anytime.
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={baselineInputs.weight}
                                  onChange={(e) => setBaselineInputs(prev => ({ ...prev, weight: e.target.value }))}
                                  placeholder="lbs"
                                  className="w-full p-3 rounded-xl baseline-input font-black text-center workout-accent-focus outline-none"
                                />
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={baselineInputs.reps}
                                  onChange={(e) => setBaselineInputs(prev => ({ ...prev, reps: e.target.value }))}
                                  placeholder="reps"
                                  className="w-full p-3 rounded-xl baseline-input font-black text-center workout-accent-focus outline-none"
                                />
                              </div>
                              <button
                                onClick={handleConfirmBaseline}
                                disabled={!baselineInputs.weight || !baselineInputs.reps}
                                className={`w-full py-3 rounded-xl font-black transition-all active:scale-95 baseline-button ${
                                  baselineInputs.weight && baselineInputs.reps ? 'baseline-button--active' : 'baseline-button--disabled'
                                }`}
                              >
                                Set baseline & start logging
                              </button>
                            </div>
                          )}

                          {!isBaselineMode && (
                            <>
                              <div className="p-3 rounded-2xl workout-accent-surface space-y-3 logger-controls-shell">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-[10px] font-black uppercase workout-accent-text">Anchored weight</div>
                                    <div className="text-base font-black text-gray-900">
                                      {anchorWeight && anchorReps ? `${anchorWeight} lb × ${anchorReps} reps` : 'Set your anchor'}
                                    </div>
                                    {anchorAdjusted && <div className="text-[11px] workout-accent-text font-semibold">Adjusted today</div>}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                  <span>Sets completed: {loggedSets.length}</span>
                                  {anchorWeight && anchorReps && (
                                    <span className="text-[11px] workout-accent-text font-bold">Using: {anchorWeight} lb × {anchorReps} reps</span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 logger-mobile-controls">
                                  <div className="logger-stepper logger-control-group logger-control-group--weight">
                                    <div className="logger-stepper-label">Weight</div>
                                    <div className="logger-stepper-controls logger-stepper-row">
                                      <button type="button" className="tile-action logger-stepper-button ps-tap" onClick={() => adjustSetInput('weight', -5)}>-5</button>
                                      <input
                                        type="number"
                                        inputMode="decimal"
                                        value={setInputs.weight}
                                        onChange={(e) => setSetInputs(prev => ({ ...prev, weight: e.target.value }))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            repsInputRef.current?.focus();
                                          }
                                        }}
                                        placeholder="Weight"
                                        ref={weightInputRef}
                                        className="logger-stepper-input workout-accent-focus outline-none"
                                      />
                                      <button type="button" className="tile-action logger-stepper-button ps-tap" onClick={() => adjustSetInput('weight', 5)}>+5</button>
                                    </div>
                                  </div>
                                  <div className="logger-stepper logger-control-group logger-control-group--reps">
                                    <div className="logger-stepper-label">Reps</div>
                                    <div className="logger-stepper-controls logger-stepper-row">
                                      <button type="button" className="tile-action logger-stepper-button ps-tap" onClick={() => adjustSetInput('reps', -1)}>-1</button>
                                      <input
                                        type="number"
                                        inputMode="numeric"
                                        value={setInputs.reps}
                                        onChange={(e) => setSetInputs(prev => ({ ...prev, reps: e.target.value }))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleQuickAddSet();
                                          }
                                        }}
                                        placeholder="Reps"
                                        ref={repsInputRef}
                                        className="logger-stepper-input workout-accent-focus outline-none"
                                      />
                                      <button type="button" className="tile-action logger-stepper-button ps-tap" onClick={() => adjustSetInput('reps', 1)}>+1</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="logger-sheet-actions">
                                  <button
                                    type="button"
                                    onClick={handleRepeatLastSet}
                                    disabled={!repeatLastSetCandidate || isAddingSet}
                                    className={`w-full py-2 rounded-xl font-bold transition-all logger-repeat-button ps-tap ${
                                      (!repeatLastSetCandidate || isAddingSet) ? 'workout-accent-disabled cursor-not-allowed' : 'workout-accent-surface'
                                    }`}
                                  >
                                    {repeatLastSetCandidate ? `Repeat Last Set (${repeatLastSetCandidate.weight} × ${repeatLastSetCandidate.reps})` : 'Repeat Last Set'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleQuickAddSet();
                                    }}
                                    disabled={!setInputs.weight || !setInputs.reps || isBaselineMode || isAddingSet}
                                    className={`w-full py-3 rounded-xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 logger-log-button ${
                                      (!setInputs.weight || !setInputs.reps || isBaselineMode || isAddingSet) ? 'workout-accent-disabled cursor-not-allowed' : 'workout-accent-solid shadow-lg'
                                    }`}
                                  >
                                    <span className="text-lg">＋</span>
                                    {isAddingSet ? 'Logging...' : 'Log Set'}
                                  </button>
                                </div>
                              </div>
                              {eq.type === 'barbell' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPlateCalc(true);
                                  }}
                                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-white workout-accent-text border workout-accent-border active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                  🏋️ Plate Calculator
                                </button>
                              )}

                              <div className="p-3 rounded-2xl bg-white border border-gray-100 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="text-[10px] font-black uppercase text-gray-500">Logged sets</div>
                                  {loggedSets.length > 0 && (
                                    <div className="text-[11px] workout-accent-text font-semibold">{loggedSets.length} sets</div>
                                  )}
                                </div>
                                {loggedSets.length === 0 ? (
                                  <div className="text-sm text-gray-500">{COPY_LOGGER.noSetsYet}</div>
                                ) : (
                                  <div className="space-y-2">
                                    {loggedSets.map((s, idx) => (
                                      <div
                                        key={idx}
                                        className={`p-3 rounded-xl border ${editingIndex === idx ? 'workout-accent-border workout-accent-surface' : 'border-gray-100 bg-gray-50'} flex items-center justify-between gap-3`}
                                      >
                                        {editingIndex === idx ? (
                                          <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input
                                              type="number"
                                              inputMode="numeric"
                                              value={editValues.weight}
                                              onChange={(e) => setEditValues(prev => ({ ...prev, weight: e.target.value }))}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  saveEditedSet();
                                                }
                                              }}
                                              className="w-full p-2 rounded-lg border-2 workout-accent-border bg-white font-bold text-center text-gray-900 workout-accent-focus outline-none"
                                            />
                                            <input
                                              type="number"
                                              inputMode="numeric"
                                              value={editValues.reps}
                                              onChange={(e) => setEditValues(prev => ({ ...prev, reps: e.target.value }))}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  saveEditedSet();
                                                }
                                              }}
                                              className="w-full p-2 rounded-lg border-2 workout-accent-border bg-white font-bold text-center text-gray-900 workout-accent-focus outline-none"
                                            />
                                            <button
                                              onClick={saveEditedSet}
                                              className="col-span-2 py-2 rounded-lg workout-accent-solid font-bold active:scale-95"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex-1 cursor-pointer" onClick={() => startEditSet(idx)}>
                                            <div className="text-xs font-black text-gray-900">Set {idx + 1}</div>
                                            <div className="text-sm font-semibold text-gray-800">{s.weight} lb × {s.reps} reps</div>
                                          </div>
                                        )}
                                        {editingIndex === idx ? (
                                          <button
                                            onClick={() => setEditingIndex(null)}
                                            className="text-gray-500 text-sm font-semibold px-2 py-1"
                                          >
                                            Cancel
                                          </button>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => startEditSet(idx)}
                                              className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 active:scale-95"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={() => deleteSet(idx)}
                                              className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600 active:scale-95"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="p-3 rounded-2xl bg-white border border-gray-100">
                                <button
                                  onClick={handleClose}
                                  className="w-full px-4 py-3 rounded-xl workout-accent-solid font-bold text-sm uppercase tracking-widest active:scale-95"
                                >
                                  {COPY_LOGGER.finishCta}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="cues-card">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Target" className="w-5 h-5 cues-accent"/>
                          <h3 className="text-xs font-black uppercase cues-title">Progressive Overload</h3>
                        </div>
                        {overloadSuggestion ? (
                          <div className="space-y-1">
                            <div className="text-sm font-black cues-title">Suggested next: {overloadSuggestion.nextWeight} lb × {overloadSuggestion.reps}</div>
                            <div className="text-xs cues-muted">Why: {overloadSuggestion.rationale}</div>
                            <div className="text-[11px] cues-muted font-semibold">Suggestions stay optional—log what really happened.</div>
                          </div>
                        ) : (
                          <div className="text-sm cues-muted">Complete 2 sessions to unlock a suggestion.</div>
                        )}
                      </div>

                      <div className="cues-card">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="Check" className="w-5 h-5 cues-accent"/>
                          <h3 className="text-xs font-black uppercase cues-title">Form Cues</h3>
                        </div>
                        <ul className="space-y-2">
                          {eq.cues.map((cue, i) => (
                            <li key={i} className="flex gap-2 text-sm cues-title">
                              <span className="cues-accent font-bold">•</span>
                              <span>{cue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="cues-card">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="Info" className="w-5 h-5 cues-accent"/>
                          <h3 className="text-xs font-black uppercase cues-title">Progression notes</h3>
                        </div>
                        <p className="text-sm cues-muted leading-relaxed">{eq.progression}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {showPlateCalc && (
            <PlateCalculator
              targetWeight={nextTarget}
              barWeight={profile.barWeight || 45}
              onClose={() => setShowPlateCalc(false)}
            />
          )}
        </div>
      );
    };

    // ========== PROGRESS TAB ==========
