const CardioLogger = ({ id, onClose, onUpdateSessionLogs, sessionLogs, history, settings }) => {
  const eq = EQUIPMENT_DB[id] || { name: 'Cardio', emoji: '🏃' };
  const isRunning = eq?.cardioGroup === 'running';
  const isSwimming = eq?.cardioGroup === 'swimming';
  const [entries, setEntries] = useState(sessionLogs || []);
  const [showForm, setShowForm] = useState(false);
  const [environment, setEnvironment] = useState('road');
  const [durationMin, setDurationMin] = useState('');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('mi');
  const [swimMode, setSwimMode] = useState('laps');
  const [poolType, setPoolType] = useState('25yd');
  const [laps, setLaps] = useState('');
  const [stroke, setStroke] = useState('');
  const [effort, setEffort] = useState('moderate');
  const [incline, setIncline] = useState('');
  const [notes, setNotes] = useState('');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const durationRef = useRef(null);

  useEffect(() => {
    setEntries(sessionLogs || []);
  }, [sessionLogs, id]);

  useEffect(() => {
    if (showForm) {
      requestAnimationFrame(() => durationRef.current?.focus());
    }
  }, [showForm, id]);

  useEffect(() => {
    if (!showForm || !canSuggestRunning) return;
    setDurationMin(String(suggestedDuration));
    setDistance(String(suggestedDistance));
    setDistanceUnit(lastRunningEntry?.distanceUnit || distanceUnit);
  }, [showForm, canSuggestRunning, suggestedDuration, suggestedDistance, lastRunningEntry]);

  useEffect(() => {
    if (swimMode === 'laps') {
      setDistance('');
    }
    if (swimMode === 'distance') {
      setLaps('');
    }
    if (swimMode === 'time_only') {
      setDistance('');
      setLaps('');
    }
  }, [swimMode]);

  const formatPace = (value) => {
    if (!Number.isFinite(value)) return null;
    const totalSeconds = Math.round(value * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDistanceUnitLabel = (entry) => entry?.distanceUnit || distanceUnit || 'mi';

  const getPoolUnitLabel = (pool) => {
    if (pool === '25m' || pool === '50m') return 'm';
    return 'yd';
  };

  const getRunningEnvironmentLabel = (env) => {
    const map = {
      treadmill: 'Treadmill',
      indoor_track: 'Indoor track',
      outdoor_track: 'Outdoor track',
      road: 'Road',
      trail: 'Trail',
      other: 'Other'
    };
    return map[env] || (env ? env.replace(/_/g, ' ') : '');
  };

  const getPoolTypeLabel = (pool) => {
    const map = {
      '25yd': '25 yd',
      '25m': '25 m',
      '50m': '50 m',
      open_water: 'Open water'
    };
    return map[pool] || (pool ? pool.replace(/_/g, ' ') : '');
  };

  const poolUnitLabel = useMemo(() => getPoolUnitLabel(poolType), [poolType]);

  const poolLength = useMemo(() => {
    if (poolType === '25yd') return 25;
    if (poolType === '25m') return 25;
    if (poolType === '50m') return 50;
    return null;
  }, [poolType]);

  const buildRunningSummary = (entry) => {
    if (!entry) return null;
    const mins = Number(entry.durationMin ?? entry.minutes);
    const dist = Number(entry.distance);
    const env = entry.environment;
    const entryEffort = entry.effort;
    const parts = [];
    if (Number.isFinite(mins) && mins > 0) parts.push(`${mins} min`);
    if (Number.isFinite(dist) && dist > 0) parts.push(`${dist} ${getDistanceUnitLabel(entry)}`);
    if (env) parts.push(getRunningEnvironmentLabel(env));
    if (entryEffort) parts.push(entryEffort);
    return parts.join(' · ');
  };

  const buildSwimSummary = (entry) => {
    if (!entry) return null;
    const mins = Number(entry.durationMin ?? entry.minutes);
    const dist = Number(entry.distance);
    const pool = entry.poolType;
    const unitLabel = entry.distanceUnit || getPoolUnitLabel(pool);
    const entryStroke = entry.stroke;
    const entryEffort = entry.effort;
    const parts = [];
    if (Number.isFinite(mins) && mins > 0) parts.push(`${mins} min`);
    if (Number.isFinite(dist) && dist > 0) parts.push(`${dist} ${unitLabel}`);
    if (pool) parts.push(getPoolTypeLabel(pool));
    if (entryStroke) parts.push(entryStroke);
    if (entryEffort) parts.push(entryEffort);
    return parts.join(' · ');
  };

  const lastRunningEntry = useMemo(() => {
    if (!isRunning) return null;
    const sessions = Array.isArray(history) ? history : [];
    for (let i = sessions.length - 1; i >= 0; i -= 1) {
      const entriesList = sessions[i]?.entries || [];
      for (let j = entriesList.length - 1; j >= 0; j -= 1) {
        const entry = entriesList[j];
        if (entry?.kind === 'cardio') return entry;
      }
    }
    return null;
  }, [history, isRunning]);

  const lastSwimEntry = useMemo(() => {
    if (!isSwimming) return null;
    const sessions = Array.isArray(history) ? history : [];
    for (let i = sessions.length - 1; i >= 0; i -= 1) {
      const entriesList = sessions[i]?.entries || [];
      for (let j = entriesList.length - 1; j >= 0; j -= 1) {
        const entry = entriesList[j];
        if (entry?.kind === 'cardio') return entry;
      }
    }
    return null;
  }, [history, isSwimming]);

  const lastRunningSummary = isRunning ? buildRunningSummary(lastRunningEntry) : null;
  const lastSwimSummary = isSwimming ? buildSwimSummary(lastSwimEntry) : null;

  const smartSuggestionsEnabled = settings?.smartSuggestionsEnabled !== false;
  const lastRunningDuration = Number(lastRunningEntry?.durationMin ?? lastRunningEntry?.minutes);
  const lastRunningDistance = Number(lastRunningEntry?.distance);
  const canSuggestRunning = smartSuggestionsEnabled
    && isRunning
    && Number.isFinite(lastRunningDuration)
    && lastRunningDuration > 0
    && Number.isFinite(lastRunningDistance)
    && lastRunningDistance > 0;
  const suggestedDuration = canSuggestRunning ? Math.round(lastRunningDuration + 2) : null;
  const suggestedDistance = canSuggestRunning ? Number((lastRunningDistance * 1.05).toFixed(2)) : null;

  const removeEntry = (entryId) => {
    const nextEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(nextEntries);
    onUpdateSessionLogs?.(id, nextEntries);
  };

  const durationValue = Number(durationMin);
  const distanceValue = Number(distance);
  const hasDuration = Number.isFinite(durationValue) && durationValue > 0;
  const hasRunningDistance = Number.isFinite(distanceValue) && distanceValue > 0;
  const canSaveRunning = hasDuration && hasRunningDistance;

  const lapsValue = Number(laps);
  const hasLaps = Number.isFinite(lapsValue) && lapsValue > 0;
  const swimDistanceValue = (() => {
    if (swimMode === 'laps' && hasLaps && poolLength) return lapsValue * poolLength;
    if (swimMode === 'distance' && Number.isFinite(distanceValue) && distanceValue > 0) return distanceValue;
    return null;
  })();
  const swimDistanceRequired = swimMode === 'laps' || swimMode === 'distance';
  const hasSwimDistance = !swimDistanceRequired || (Number.isFinite(swimDistanceValue) && swimDistanceValue > 0);
  const canSaveSwim = hasDuration && hasSwimDistance;

  const runningPace = canSaveRunning ? formatPace(durationValue / distanceValue) : null;
  const runningSpeed = canSaveRunning ? (distanceValue / (durationValue / 60)) : null;
  const swimPace = hasDuration && Number.isFinite(swimDistanceValue) && swimDistanceValue > 0
    ? formatPace((durationValue * 100) / swimDistanceValue)
    : null;

  const resetForm = () => {
    setDurationMin('');
    setDistance('');
    setDistanceUnit('mi');
    setEnvironment('road');
    setIncline('');
    setEffort('moderate');
    setSwimMode('laps');
    setPoolType('25yd');
    setLaps('');
    setStroke('');
    setNotes('');
    setShowMoreDetails(false);
  };

  const handleAddRunningEntry = () => {
    if (!canSaveRunning) return;
    const mins = Number(durationMin);
    const dist = Number(distance);
    const pacePerUnit = mins / dist;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateISO: toDayKey(new Date()),
      ts: Date.now(),
      kind: 'cardio',
      mode: 'running',
      durationMin: mins,
      distance: dist,
      distanceUnit,
      environment,
      incline: environment === 'treadmill' && incline ? Number(incline) : null,
      swimMode: null,
      poolType: null,
      laps: null,
      stroke: null,
      effort: effort || null,
      pacePerUnit: Number.isFinite(pacePerUnit) ? pacePerUnit : null,
      pacePer100: null,
      notes: notes ? notes.trim() : null
    };
    const nextEntries = [...entries, entry];
    setEntries(nextEntries);
    onUpdateSessionLogs?.(id, nextEntries);
    setShowForm(false);
    resetForm();
  };

  const handleAddSwimEntry = () => {
    if (!canSaveSwim) return;
    const mins = Number(durationMin);
    const computedDistance = Number.isFinite(swimDistanceValue) ? swimDistanceValue : null;
    const pacePer100 = computedDistance ? (mins * 100) / computedDistance : null;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dateISO: toDayKey(new Date()),
      ts: Date.now(),
      kind: 'cardio',
      mode: 'swim',
      durationMin: mins,
      distance: computedDistance,
      distanceUnit: computedDistance ? poolUnitLabel : null,
      environment: null,
      incline: null,
      swimMode,
      poolType: poolType || null,
      laps: swimMode === 'laps' && hasLaps ? lapsValue : null,
      stroke: stroke || null,
      effort: effort || null,
      pacePerUnit: null,
      pacePer100: Number.isFinite(pacePer100) ? pacePer100 : null,
      notes: notes ? notes.trim() : null
    };
    const nextEntries = [...entries, entry];
    setEntries(nextEntries);
    onUpdateSessionLogs?.(id, nextEntries);
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full bg-gray-50 text-gray-500">
            <Icon name="ChevronLeft" className="w-5 h-5"/>
          </button>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cardio</div>
            <div className="text-lg font-black text-gray-900">{eq.name}</div>
            {isRunning && lastRunningSummary && (
              <div className="text-[11px] text-gray-500">Last: {lastRunningSummary}</div>
            )}
            {isSwimming && lastSwimSummary && (
              <div className="text-[11px] text-gray-500">Last: {lastSwimSummary}</div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-gray-50 text-gray-500">
          <Icon name="X" className="w-5 h-5"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">{isRunning ? 'Running / Walking' : 'Swimming'}</div>
              <div className="text-sm text-gray-500">Log today's entry</div>
            </div>
            <button
              onClick={() => setShowForm(prev => !prev)}
              className="px-4 py-2 rounded-xl font-bold workout-accent-solid shadow-sm active:scale-[0.98]"
            >
              + Entry
            </button>
          </div>
          {showForm && (
            <div className="space-y-3 pt-2">
              {isRunning && (
                <>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Environment</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['treadmill', 'indoor_track', 'outdoor_track', 'road', 'trail', 'other'].map(option => (
                        <button
                          key={option}
                          onClick={() => setEnvironment(option)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border ${environment === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                        >
                          {option.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Duration (min)</div>
                    <input
                      ref={durationRef}
                      type="number"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full text-lg font-bold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                    />
                    {canSuggestRunning && lastRunningSummary && (
                      <div className="text-[11px] text-gray-500 mt-1">Last: {lastRunningSummary}</div>
                    )}
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Distance</div>
                      <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 1.50"
                        className="w-full text-base font-semibold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Unit</div>
                      <select
                        value={distanceUnit}
                        onChange={(e) => setDistanceUnit(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 font-semibold"
                      >
                        <option value="mi">mi</option>
                        <option value="km">km</option>
                      </select>
                    </div>
                  </div>
                  {(runningPace || runningSpeed) && (
                    <div className="text-xs text-gray-500">
                      {runningPace && runningSpeed && `Pace: ${runningPace} / ${distanceUnit} · Avg speed: ${runningSpeed.toFixed(1)} ${distanceUnit}/h`}
                      {runningPace && !runningSpeed && `Pace: ${runningPace} / ${distanceUnit}`}
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => setShowMoreDetails(prev => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                    >
                      <span>More details</span>
                      <Icon name="ChevronDown" className={`w-4 h-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {showMoreDetails && (
                    <div className="space-y-3 animate-expand">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Effort</div>
                        <div className="flex gap-2">
                          {['easy', 'moderate', 'hard'].map(option => (
                            <button
                              key={option}
                              onClick={() => setEffort(option)}
                              className={`px-3 py-2 rounded-full text-xs font-bold border ${effort === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      {environment === 'treadmill' && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Incline (%)</div>
                          <input
                            type="number"
                            value={incline}
                            onChange={(e) => setIncline(e.target.value)}
                            placeholder="e.g. 2.0"
                            className="w-full text-base font-semibold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="How did it feel?"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900 min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddRunningEntry}
                      disabled={!canSaveRunning}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.98] ${
                        canSaveRunning ? 'workout-accent-solid shadow-lg' : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Save Entry
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-3 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
              {isSwimming && (
                <>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Swim mode</div>
                    <div className="flex gap-2">
                      {['laps', 'distance', 'time_only'].map(option => (
                        <button
                          key={option}
                          onClick={() => setSwimMode(option)}
                          className={`px-3 py-2 rounded-full text-xs font-bold border ${swimMode === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                        >
                          {option.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Pool type</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['25yd', '25m', '50m', 'open_water'].map(option => (
                        <button
                          key={option}
                          onClick={() => setPoolType(option)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border ${poolType === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                        >
                          {option.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Duration (min)</div>
                    <input
                      ref={durationRef}
                      type="number"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full text-lg font-bold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                    />
                  </div>
                  {swimMode === 'laps' && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Laps</div>
                      <input
                        type="number"
                        value={laps}
                        onChange={(e) => setLaps(e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full text-base font-semibold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                      />
                    </div>
                  )}
                  {swimMode === 'distance' && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-2">Distance ({poolUnitLabel})</div>
                      <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 800"
                        className="w-full text-base font-semibold text-center p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Stroke</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['freestyle', 'breaststroke', 'backstroke', 'mixed'].map(option => (
                        <button
                          key={option}
                          onClick={() => setStroke(option)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border ${stroke === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  {swimPace && (
                    <div className="text-xs text-gray-500">Pace: {swimPace} per 100 {poolUnitLabel}</div>
                  )}
                  <div>
                    <button
                      onClick={() => setShowMoreDetails(prev => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                    >
                      <span>More details</span>
                      <Icon name="ChevronDown" className={`w-4 h-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {showMoreDetails && (
                    <div className="space-y-3 animate-expand">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Effort</div>
                        <div className="flex gap-2">
                          {['easy', 'moderate', 'hard'].map(option => (
                            <button
                              key={option}
                              onClick={() => setEffort(option)}
                              className={`px-3 py-2 rounded-full text-xs font-bold border ${effort === option ? 'workout-accent-solid border-transparent' : 'border-gray-200 text-gray-600'}`}
                            >
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Notes</div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="How did it feel?"
                          className="w-full p-3 border-2 border-gray-200 rounded-xl workout-accent-focus outline-none bg-white text-gray-900 min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddSwimEntry}
                      disabled={!canSaveSwim}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all active:scale-[0.98] ${
                        canSaveSwim ? 'workout-accent-solid shadow-lg' : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Save Entry
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-3 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black uppercase text-gray-500">Today's entries</div>
            <div className="text-[11px] workout-accent-text font-semibold">{entries.length} entries</div>
          </div>
          {entries.length === 0 ? (
            <div className="text-sm text-gray-500">No cardio entries yet.</div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, idx) => (
                <div key={entry.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-gray-900">Entry {idx + 1}</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {isRunning ? buildRunningSummary(entry) : buildSwimSummary(entry)}
                    </div>
                    {entry.notes && <div className="text-[11px] text-gray-500">{entry.notes}</div>}
                  </div>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600 active:scale-95"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// ========== MAIN APP ==========
