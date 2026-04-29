    const ProfileView = ({ settings, setSettings, colorfulExerciseCards, onToggleColorfulExerciseCards, onViewAnalytics, onViewPatterns, onViewMuscleMap, onExportData, onImportData, onResetApp, onResetOnboarding, onBack }) => {
      const [workoutOpen, setWorkoutOpen] = useState(false);
      const [appearanceOpen, setAppearanceOpen] = useState(false);
      const [analyticsOpen, setAnalyticsOpen] = useState(false);
      const [learnOpen, setLearnOpen] = useState(false);
      const [aboutOpen, setAboutOpen] = useState(false);
      const [dataToolsOpen, setDataToolsOpen] = useState(false);
      const [devTapCount, setDevTapCount] = useState(0);
      const devTapRef = useRef(null);

      const handleDevTap = () => {
        const next = devTapCount + 1;
        setDevTapCount(next);
        if (devTapRef.current) clearTimeout(devTapRef.current);
        devTapRef.current = setTimeout(() => setDevTapCount(0), 1500);
      };

      const learnItems = [
        {
          title: 'How to add weight',
          body: 'Add 5 lbs to upper body lifts and 10 lbs to lower body lifts when a weight feels easy for 3 sets. Small jumps add up fast.'
        },
        {
          title: 'Reps vs. weight — what matters more?',
          body: 'Both. A good rule: if you can do more than 12 reps easily, increase the weight. If you can\'t finish 6, lower it. Stay in the 6–12 range for most strength work.'
        },
        {
          title: 'Rest between sets',
          body: 'For strength (heavy weight, low reps): rest 2–3 minutes. For hypertrophy (moderate weight, 8–12 reps): rest 60–90 seconds. Shorter rest = more cardio effect.'
        },
        {
          title: 'Push / Pull / Legs',
          body: 'Planet Strength rotates Push, Pull, and Legs automatically. Push = chest, shoulders, triceps. Pull = back, biceps. Legs = quads, hamstrings, glutes. This split gives each muscle group 48 hours of recovery.'
        },
        {
          title: 'What is progressive overload?',
          body: 'It\'s the only thing that makes you stronger. Add a little more weight or one more rep each week. Your body adapts to stress — if the stress never increases, neither do you.'
        },
        {
          title: 'How many sets should I do?',
          body: '3 working sets per exercise is the sweet spot for most people. One warm-up set at a lower weight, then 3 sets at your working weight. More isn\'t always better — recovery matters.'
        },
        {
          title: 'Compound vs. isolation exercises',
          body: 'Compound moves (squat, bench, deadlift, row) work multiple muscle groups and give you the most return for your time. Isolations (curls, extensions) are finishing work. Lead with compounds.'
        },
        {
          title: 'Why Planet Fitness works for strength',
          body: 'Despite the reputation, Planet Fitness has everything you need: dumbbells up to 75–80 lbs, machines for every muscle group, and cables. You can build serious strength here if you log your work and stay consistent.'
        },
        {
          title: 'Logging your sets',
          body: 'Tap an exercise to open the logging panel. Enter weight and reps, then tap the checkmark. Your best set is tracked automatically and used to calculate your Strength Score.'
        },
        {
          title: 'What is my Strength Score?',
          body: 'Your Strength Score is a 0–100 number that reflects how much progress you\'ve made across all exercises you\'ve logged. It\'s you vs. you — not a comparison to anyone else.'
        },
        {
          title: 'Using Templates',
          body: 'Templates are pre-built Push, Pull, and Legs workouts. Tap Templates on the home screen to start one. The app will automatically queue up the right exercises for today\'s rotation.'
        },
        {
          title: 'The Locker',
          body: 'Store your locker combination and gym card screenshot in the Locker widget on the home screen. Your combo is hidden behind a hold-to-peek gesture. Your gym card opens full-screen for scanning at the front desk.'
        },
        {
          title: 'Rest days',
          body: 'Tap the moon icon in the top right to log a rest day. Rest is not a failure — it\'s when your muscles actually grow. The app tracks rest days in your streak so an intentional rest doesn\'t break your consistency.'
        },
        {
          title: 'Your data never leaves your phone',
          body: 'Everything is stored locally on your device. No account, no cloud sync, no server. Use the Export feature in Data Tools to back up your history as a JSON file you can restore anytime.'
        },
      ];

      return (
        <div className="flex flex-col h-full bg-gray-50">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="flex items-center gap-3 p-4 py-5">
              {onBack && (
                <button onClick={onBack} className="ps-back-btn" title="Back">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-black text-gray-900">Settings</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
            <Card className="space-y-3">
              <button
                onClick={() => setAppearanceOpen(prev => !prev)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Appearance</div>
                  <div className="text-sm text-gray-500">Theme and accent</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${appearanceOpen ? 'rotate-180' : ''}`} />
              </button>
              {appearanceOpen && (
                <div className="space-y-3 animate-expand">
                  <ToggleRow
                    icon="Sparkles"
                    title="Colorful exercise cards"
                    subtitle="Show muscle group colors on exercise cards"
                    enabled={colorfulExerciseCards}
                    onToggle={onToggleColorfulExerciseCards}
                  />
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <button onClick={() => setWorkoutOpen(prev => !prev)} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Workout logging preferences</div>
                  <div className="text-sm text-gray-500">Insights and default views</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${workoutOpen ? 'rotate-180' : ''}`} />
              </button>
              {workoutOpen && (
                <div className="space-y-3 animate-expand">
                  <ToggleRow
                    icon="TrendingUp"
                    title="Insights"
                    subtitle="Optional, based only on your history"
                    enabled={settings.insightsEnabled !== false}
                    onToggle={(next) => setSettings({ ...settings, insightsEnabled: next })}
                  />
                  <ToggleRow
                    icon="Sparkles"
                    title="Smart Suggestions"
                    subtitle="Offer a quick nudge for running logs"
                    enabled={settings.smartSuggestionsEnabled !== false}
                    onToggle={(next) => setSettings({ ...settings, smartSuggestionsEnabled: next })}
                  />
                  <ToggleRow
                    icon="List"
                    title="Show All Exercises"
                    subtitle="Start with the full library open"
                    enabled={settings.showAllExercises}
                    onToggle={(next) => setSettings({ ...settings, showAllExercises: next })}
                  />
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <button onClick={() => setAnalyticsOpen(prev => !prev)} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Analytics</div>
                  <div className="text-sm text-gray-500">Progress view</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${analyticsOpen ? 'rotate-180' : ''}`} />
              </button>
              {analyticsOpen && (
                <div className="space-y-3 animate-expand">
                  <button
                    onClick={onViewAnalytics}
                    className="settings-action-button"
                  >
                    Progress view
                  </button>
                  <button
                    onClick={onViewMuscleMap}
                    className="settings-action-button"
                  >
                    Muscle map
                  </button>
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <button
                onClick={() => setLearnOpen(prev => !prev)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Learn</div>
                  <div className="text-sm text-gray-500">Quick hits</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${learnOpen ? 'rotate-180' : ''}`} />
              </button>
              {learnOpen && (
                <div className="space-y-2 animate-expand">
                  {learnItems.map(item => (
                    <details key={item.title} className="border border-gray-200 rounded-xl p-3 bg-white">
                      <summary className="text-sm font-bold text-gray-900 cursor-pointer">{item.title}</summary>
                      <p className="text-sm text-gray-600 mt-2">{item.body}</p>
                    </details>
                  ))}
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <button onClick={() => setAboutOpen(prev => !prev)} className="w-full flex items-center justify-between text-left">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">About</div>
                  <div className="text-sm text-gray-500">What this app is for</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="space-y-3 animate-expand">
                  <div className="text-sm text-gray-600">No logins. No noise. No participation trophies. Just logs of every pound you've moved. Built by Nobody Studios, San Antonio TX.</div>
                  <div
                    className="text-xs text-gray-400 font-mono cursor-default select-none"
                    onClick={handleDevTap}
                    title=""
                  >
                    Version {APP_VERSION}{devTapCount > 0 && devTapCount < 5 ? ` · ${devTapCount}/5` : ''}
                    {' '}— Your data stays on your device. Always.
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <a href={`mailto:${FEEDBACK_EMAIL}?subject=Planet Strength Feedback (v${APP_VERSION})`} target="_blank" rel="noopener noreferrer" className="w-full p-3 rounded-xl border border-gray-200 text-left font-semibold text-sm bg-white">
                      🐛 Report a bug or send feedback
                    </a>
                    <a href={`mailto:${FEEDBACK_EMAIL}?subject=Planet Strength — Need Help`} target="_blank" rel="noopener noreferrer" className="w-full p-3 rounded-xl border border-gray-200 text-left font-semibold text-sm bg-white">
                      💬 Get help — we actually reply
                    </a>
                    <a href={FOLLOW_URL} target="_blank" rel="noopener noreferrer" className="w-full p-3 rounded-xl border border-gray-200 text-left font-semibold text-sm bg-white">
                      📡 Follow Nobody Studios for updates
                    </a>
                    <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="w-full p-3 rounded-xl border border-gray-200 text-left font-semibold text-sm bg-white">
                      ⚡ Support the app (optional, no pressure)
                    </a>
                  </div>
                </div>
              )}
            </Card>

            <Card className="space-y-3">
              <button
                onClick={() => setDataToolsOpen(prev => !prev)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">Data tools</div>
                  <div className="text-sm text-gray-500">Export, import, and reset</div>
                </div>
                <Icon name="ChevronDown" className={`w-4 h-4 text-gray-400 transition-transform ${dataToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {dataToolsOpen && (
                <div className="grid grid-cols-1 gap-2 animate-expand">
                  <button
                    onClick={onExportData}
                    className="w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold active:scale-[0.98]"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={onImportData}
                    className="w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold active:scale-[0.98]"
                  >
                    Import Data
                  </button>
                  <button
                    onClick={onResetApp}
                    className="w-full py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold active:scale-[0.98]"
                  >
                    Reset App
                  </button>
                  <button
                    onClick={onResetOnboarding}
                    className="w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold active:scale-[0.98]"
                  >
                    Reset onboarding
                  </button>
                </div>
              )}
            </Card>

          </div>
        </div>
      );
    };

    const MuscleMapScreen = ({ history, onClose }) => {
      const [rangeDays, setRangeDays] = useState(30);

      // Adjust time ranges or add muscle groups by editing these lists.
      const rangeOptions = [
        { label: '7D', days: 7 },
        { label: '30D', days: 30 },
        { label: '90D', days: 90 }
      ];

      const muscleGroups = [
        { key: 'chest', label: 'Chest', tint: 'var(--tint-chest)' },
        { key: 'back', label: 'Back', tint: 'var(--tint-back)' },
        { key: 'legs', label: 'Legs', tint: 'var(--tint-legs)' },
        { key: 'core', label: 'Core', tint: 'var(--tint-core)' },
        { key: 'arms', label: 'Arms', tint: 'var(--tint-arms)' },
        { key: 'shoulders', label: 'Shoulders', tint: 'var(--tint-shoulders)' }
      ];

      const muscleCounts = useMemo(() => buildMuscleDistribution(history, rangeDays), [history, rangeDays]);
      const totalCount = muscleGroups.reduce((sum, group) => sum + (muscleCounts[group.key] || 0), 0);
      const topGroup = muscleGroups.reduce((best, group) => {
        if (!best) return group;
        return (muscleCounts[group.key] || 0) > (muscleCounts[best.key] || 0) ? group : best;
      }, null);

      const gradient = useMemo(() => {
        if (!totalCount) return '';
        let start = 0;
        const segments = muscleGroups.reduce((acc, group) => {
          const count = muscleCounts[group.key] || 0;
          if (count <= 0) return acc;
          const degrees = (count / totalCount) * 360;
          acc.push(`${group.tint} ${start}deg ${start + degrees}deg`);
          start += degrees;
          return acc;
        }, []);
        return `conic-gradient(${segments.join(', ')})`;
      }, [muscleCounts, muscleGroups, totalCount]);

      return (
        <div className="muscle-map-screen flex flex-col h-full bg-gray-50">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="p-4 flex items-center gap-3">
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100">
                <Icon name="ChevronLeft" className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Profile</div>
                <div className="text-lg font-black text-gray-900">Muscle Map</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
            <div className="muscle-map-header">
              <div className="text-xl font-black text-gray-900">Muscle Map</div>
              <div className="text-sm text-gray-500">This chart shows which muscle groups you've focused on over the selected time range.</div>
            </div>

            <div className="muscle-map-range-toggle">
              {rangeOptions.map(option => (
                <button
                  key={option.days}
                  onClick={() => setRangeDays(option.days)}
                  className={`muscle-map-toggle ${rangeDays === option.days ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {totalCount === 0 ? (
              <div className="muscle-map-empty">
                <div className="muscle-map-empty-title">Nothing to show yet.</div>
                <div className="muscle-map-empty-body">As you log workouts, this chart will highlight where you've been focusing. No streaks, no pressure.</div>
              </div>
            ) : (
              <>
                <div className="muscle-pie-wrapper">
                  <div className="muscle-pie" style={{ background: gradient }}>
                    <div className="muscle-pie-inner">
                      <div className="muscle-pie-label">
                        <div className="muscle-pie-title">{topGroup?.label || 'Focus'}</div>
                        <div className="muscle-pie-subline">Most sessions in the last {rangeDays} days</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="muscle-legend">
                  {muscleGroups.map(group => {
                    const count = muscleCounts[group.key] || 0;
                    const percent = totalCount ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div key={group.key} className="muscle-legend-item">
                        <span className="muscle-legend-dot" style={{ background: group.tint }}></span>
                        <span className="muscle-legend-label">{group.label}</span>
                        <span className="muscle-legend-value">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      );
    };

    const PatternsScreen = ({ history, cardioHistory, onClose }) => {
      const patterns = useMemo(() => buildPatternsFromHistory(history, cardioHistory), [history, cardioHistory]);

      return (
        <div className="patterns-screen flex flex-col h-full bg-gray-50">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="p-4 flex items-center gap-3">
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100">
                <Icon name="ChevronLeft" className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Profile</div>
                <div className="text-lg font-black text-gray-900">Patterns</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
            <div className="patterns-coming-soon">
              <div className="patterns-coming-title">Patterns (Coming Soon)</div>
              <div className="patterns-coming-body">
                This feature is in progress. Soon you'll see gentle, no-guilt notes about your training style—like time-of-day tendencies and muscle-group balance.
              </div>
            </div>
            <div className="pattern-intro bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Gentle insights from your recent training.</div>
              <div className="text-xs text-gray-500">These update as you keep logging sessions.</div>
            </div>

            {patterns.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-600">
                <div className="text-3xl mb-2">🌱</div>
                <div className="text-sm font-semibold text-gray-900 mb-2">No patterns yet</div>
                <div className="text-sm text-gray-500">As you log more sessions, we'll highlight your training patterns here.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {patterns.map((pattern, idx) => (
                  <div key={`${pattern.title}-${idx}`} className="pattern-card">
                    <div className="pattern-icon">{pattern.icon || '✨'}</div>
                    <div className="flex-1">
                      <div className="pattern-title">{pattern.title}</div>
                      {pattern.subtext && <div className="pattern-subtext">{pattern.subtext}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

// ========== CARDIO LOGGER ==========
