    const Progress = ({
      profile,
      history,
      strengthScoreObj,
      cardioHistory,
      initialAnalyticsTab = 'overview'
    }) => {
      const [selectedEquipment, setSelectedEquipment] = useState(null);
      const [analyticsTab, setAnalyticsTab] = useState(initialAnalyticsTab);
      const [exerciseHistoryQuery, setExerciseHistoryQuery] = useState('');
      const [exerciseHistoryExpanded, setExerciseHistoryExpanded] = useState(null);
      useEffect(() => {
        if (initialAnalyticsTab && initialAnalyticsTab !== analyticsTab) {
          setAnalyticsTab(initialAnalyticsTab);
          setSelectedEquipment(null);
        }
      }, [initialAnalyticsTab]);

      const allEquipment = Object.keys(EQUIPMENT_DB).filter(id => EQUIPMENT_DB[id]?.type !== 'cardio');
      const combinedSessions = useMemo(() => {
        const sessions = [];
        const seen = new Set();
        Object.entries(history || {}).forEach(([equipId, arr]) => {
          safeArray(arr).forEach(s => {
            if (!s || typeof s !== 'object') return;
            const cardioType = s.type === 'cardio' ? (s.cardioType || equipId.replace('cardio_', '')) : null;
            const cardioLabel = s.type === 'cardio' ? (s.cardioLabel || EQUIPMENT_DB[equipId]?.name || 'Cardio') : null;
            const id = s.type === 'cardio'
              ? `${s.date}-${cardioType}-cardio`
              : `${s.date}-${equipId}-strength`;
            if (seen.has(id)) return;
            seen.add(id);
            sessions.push({ ...s, equipId, cardioType: cardioType || s.cardioType, cardioLabel, type: s.type || 'strength' });
          });
        });
        Object.entries(cardioHistory || {}).forEach(([cardioType, arr]) => {
          safeArray(arr).forEach(s => {
            if (!s || typeof s !== 'object') return;
            const id = `${s.date}-${s.cardioType || cardioType}-cardio`;
            if (seen.has(id)) return;
            seen.add(id);
            sessions.push({ ...s, cardioType: s.cardioType || cardioType, type: 'cardio' });
          });
        });
        return sessions;
      }, [history, cardioHistory]);

      const equipmentWithHistory = allEquipment.filter(id => safeArray(history[id]).length > 0).length;

      const MiniChart = ({ equipId }) => {
        const sessions = safeArray(history[equipId]);
        if (sessions.length < 2) return <p className="text-sm text-gray-400 text-center py-8">Log at least 2 sessions to chart progress</p>;

        const dataPoints = sessions.map(s => {
          let maxWeight = 0;
          safeArray(s.sets).forEach(set => { if (set.weight > maxWeight) maxWeight = set.weight; });
          return { date: new Date(s.date), weight: maxWeight };
        }).filter(d => d.weight > 0).slice(-10);

        if (dataPoints.length < 2) return <p className="text-sm text-gray-400 text-center py-8">Need more data points</p>;

        const weights = dataPoints.map(d => d.weight);
        const minW = Math.min(...weights) - 10;
        const maxW = Math.max(...weights) + 10;
        const range = (maxW - minW) || 1;

        const width = 280, height = 120, padding = 20;
        const points = dataPoints.map((d, i) => {
          const x = padding + (i / (dataPoints.length - 1)) * (width - padding * 2);
          const y = height - padding - ((d.weight - minW) / range) * (height - padding * 2);
          return { x, y };
        });
        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        return (
          <div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-hover)" />
                </linearGradient>
              </defs>
              <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="var(--accent)" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500 font-semibold">
              <span>Recent trend</span>
              <span>Last {dataPoints.length} sessions</span>
            </div>
          </div>
        );
      };

      const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'history', label: 'History' },
        { id: 'exercise', label: 'Exercises' },
      ];

      return (
        <div className="flex flex-col h-full bg-gray-50 analytics-shell">
          <div className="progress-header sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="px-4 pt-4 pb-1">
              <h1 className="text-2xl font-black text-gray-900">Progress</h1>
            </div>
            <div className="progress-tab-bar px-4 pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setSelectedEquipment(null); setAnalyticsTab(tab.id); }}
                  className={`progress-tab-pill ${analyticsTab === tab.id ? 'progress-tab-active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
            {analyticsTab === 'history' ? (
              (() => {
                try {
                  const byDay = {};
                  combinedSessions.forEach(s => {
                    const day = (s.date || '').slice(0, 10);
                    if (!day) return;
                    if (!byDay[day]) byDay[day] = [];
                    byDay[day].push(s);
                  });
                  const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));
                  if (days.length === 0) {
                    return (
                      <div className="progress-empty-state">
                        <div className="progress-empty-icon">📋</div>
                        <div className="progress-empty-title">No workouts yet</div>
                        <div className="progress-empty-text">Log a few sessions and your history will appear here.</div>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {days.map(day => {
                        const dayDate = new Date(day + 'T12:00:00');
                        const dayLabel = dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                          <div key={day}>
                            <div className="progress-day-header">{dayLabel}</div>
                            <div className="space-y-2">
                              {byDay[day].map((session, idx) => {
                                const isCardio = session.type === 'cardio';
                                const eq = EQUIPMENT_DB[session.equipId];
                                const name = isCardio ? (session.cardioLabel || eq?.name || 'Cardio') : (eq?.name || 'Unknown');
                                const categoryClass = isCardio ? '' : resolveCategoryClass(eq?.target || '');
                                const muscleGroup = isCardio ? 'Cardio' : (eq?.target ? resolveMuscleGroup(eq.target) : null);
                                const detail = isCardio
                                  ? (session.duration ? `${session.duration} min` : `${safeArray(session.entries).length} entries`)
                                  : `${safeArray(session.sets).length} sets`;
                                return (
                                  <div key={idx} className={`progress-history-row ${categoryClass}`}>
                                    <div className="progress-history-name">{name}</div>
                                    <div className="progress-history-meta">
                                      {muscleGroup && <span className="progress-muscle-badge">{muscleGroup}</span>}
                                      <span className="progress-history-detail">{detail}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } catch(e) {
                  return <div className="text-sm text-gray-500 text-center py-4">Unable to load history. Try reloading.</div>;
                }
              })()
            ) : analyticsTab === 'exercise' ? (
              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Exercise History</div>
                  <Icon name="Search" className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  value={exerciseHistoryQuery}
                  onChange={(e) => setExerciseHistoryQuery(e.target.value)}
                  placeholder="Search exercises"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold"
                />
                {(() => {
                  const withHistory = allEquipment.filter(id => safeArray(history[id]).length > 0);
                  const filtered = withHistory.filter(id => (EQUIPMENT_DB[id]?.name || '').toLowerCase().includes(exerciseHistoryQuery.toLowerCase()));
                  if (filtered.length === 0) {
                    return (
                      <div className="progress-empty-state py-6">
                        <div className="progress-empty-title">No exercises match yet.</div>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1">
                      {filtered.map(id => {
                        const eq = EQUIPMENT_DB[id];
                        const allSessions = safeArray(history[id]);
                        const recentSessions = allSessions.slice(-6).reverse();
                        const isExpanded = exerciseHistoryExpanded === id;
                        const categoryClass = resolveCategoryClass(eq?.target || '');

                        let prWeight = 0, prReps = 0;
                        allSessions.forEach(s => {
                          safeArray(s.sets).forEach(set => {
                            if ((set.weight || 0) > prWeight) {
                              prWeight = set.weight;
                              prReps = set.reps;
                            }
                          });
                        });

                        const lastSession = allSessions[allSessions.length - 1];
                        const lastDate = lastSession?.date
                          ? new Date(lastSession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : null;

                        return (
                          <div key={id} className={`progress-exhist-row ${categoryClass} ${isExpanded ? 'expanded' : ''}`}>
                            <button
                              onClick={() => setExerciseHistoryExpanded(isExpanded ? null : id)}
                              className="progress-exhist-toggle"
                            >
                              <div className={`progress-exhist-dot ${categoryClass}`}></div>
                              <div className="progress-exhist-info">
                                <div className="text-sm font-bold text-gray-900">{eq.name}</div>
                                <div className="text-[11px] text-gray-500">
                                  {allSessions.length} session{allSessions.length !== 1 ? 's' : ''}
                                  {lastDate ? ` · Last ${lastDate}` : ''}
                                </div>
                              </div>
                              {prWeight > 0 && (
                                <div className="progress-pr-badge">{prWeight}×{prReps}</div>
                              )}
                              <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </button>
                            {isExpanded && (
                              <div className="progress-exhist-detail">
                                {recentSessions.length === 0 ? (
                                  <div className="text-sm text-gray-400 text-center py-3">No sessions logged yet.</div>
                                ) : (
                                  <div className="progress-exhist-timeline">
                                    {recentSessions.map((session, idx) => {
                                      const sets = safeArray(session.sets);
                                      const summary = sets.map(s => `${s.reps}×${s.weight}`).join(', ');
                                      return (
                                        <div key={idx} className="progress-exhist-session">
                                          <div className="text-[11px] font-bold text-gray-900">
                                            {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                          </div>
                                          <div className="text-[10px] text-gray-500">{sets.length} sets</div>
                                          <div className="text-[11px] text-gray-700 mt-0.5">{summary || '—'}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                <div className="mt-3">
                                  <MiniChart equipId={id} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </Card>
            ) : !selectedEquipment ? (
              <>
                {/* Streak + This Week */}
                {(() => {
                  const streakObj = computeStreak(history, cardioHistory);
                  const today = new Date();
                  const last7 = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(today);
                    d.setDate(today.getDate() - (6 - i));
                    return d.toISOString().slice(0, 10);
                  });
                  const sessionDates = new Set(combinedSessions.map(s => (s.date || '').slice(0, 10)));
                  return (
                    <Card>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Current Streak</div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-5xl font-black text-gray-900 leading-none">{streakObj.current}</span>
                            <span className="text-base text-gray-500 font-semibold">days</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Best: <span className="font-bold text-purple-600">{streakObj.best}</span></div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">This Week</div>
                          <div className="progress-week-grid">
                            {last7.map((dayStr, i) => {
                              const hasSession = sessionDates.has(dayStr);
                              const d = new Date(dayStr + 'T12:00:00');
                              const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                              return (
                                <div key={i} className="progress-week-col">
                                  <div className={`progress-week-dot ${hasSession ? 'filled' : 'hollow'}`}></div>
                                  <div className="progress-week-label">{dayName}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })()}

                {/* Stats Grid */}
                {(() => {
                  let totalWeightMoved = 0;
                  let totalSessions = 0;
                  let totalSetsLogged = 0;
                  Object.values(history || {}).forEach(arr => {
                    safeArray(arr).forEach(session => {
                      if (session.type === 'cardio') return;
                      totalSessions++;
                      safeArray(session.sets).forEach(set => {
                        if (set.weight && set.reps) {
                          totalWeightMoved += (set.weight * set.reps);
                          totalSetsLogged++;
                        }
                      });
                    });
                  });
                  const formatWeight = (lbs) => {
                    if (lbs >= 1000000) return `${(lbs/1000000).toFixed(1)}M`;
                    if (lbs >= 1000) return `${(lbs/1000).toFixed(1)}K`;
                    return lbs.toLocaleString();
                  };
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      <Card className="p-3">
                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Weight</div>
                        <div className="text-2xl font-black text-purple-600">{formatWeight(totalWeightMoved)}</div>
                        <div className="text-[9px] text-gray-500">lbs moved</div>
                      </Card>
                      <Card className="p-3">
                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Sessions</div>
                        <div className="text-2xl font-black text-gray-900">{totalSessions}</div>
                        <div className="text-[9px] text-gray-500">total logged</div>
                      </Card>
                      <Card className="p-3">
                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Sets</div>
                        <div className="text-2xl font-black text-gray-900">{totalSetsLogged.toLocaleString()}</div>
                        <div className="text-[9px] text-gray-500">total sets</div>
                      </Card>
                    </div>
                  );
                })()}

                {/* Recent Sessions */}
                {(() => {
                  const recentSessions = [...combinedSessions]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10);
                  if (recentSessions.length === 0) return null;
                  return (
                    <Card>
                      <div className="space-y-1">
                        {recentSessions.map((session, idx) => {
                          const isCardio = session.type === 'cardio';
                          const eq = EQUIPMENT_DB[session.equipId];
                          const name = isCardio ? (session.cardioLabel || eq?.name || 'Cardio') : (eq?.name || 'Unknown');
                          const dateLabel = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          const detail = isCardio
                            ? (session.duration ? `${session.duration} min` : `${safeArray(session.entries).length} entries`)
                            : (() => {
                                const sets = safeArray(session.sets);
                                if (sets.length === 0) return '0 sets';
                                const topSet = sets.reduce((best, s) => ((s.weight || 0) > (best.weight || 0) ? s : best), sets[0]);
                                return `${sets.length} sets · ${topSet.weight}×${topSet.reps}`;
                              })();
                          return (
                            <div key={idx} className="progress-recent-row">
                              <div className="progress-recent-left">
                                <div className="text-sm font-bold text-gray-900">{name}</div>
                                <div className="text-[11px] text-gray-500">{dateLabel}</div>
                              </div>
                              <div className="progress-recent-detail">{detail}</div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })()}

                {/* Exercise Progress */}
                {equipmentWithHistory > 0 && (
                  <Card>
                    <h3 className="font-bold text-gray-900 mb-3">Exercise Progress</h3>
                    <div className="space-y-2">
                      {allEquipment.filter(id => safeArray(history[id]).length > 0).slice(0, 5).map(id => {
                        const eq = EQUIPMENT_DB[id];
                        const sessions = safeArray(history[id]);
                        const sessionCount = sessions.length;
                        const bar = Math.min(100, Math.max(8, sessionCount * 12));
                        const categoryClass = resolveCategoryClass(eq?.target || '');
                        return (
                          <div
                            key={id}
                            onClick={() => { setSelectedEquipment(id); setAnalyticsTab('overview'); }}
                            className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 cursor-pointer hover:border-purple-200 transition-all"
                          >
                            <div className={`progress-category-dot ${categoryClass}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-900 truncate">{eq.name}</div>
                              <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full progress-bar-fill ${categoryClass || 'progress-bar-default'}`} style={{ width: `${bar}%` }}></div>
                              </div>
                            </div>
                            <div className="text-[10px] text-gray-400 font-semibold flex-shrink-0">{sessionCount}×</div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <button onClick={() => { setSelectedEquipment(null); setAnalyticsTab('overview'); }} className="flex items-center gap-2 mb-4 text-purple-600 font-semibold text-sm">
                  <Icon name="ChevronLeft" className="w-4 h-4" />
                  Back to Overview
                </button>
                {(() => {
                  const eq = EQUIPMENT_DB[selectedEquipment];
                  const sessions = safeArray(history[selectedEquipment]);
                  if (sessions.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <h3 className="font-bold text-gray-900 mb-1">{eq.name}</h3>
                        <p className="text-sm text-gray-500">No sessions logged yet</p>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{eq.name}</h3>
                      <MiniChart equipId={selectedEquipment} />
                    </div>
                  );
                })()}
              </Card>
            )}
          </div>
        </div>
      );
    };

    // ========== PROFILE TAB ==========
