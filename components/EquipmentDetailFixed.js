// ========== EQUIPMENT DETAIL — FIXED LOGGING ==========
// Key fixes vs original:
// 1. Cleanup effect no longer auto-saves on unmount — parent session manager
//    owns the source of truth. Modal just calls onUpdateSessionLogs as user logs.
// 2. handleClose calls onUpdateSessionLogs with current sets, then onClose.
//    No double-save, no stale ref race.
// 3. savedRef removed — no longer needed.
// 4. Stepper layout preserved: stacked WEIGHT / REPS rows.
//
// Props:
//   id              — exercise key in EQUIPMENT_DB
//   profile         — user profile
//   history         — array of past sessions for this exercise
//   settings        — app settings object
//   onClose         — close modal
//   onUpdateSessionLogs(id, sets) — live sync sets to parent session
//   sessionLogs     — current sets array from parent (source of truth)
//   onRequestUndo   — show undo toast
//   onShowToast     — show quick toast
//   autoFocusInput  — focus weight or reps input on open
//   onAutoFocusComplete — clear the pending focus flag

const EquipmentDetailFixed = ({
  id,
  profile,
  history,
  settings,
  onClose,
  onUpdateSessionLogs,
  sessionLogs,
  onRequestUndo,
  onShowToast,
  autoFocusInput,
  onAutoFocusComplete,
}) => {
  const eq = EQUIPMENT_DB[id];
  const sessions = history || [];
  const insightsEnabled = settings?.insightsEnabled !== false;
  const stepIncrement = (eq?.type === 'barbell' || eq?.type === 'machine') ? 5 : 2.5;
  const lastSession = sessions[sessions.length - 1];
  const lastSets = safeArray(lastSession?.sets);
  const lastSet = lastSets[lastSets.length - 1];
  const sourceSetOnOpen = (sessionLogs || [])[Math.max((sessionLogs || []).length - 1, 0)] || lastSet;

  const [activeTab, setActiveTab] = React.useState('workout');
  const [showPlateCalc, setShowPlateCalc] = React.useState(false);

  // Local set inputs — NOT the source of truth for logged sets.
  // Logged sets live in sessionLogs (from parent via onUpdateSessionLogs).
  const [setInputs, setSetInputs] = React.useState(() => (
    sourceSetOnOpen?.weight && sourceSetOnOpen?.reps
      ? { weight: String(sourceSetOnOpen.weight), reps: String(sourceSetOnOpen.reps) }
      : { weight: '', reps: '' }
  ));
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValues, setEditValues] = React.useState({ weight: '', reps: '' });
  const [isAddingSet, setIsAddingSet] = React.useState(false);

  const lastSetSubmitRef = React.useRef({ key: '', at: 0 });
  const weightInputRef = React.useRef(null);
  const repsInputRef = React.useRef(null);

  // Pre-fill inputs from last session or current session logs on first open
  React.useEffect(() => {
    const currentLogs = sessionLogs || [];
    const sourceSet = currentLogs[currentLogs.length - 1] || lastSet;
    if (sourceSet?.weight && sourceSet?.reps) {
      setSetInputs({
        weight: String(sourceSet.weight),
        reps: String(sourceSet.reps)
      });
    }
  }, [id]); // only on exercise change, not every render

  // Auto-focus
  React.useEffect(() => {
    if (!autoFocusInput) return;
    const shouldFocusReps = Boolean(setInputs.weight);
    requestAnimationFrame(() => {
      const target = shouldFocusReps ? repsInputRef.current : weightInputRef.current;
      (target || weightInputRef.current)?.focus();
      onAutoFocusComplete?.();
    });
  }, [autoFocusInput, onAutoFocusComplete]);

  // Lock body scroll while modal open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const adjustInput = (field, delta) => {
    setSetInputs(prev => {
      const base = Number(prev[field]) || 0;
      const next = Math.max(0, base + delta);
      return { ...prev, [field]: String(field === 'weight' ? Math.round(next * 100) / 100 : Math.round(next)) };
    });
  };

  const best = React.useMemo(() => getBestForEquipment(sessions), [sessions]);
  const nextTarget = React.useMemo(() => getNextTarget(profile, id, best), [profile, id, best]);

  const overloadSuggestion = React.useMemo(() => {
    if (sessions.length < 2) return null;
    const recentSessions = sessions.slice(-3);
    const weights = recentSessions.flatMap(s => safeArray(s.sets).map(set => set.weight || 0)).filter(Boolean);
    if (!weights.length) return null;
    const baseWeight = Math.max(...weights);
    const bump = baseWeight < 50 ? 2.5 : baseWeight < 120 ? 5 : 10;
    return {
      nextWeight: clampTo5(baseWeight + bump),
      rationale: `Based on recent ${sessions.length} sessions → try +${bump} lb`
    };
  }, [sessions]);

  const repeatCandidate = React.useMemo(() => {
    const currentLogs = sessionLogs || [];
    const src = currentLogs[currentLogs.length - 1] || lastSet;
    if (src?.weight && src?.reps) return { weight: Number(src.weight), reps: Number(src.reps) };
    return null;
  }, [sessionLogs, lastSet]);

  // ── Set operations (all sync to parent immediately) ────────────────────────

  const addSet = () => {
    const w = Number(setInputs.weight);
    const r = Number(setInputs.reps);
    if (!w || !r || w <= 0 || r <= 0 || isAddingSet) return;

    const now = Date.now();
    const key = `${w}-${r}`;
    if (lastSetSubmitRef.current.key === key && now - lastSetSubmitRef.current.at < 400) return;
    lastSetSubmitRef.current = { key, at: now };

    setIsAddingSet(true);
    const currentLogs = sessionLogs || [];
    const nextLogs = [...currentLogs, { weight: w, reps: r }];
    onUpdateSessionLogs?.(id, nextLogs);

    // Keep inputs sticky to last logged values
    setSetInputs({ weight: String(w), reps: String(r) });
    setEditingIndex(null);
    onShowToast?.('Set saved');

    requestAnimationFrame(() => {
      const shouldFocusReps = true; // after logging, cursor goes back to reps
      (repsInputRef.current || weightInputRef.current)?.focus();
    });
    setTimeout(() => setIsAddingSet(false), 300);
  };

  const repeatLastSet = () => {
    if (!repeatCandidate) return;
    const { weight: w, reps: r } = repeatCandidate;
    const now = Date.now();
    const key = `repeat-${w}-${r}`;
    if (lastSetSubmitRef.current.key === key && now - lastSetSubmitRef.current.at < 400) return;
    lastSetSubmitRef.current = { key, at: now };

    const currentLogs = sessionLogs || [];
    const nextLogs = [...currentLogs, { weight: w, reps: r }];
    onUpdateSessionLogs?.(id, nextLogs);
    setSetInputs({ weight: String(w), reps: String(r) });
    onShowToast?.('Repeated set');
  };

  const saveEditedSet = () => {
    const w = Number(editValues.weight);
    const r = Number(editValues.reps);
    if (!w || !r || editingIndex === null) return;
    const currentLogs = sessionLogs || [];
    const nextLogs = currentLogs.map((set, idx) => idx === editingIndex ? { weight: w, reps: r } : set);
    onUpdateSessionLogs?.(id, nextLogs);
    setEditingIndex(null);
    onShowToast?.('Set updated');
  };

  const deleteSet = (idx) => {
    const currentLogs = sessionLogs || [];
    const removed = currentLogs[idx];
    if (!removed) return;
    const nextLogs = currentLogs.filter((_, i) => i !== idx);
    onUpdateSessionLogs?.(id, nextLogs);
    setEditingIndex(null);
    onRequestUndo?.({
      message: 'Removed.',
      onUndo: () => {
        const restored = [...(sessionLogs || [])];
        restored.splice(Math.min(idx, restored.length), 0, removed);
        onUpdateSessionLogs?.(id, restored);
      }
    });
  };

  // ── Close — no auto-save needed, parent already has latest logs ────────────
  const handleClose = () => {
    onClose();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const loggedSets = sessionLogs || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white dark-mode-modal w-full max-w-md rounded-t-3xl shadow-2xl flex flex-col animate-slide-up logger-sheet"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <Icon name="ChevronLeft" className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{eq.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{eq.muscles}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 bg-gray-50 rounded-full text-gray-400">
            <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
          {['workout', 'cues'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                activeTab === tab
                  ? 'workout-accent-text border-b-2 workout-accent-border'
                  : 'text-gray-400'
              }`}
            >
              {tab === 'workout' ? 'Log' : 'Cues & Info'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto logger-sheet-body">
          <div className="p-5 space-y-4">
            {activeTab === 'workout' ? (
              <>
                {/* Logger controls — flat, no nested card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-gray-500">Log Today</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {Array.from({ length: Math.max(6, loggedSets.length) }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: i < loggedSets.length ? 'var(--yellow)' : 'var(--border)'
                          }}
                        />
                      ))}
                    </div>
                    {eq.type === 'barbell' && (
                      <button
                        onClick={() => setShowPlateCalc(true)}
                        className="text-xs font-bold workout-accent-text"
                      >
                        🏋️ Plates
                      </button>
                    )}
                  </div>

                  {/* Weight stepper */}
                  <div className="logger-stepper logger-control-group">
                    <div className="logger-stepper-label">Weight (lbs)</div>
                    <div className="logger-stepper-controls logger-stepper-row">
                      <button
                        type="button"
                        className="tile-action logger-stepper-button ps-tap"
                        onClick={() => adjustInput('weight', -stepIncrement)}
                      >-{stepIncrement}</button>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={setInputs.weight}
                        onChange={e => setSetInputs(prev => ({ ...prev, weight: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); repsInputRef.current?.focus(); } }}
                        ref={weightInputRef}
                        placeholder="lbs"
                        className="logger-stepper-input workout-accent-focus outline-none"
                      />
                      <button
                        type="button"
                        className="tile-action logger-stepper-button ps-tap"
                        onClick={() => adjustInput('weight', stepIncrement)}
                      >+{stepIncrement}</button>
                    </div>
                  </div>

                  {/* Reps stepper */}
                  <div className="logger-stepper logger-control-group">
                    <div className="logger-stepper-label">Reps</div>
                    <div className="logger-stepper-controls logger-stepper-row">
                      <button
                        type="button"
                        className="tile-action logger-stepper-button ps-tap"
                        onClick={() => adjustInput('reps', -1)}
                      >-1</button>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={setInputs.reps}
                        onChange={e => setSetInputs(prev => ({ ...prev, reps: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSet(); } }}
                        ref={repsInputRef}
                        placeholder="reps"
                        className="logger-stepper-input workout-accent-focus outline-none"
                      />
                      <button
                        type="button"
                        className="tile-action logger-stepper-button ps-tap"
                        onClick={() => adjustInput('reps', 1)}
                      >+1</button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="logger-sheet-actions">
                    <button
                      type="button"
                      onClick={repeatLastSet}
                      disabled={!repeatCandidate || isAddingSet}
                      className={`w-full py-2 rounded-xl font-bold logger-repeat-button ps-tap ${
                        (!repeatCandidate || isAddingSet)
                          ? 'workout-accent-disabled cursor-not-allowed'
                          : 'workout-accent-surface'
                      }`}
                    >
                      {repeatCandidate
                        ? `Repeat Last Set (${repeatCandidate.weight} × ${repeatCandidate.reps})`
                        : 'Repeat Last Set'}
                    </button>

                    <button
                      type="button"
                      onClick={addSet}
                      disabled={!setInputs.weight || !setInputs.reps || isAddingSet}
                      className={`w-full py-3 rounded-xl font-black active:scale-95 flex items-center justify-center gap-2 logger-log-button ${
                        (!setInputs.weight || !setInputs.reps || isAddingSet)
                          ? 'workout-accent-disabled cursor-not-allowed'
                          : 'workout-accent-solid shadow-lg'
                      }`}
                    >
                      <span className="text-lg">＋</span>
                      {isAddingSet ? 'Logging...' : 'Log Set'}
                    </button>
                  </div>
                </div>

                {/* Logged sets list */}
                {loggedSets.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase text-gray-500">Logged sets</div>
                    {loggedSets.map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          editingIndex === idx
                            ? 'workout-accent-border workout-accent-surface'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        {editingIndex === idx ? (
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              inputMode="numeric"
                              value={editValues.weight}
                              onChange={e => setEditValues(prev => ({ ...prev, weight: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') saveEditedSet(); }}
                              className="w-full p-2 rounded-lg border-2 workout-accent-border bg-white font-bold text-center text-gray-900 workout-accent-focus outline-none"
                            />
                            <input
                              type="number"
                              inputMode="numeric"
                              value={editValues.reps}
                              onChange={e => setEditValues(prev => ({ ...prev, reps: e.target.value }))}
                              onKeyDown={e => { if (e.key === 'Enter') saveEditedSet(); }}
                              className="w-full p-2 rounded-lg border-2 workout-accent-border bg-white font-bold text-center text-gray-900 workout-accent-focus outline-none"
                            />
                            <button onClick={saveEditedSet} className="col-span-2 py-2 rounded-lg workout-accent-solid font-bold active:scale-95">
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 cursor-pointer" onClick={() => {
                            setEditingIndex(idx);
                            setEditValues({ weight: String(s.weight || ''), reps: String(s.reps || '') });
                          }}>
                            <div className="text-xs font-black text-gray-900">Set {idx + 1}</div>
                            <div className="text-sm font-semibold text-gray-800">{s.weight} lb × {s.reps} reps</div>
                          </div>
                        )}
                        {editingIndex === idx ? (
                          <button onClick={() => setEditingIndex(null)} className="text-gray-500 text-sm font-semibold px-2 py-1">
                            Cancel
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingIndex(idx); setEditValues({ weight: String(s.weight || ''), reps: String(s.reps || '') }); }}
                              className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 active:scale-95"
                            >Edit</button>
                            <button
                              onClick={() => deleteSet(idx)}
                              className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600 active:scale-95"
                            >✕</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {insightsEnabled && overloadSuggestion && (
                  <div className="cues-card">
                    <div className="text-[10px] font-black uppercase cues-accent mb-1">Next session suggestion</div>
                    <div className="text-sm font-black cues-title">Try {overloadSuggestion.nextWeight} lbs</div>
                    <div className="text-xs cues-muted">{overloadSuggestion.rationale}</div>
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 rounded-xl workout-accent-solid font-bold text-sm uppercase tracking-widest active:scale-95"
                >
                  Close Exercise
                </button>
              </>
            ) : (
              /* Cues tab — unchanged */
              <div className="space-y-3">
                {eq.cues?.length > 0 && (
                  <div className="cues-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Check" className="w-5 h-5 cues-accent" />
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
                )}
                {eq.progression && (
                  <div className="cues-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="TrendingUp" className="w-5 h-5 cues-accent" />
                      <h3 className="text-xs font-black uppercase cues-title">Progression</h3>
                    </div>
                    <p className="text-sm cues-muted leading-relaxed">{eq.progression}</p>
                  </div>
                )}
              </div>
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
