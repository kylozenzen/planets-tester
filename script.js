const { useState, useEffect, useMemo, useRef, useCallback } = React;

    // NOTE: APP_VERSION, FEEDBACK_EMAIL, FOLLOW_URL, DONATE_URL, and TIMING
    // are now loaded from data/constants.js

    const DEBUG_LOG = typeof localStorage !== 'undefined' && localStorage.getItem('ps_debug') === 'true';
    const debugLog = (tag, payload) => {
      if (DEBUG_LOG) {
        if (payload !== undefined) {
          console.log(`[ps-debug] ${tag}`, payload);
        } else {
          console.log(`[ps-debug] ${tag}`);
        }
      }
      // Forward custom events to Google Analytics (fires regardless of DEBUG_LOG)
      if (typeof gtag === 'function') {
        gtag('event', tag, payload || {});
      }
    };

    const SETTINGS_DEFAULTS = {
      insightsEnabled: true,
      smartSuggestionsEnabled: true,
      darkMode: false,
      darkAccent: 'purple',
      showAllExercises: false,
      pinnedExercises: [],
      workoutViewMode: 'all',
      suggestedWorkoutCollapsed: true,
      useDemoData: false,
      lockedInMode: false
    };

    // ========== PWA SETUP ==========
    // Static manifest/icons and service worker registration live in index.html and sw.js.

    // PWA Install Prompt Component
    const InstallPrompt = () => {
      const [show, setShow] = useState(false);
      const [prompt, setPrompt] = useState(null);
      const [showIosTip, setShowIosTip] = useState(false);

      useEffect(() => {
        const ua = navigator.userAgent || '';
        const isAndroid = /android/i.test(ua);
        const isIOS = /iphone|ipad|ipod/i.test(ua);
        const isSafari = /safari/i.test(ua) && !/crios|fxios|opios|edgios|chrome/i.test(ua);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        const handler = (e) => {
          if (!isAndroid) return;
          e.preventDefault();
          setPrompt(e);
          setShow(true);
        };
        window.addEventListener('beforeinstallprompt', handler);

        if (isIOS && isSafari && !isStandalone) {
          setShowIosTip(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
      }, []);

      const install = async () => {
        if (!prompt) return;
        prompt.prompt();
        await prompt.userChoice;
        setShow(false);
      };

      if (!show && !showIosTip) return null;

      return ReactDOM.createPortal(
        <>
          {show && (
            <div className="install-prompt">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📱</div>
                <div className="flex-1">
                  <div className="font-bold text-sm">Install on Android</div>
                  <div className="text-xs opacity-80">Add to home screen</div>
                </div>
                <button onClick={install} className="bg-white/20 px-4 py-2 rounded-lg font-bold text-sm">
                  Install
                </button>
                <button onClick={() => setShow(false)} className="text-white/60 text-xl px-2">×</button>
              </div>
            </div>
          )}
          {showIosTip && (
            <div className="ios-install-tip">
              <div className="text-xs font-semibold text-gray-600">Tip: Add Planet Strength to your Home Screen from Share.</div>
              <button onClick={() => setShowIosTip(false)} className="text-gray-400 text-lg px-2">×</button>
            </div>
          )}
        </>,
        document.getElementById('install-prompt')
      );
    };


    // ========== ERROR BOUNDARY ==========
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Planet Strength Error:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center space-y-4">
                <div className="text-4xl">😅</div>
                <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
                <p className="text-sm text-gray-600">
                  Don't worry, your workout data is safe. Try reloading the app.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Reload App
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }

        return this.props.children;
      }
    }

    // ========== ICONS ==========
    // Icon component is now loaded from components/Icon.jsx

    // ========== STORAGE ==========
    // storage helper is now loaded from hooks/storage.js

    const getDailyQuote = (pool, key) => {
      if (!pool.length) return null;
      const dayKey = toDayKey(new Date());
      const storageKey = `ps_quote_${key}_${dayKey}`;
      const storedIndex = storage.get(storageKey, null);
      if (storedIndex !== null && pool[storedIndex]) return pool[storedIndex];
      const idx = Math.floor(Math.random() * pool.length);
      storage.set(storageKey, idx);
      return pool[idx];
    };

    const getRandomQuote = (pool) => {
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const normalizeMuscleGroup = (raw) => {
      if (!raw) return 'other';
      const type = typeof raw === 'string' ? null : raw?.type;
      if (type === 'cardio') return 'cardio';
      const value = typeof raw === 'string'
        ? raw.toLowerCase()
        : `${raw?.target || raw?.muscles || raw?.muscleGroup || raw?.name || ''}`.toLowerCase();
      if (!value) return 'other';
      if (value.includes('full body') || value.includes('fullbody')) return 'fullbody';
      if (value.includes('chest') || value.includes('pec')) return 'chest';
      if (value.includes('back') || value.includes('lat') || value.includes('trap')) return 'back';
      if (value.includes('leg') || value.includes('quad') || value.includes('hamstring') || value.includes('glute') || value.includes('calf') || value.includes('thigh')) return 'legs';
      if (value.includes('shoulder') || value.includes('delt')) return 'shoulders';
      if (value.includes('bicep') || value.includes('tricep') || value.includes('arm') || value.includes('forearm') || value.includes('brach')) return 'arms';
      if (value.includes('core') || value.includes('ab') || value.includes('oblique')) return 'core';
      return 'other';
    };

    const resolveCategoryClass = (label = '') => {
      const normalizedCategory = normalizeMuscleGroup(label);
      if (!normalizedCategory) return '';
      if (['chest', 'back', 'legs', 'core', 'arms', 'shoulders'].includes(normalizedCategory)) {
        return `category-${normalizedCategory}`;
      }
      return '';
    };

    const resolveMuscleGroup = (raw) => {
      const normalized = normalizeMuscleGroup(raw);
      switch (normalized) {
        case 'chest':
          return 'Chest';
        case 'back':
          return 'Back';
        case 'legs':
          return 'Legs';
        case 'core':
          return 'Core';
        case 'arms':
          return 'Arms';
        case 'shoulders':
          return 'Shoulders';
        case 'cardio':
          return 'Cardio';
        case 'fullbody':
          return 'Full Body';
        default:
          return 'Other';
      }
    };
    const getTodaysWorkoutType = (history, appState) => {
      const order = ["Push","Pull","Legs"];
      const lastType = appState?.lastWorkoutType || null;
      const lastDayKey = appState?.lastWorkoutDayKey || null;
      const todayKey = toDayKey(new Date());

      if (lastDayKey === todayKey && lastType) return lastType;
      if (!lastType) return "Push";

      const idx = order.indexOf(lastType);
      return order[(idx + 1) % order.length] || "Push";
    };

const GeneratorOptions = ({ options, onUpdate, compact = false }) => {
  const goalOptions = [
    { id: 'strength', label: 'Strength' },
    { id: 'hypertrophy', label: 'Hypertrophy' },
    { id: 'quick', label: 'Quick' }
  ];
  const durationOptions = [30, 45, 60];
  const toggleOption = (key, value) => {
    onUpdate(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <div className={`space-y-2 ${compact ? 'text-xs' : ''}`}>
      <div className="text-[11px] font-bold text-gray-500 uppercase">Optional tweaks</div>
      <div className="flex flex-wrap gap-2">
        {goalOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleOption('goal', opt.id)}
            className={`filter-chip ${options.goal === opt.id ? 'active' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {durationOptions.map(value => (
          <button
            key={value}
            onClick={() => toggleOption('duration', value)}
            className={`filter-chip ${options.duration === value ? 'active' : ''}`}
          >
            {value} min
          </button>
        ))}
      </div>
    </div>
  );
};

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

const Card = ({ children, className = '', onClick, style }) => (
  <div onClick={onClick} style={style} className={`ps-card ${className}`}>
    {children}
  </div>
);

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

// EASTER EGG COMPONENTS → moved to components/easter-eggs.js

    // ========== HOME LOCKER WIDGET ==========

    const App = () => {
      const [loaded, setLoaded] = useState(false);

      const [profile, setProfile] = useState({
        username: '',
        avatar: '💪',
        workoutLocation: 'gym',
        gymType: 'commercial',
        barWeight: 45,
        onboarded: false
      });

      const [settings, setSettings] = useState({ ...SETTINGS_DEFAULTS });
      const [colorfulExerciseCards, setColorfulExerciseCards] = useState(() => {
        try {
          const raw = localStorage.getItem('ps_colorfulExerciseCards');
          return raw === null ? true : Boolean(JSON.parse(raw));
        } catch {
          return true;
        }
      });
      const [history, setHistory] = useState({});
      const [cardioHistory, setCardioHistory] = useState({});
      const [tab, setTab] = useState('home');
      const [activeEquipment, setActiveEquipment] = useState(null);
      const [activeCardio, setActiveCardio] = useState(null);
      const [pendingAutoFocusExercise, setPendingAutoFocusExercise] = useState(null);
      const [view, setView] = useState('onboarding');
      const [showAnalytics, setShowAnalytics] = useState(false);
      const [showPatterns, setShowPatterns] = useState(false);
      const [showMuscleMap, setShowMuscleMap] = useState(false);
      const [openTemplatesFromHome, setOpenTemplatesFromHome] = useState(false);
      const [homeRequestedAnalyticsTab, setHomeRequestedAnalyticsTab] = useState(null);
      const [showMatrix, setShowMatrix] = useState(false);
      const [showPowerUp, setShowPowerUp] = useState(false);
      const [showGlory, setShowGlory] = useState(false);
      const [showSpartan, setShowSpartan] = useState(false);
      const [showButDidYouDie, setShowButDidYouDie] = useState(false);
      const [showNice, setShowNice] = useState(false);
      const [showPerfectWeek, setShowPerfectWeek] = useState(false);
      const [activeSession, setActiveSession] = useState(null);
      const [inlineMessage, setInlineMessage] = useState(null);
      const messageTimerRef = useRef(null);
      const [toasts, setToasts] = useState([]);
      const [undoToast, setUndoToast] = useState(null);
      const undoTimerRef = useRef(null);
      const undoActionRef = useRef(null);
      const [sessionStartNotice, setSessionStartNotice] = useState(null);
      const sessionStartTimerRef = useRef(null);
      const [showPostWorkout, setShowPostWorkout] = useState(false);
      const [showPostWorkoutCelebration, setShowPostWorkoutCelebration] = useState(false);
      const [postWorkoutQuote, setPostWorkoutQuote] = useState(null);
      const postWorkoutTimerRef = useRef(null);
      const postWorkoutCelebrationRef = useRef(null);
      const rageTapRef = useRef(new Map());
      const quickLogSubmitRef = useRef({ key: '', at: 0 });

      const [appState, setAppState] = useState({
        lastWorkoutType: null,
        lastWorkoutDayKey: null,
        restDays: []
      });

      const [pinnedExercises, setPinnedExercises] = useState([]);
      const [starredExercises, setStarredExercises] = useState([]);
      const [recentExercises, setRecentExercises] = useState([]);
      const [exerciseUsageCounts, setExerciseUsageCounts] = useState({});
      const [dayEntries, setDayEntries] = useState({});
      const [lastExerciseStats, setLastExerciseStats] = useState({});
      const [draftPlan, setDraftPlan] = useState(null);
      const [dismissedDraftDate, setDismissedDraftDate] = useState(null);
      const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * motivationalQuotes.length));
      const [generatorOptions, setGeneratorOptions] = useState({ goal: '', duration: 45, equipment: '' });

      useEffect(() => {
        if (!DEBUG_LOG) return;
        const rageTapWindow = 2000;
        const rageTapThreshold = 5;
        const handleRageTap = (event) => {
          const target = event.target instanceof Element ? event.target : null;
          if (!target) return;
          const button = target.closest('button, [role="button"], a');
          if (!button) return;
          const identifier = button.getAttribute('aria-label')
            || button.getAttribute('data-debug-id')
            || button.id
            || button.textContent?.trim().slice(0, 80)
            || button.className
            || 'unknown';
          const now = Date.now();
          const record = rageTapRef.current.get(identifier) || { count: 0, start: now };
          if (now - record.start > rageTapWindow) {
            record.count = 0;
            record.start = now;
          }
          record.count += 1;
          rageTapRef.current.set(identifier, record);
          if (record.count >= rageTapThreshold) {
            debugLog('rage_tap', { target: identifier });
            rageTapRef.current.delete(identifier);
          }
        };
        document.addEventListener('click', handleRageTap, true);
        return () => document.removeEventListener('click', handleRageTap, true);
      }, []);

                  useEffect(() => {
        const savedOnboarding = storage.get(ONBOARDING_KEY, false);
        const savedProfileRaw = storage.get('ps_v2_profile', null);
        const settingsDefaults = { ...SETTINGS_DEFAULTS };
        const savedSettingsRaw = storage.get('ps_v2_settings', settingsDefaults);
        const savedSettings = { ...settingsDefaults, ...savedSettingsRaw, useDemoData: false }; // Always force real data
        const savedHistory = storage.get('ps_v2_history', {});
        const savedCardio = storage.get('ps_v2_cardio', {});
        const savedState = storage.get('ps_v2_state', { lastWorkoutType: null, lastWorkoutDayKey: null, restDays: [] });
        const savedRestDays = storage.get(REST_DAY_KEY, []);
        const savedDismiss = storage.get('ps_dismissed_draft_date', null);
        const savedTodaySession = storage.get(TODAY_SESSION_KEY, null);
        const savedTodayWorkout = storage.get(TODAY_WORKOUT_KEY, null);
        const savedActiveSession = storage.get(ACTIVE_SESSION_KEY, null);
        const savedDraftSession = storage.get(DRAFT_SESSION_KEY, null);
        let savedStarred = [];
        try {
          const raw = localStorage.getItem('ps_starredExercises');
          savedStarred = raw ? JSON.parse(raw) : [];
        } catch {
          savedStarred = [];
        }
        const normalizedActiveSession = normalizeActiveSession(
          savedTodaySession || savedTodayWorkout || savedActiveSession || savedDraftSession
        );
        const currentDayKey = toDayKey(new Date());
        const mergedRestDays = Array.from(new Set([...(savedState?.restDays || []), ...(savedRestDays || [])]));
        
        const migratedProfile = {
          username: '',
          avatar: '💪',
          workoutLocation: 'gym',
          gymType: 'commercial',
          barWeight: 45,
          onboarded: false,
          ...(savedProfileRaw || {}),
        };
        migratedProfile.workoutLocation = migratedProfile.workoutLocation || (migratedProfile.gymType === 'home' ? 'home' : 'gym');
        migratedProfile.gymType = migratedProfile.gymType || (migratedProfile.workoutLocation === 'home' ? 'home' : 'commercial');
        migratedProfile.onboarded = migratedProfile.onboarded || !!savedOnboarding;

        if (savedProfileRaw) setProfile(migratedProfile);
        if (migratedProfile.onboarded) setView('app');

        setSettings(savedSettings);
        setHistory(savedHistory);
        setCardioHistory(savedCardio);
        setAppState({ ...savedState, restDays: mergedRestDays });
        storage.set(REST_DAY_KEY, mergedRestDays);
        setDismissedDraftDate(savedDismiss);
        const resolvedTodaySession = normalizedActiveSession?.date === currentDayKey ? normalizedActiveSession : null;
        setActiveSession(resolvedTodaySession);
        setDraftPlan(null);
        if (resolvedTodaySession) {
          storage.set(TODAY_SESSION_KEY, resolvedTodaySession);
        }

        const savedMeta = storage.get(STORAGE_KEY, null);
        const baseMeta = {
          version: STORAGE_VERSION,
          pinnedExercises: savedSettings?.pinnedExercises || [],
          recentExercises: [],
          exerciseUsageCounts: {},
          dayEntries: {},
          lastExerciseStats: {}
        };

        let metaToUse = baseMeta;
        if (savedMeta?.version === STORAGE_VERSION) {
          metaToUse = { ...baseMeta, ...savedMeta };
        } else {
          metaToUse = {
            ...baseMeta,
            recentExercises: deriveRecentExercises(savedHistory, 12),
            exerciseUsageCounts: deriveUsageCountsFromHistory(savedHistory),
            dayEntries: buildDayEntriesFromHistory(savedHistory, savedCardio, savedState?.restDays || [])
          };
          storage.set(STORAGE_KEY, metaToUse);
        }

        setPinnedExercises(metaToUse.pinnedExercises || []);
        setStarredExercises(Array.isArray(savedStarred) ? savedStarred : []);
        setRecentExercises(metaToUse.recentExercises || []);
        setExerciseUsageCounts(metaToUse.exerciseUsageCounts || {});
        setDayEntries(metaToUse.dayEntries || {});
        setLastExerciseStats(metaToUse.lastExerciseStats || {});
        setLoaded(true);
      }, []);

      useEffect(() => { 
        if(loaded) {
          storage.set('ps_v2_profile', profile); 
          storage.set(ONBOARDING_KEY, !!profile.onboarded);
        }
      }, [profile, loaded]);
      useEffect(() => { if(loaded) storage.set('ps_v2_settings', settings); }, [settings, loaded]);
      useEffect(() => {
        if (!loaded) return;
        try {
          localStorage.setItem('ps_starredExercises', JSON.stringify(starredExercises));
        } catch {
          return;
        }
      }, [starredExercises, loaded]);
      useEffect(() => {
        if (!loaded) return;
        try {
          localStorage.setItem('ps_colorfulExerciseCards', JSON.stringify(!!colorfulExerciseCards));
        } catch {
          return;
        }
      }, [colorfulExerciseCards, loaded]);
      useEffect(() => {
        document.body.classList.toggle('exercise-colors-off', !colorfulExerciseCards);
      }, [colorfulExerciseCards]);
      useEffect(() => {
        if (!loaded) return;
        const persist = () => storage.set('ps_v2_history', history);
        if (typeof requestIdleCallback === 'function') {
          const idleId = requestIdleCallback(persist);
          return () => cancelIdleCallback(idleId);
        }
        const timeoutId = setTimeout(persist, 0);
        return () => clearTimeout(timeoutId);
      }, [history, loaded]);
      useEffect(() => {
        if (!loaded) return;
        const persist = () => storage.set('ps_v2_cardio', cardioHistory);
        if (typeof requestIdleCallback === 'function') {
          const idleId = requestIdleCallback(persist);
          return () => cancelIdleCallback(idleId);
        }
        const timeoutId = setTimeout(persist, 0);
        return () => clearTimeout(timeoutId);
      }, [cardioHistory, loaded]);
      useEffect(() => {
        if (!loaded) return;
        storage.set('ps_v2_state', appState);
        storage.set(REST_DAY_KEY, appState?.restDays || []);
      }, [appState, loaded]);
      useEffect(() => { if(loaded) storage.set('ps_dismissed_draft_date', dismissedDraftDate); }, [dismissedDraftDate, loaded]);
      useEffect(() => {
        if (!loaded) return;
        const persist = () => storage.set(TODAY_SESSION_KEY, activeSession);
        if (typeof requestIdleCallback === 'function') {
          const idleId = requestIdleCallback(persist);
          return () => cancelIdleCallback(idleId);
        }
        const timeoutId = setTimeout(persist, 0);
        return () => clearTimeout(timeoutId);
      }, [activeSession, loaded]);
      useEffect(() => {
        if (!loaded) return;
        storage.set(STORAGE_KEY, {
          version: STORAGE_VERSION,
          pinnedExercises,
          recentExercises,
          exerciseUsageCounts,
          dayEntries,
          lastExerciseStats
        });
      }, [loaded, pinnedExercises, recentExercises, exerciseUsageCounts, dayEntries, lastExerciseStats]);

      useEffect(() => {
        return () => {
          if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
      }, []);

      useEffect(() => {
        return () => {
          if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        };
      }, []);

      useEffect(() => {
        if (!sessionStartNotice) return;
        if (sessionStartTimerRef.current) clearTimeout(sessionStartTimerRef.current);
        sessionStartTimerRef.current = setTimeout(() => setSessionStartNotice(null), 4000);
        return () => {
          if (sessionStartTimerRef.current) clearTimeout(sessionStartTimerRef.current);
        };
      }, [sessionStartNotice]);

      const pushMessage = (text) => {
        if (!text || text === 'Workout saved.') return;
        setInlineMessage(text);
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => setInlineMessage(null), 3200);
      };

      const showToast = useCallback((message) => {
        if (!message) return;
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => {
          setToasts(prev => prev.filter((toast) => toast.id !== id));
        }, 2600);
      }, []);

      const showUndoToast = ({ message, onUndo, onCommit }) => {
        if (undoTimerRef.current) {
          clearTimeout(undoTimerRef.current);
          if (undoActionRef.current?.onCommit) {
            undoActionRef.current.onCommit();
          }
        }
        undoActionRef.current = { onUndo, onCommit };
        setUndoToast({ message });
        undoTimerRef.current = setTimeout(() => {
          const commit = undoActionRef.current?.onCommit;
          undoActionRef.current = null;
          setUndoToast(null);
          if (commit) commit();
        }, 3000);
      };

      const handleUndoAction = () => {
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        const undo = undoActionRef.current?.onUndo;
        undoActionRef.current = null;
        setUndoToast(null);
        if (undo) undo();
      };

      useEffect(() => {
        if (!loaded) return;
        const lastOpen = storage.get(LAST_OPEN_KEY, null);
        const now = new Date();
        if (lastOpen) {
          const diffDays = Math.floor((now - new Date(lastOpen)) / (1000 * 60 * 60 * 24));
          if (diffDays >= 4) {
            pushMessage(COPY_PUSH.welcomeBackLong);
          } else if (diffDays >= 1 && Math.random() < 0.35) {
            const options = COPY_PUSH.welcomeBack;
            pushMessage(options[Math.floor(Math.random() * options.length)]);
          }
        } else if (Math.random() < 0.25) {
          pushMessage(COPY_PUSH.readyDefault);
        }
        storage.set(LAST_OPEN_KEY, now.toISOString());
      }, [loaded]);

      useEffect(() => {
        const effectiveData = true; // theme application removed
      }, []);

      const effectiveData = useMemo(() => getEffectiveData({
        history,
        cardioHistory,
        restDays: appState?.restDays || [],
        dayEntries
      }, settings.useDemoData), [history, cardioHistory, appState?.restDays, dayEntries, settings.useDemoData]);
      const effectiveHistory = effectiveData.history;
      const effectiveCardioHistory = effectiveData.cardioHistory;
      const effectiveRestDays = effectiveData.restDays;
      const effectiveDayEntries = effectiveData.dayEntries;

      const todayWorkoutType = useMemo(() => getTodaysWorkoutType(effectiveHistory, appState), [effectiveHistory, appState]);

      const strengthScoreObj = useMemo(() => {
        if (!showAnalytics) {
          return { score: 0, avgPct: 0, coveragePct: 0, loggedCount: 0, total: Object.keys(EQUIPMENT_DB).length };
        }
        if (!profile?.onboarded) return { score: 0, avgPct: 0, coveragePct: 0, loggedCount: 0, total: Object.keys(EQUIPMENT_DB).length };
        return computeStrengthScore(profile, effectiveHistory);
      }, [profile, effectiveHistory, showAnalytics]);

      const streakObj = useMemo(() => computeStreak(effectiveHistory, effectiveCardioHistory, effectiveRestDays, effectiveDayEntries), [effectiveHistory, effectiveCardioHistory, effectiveRestDays, effectiveDayEntries]);

      const achievements = useMemo(() => {
        if (!showAnalytics) return [];
        return computeAchievements({ history: effectiveHistory, cardioHistory: effectiveCardioHistory, strengthScoreObj, streakObj });
      }, [effectiveHistory, effectiveCardioHistory, strengthScoreObj, streakObj, showAnalytics]);

      const lastWorkoutDate = useMemo(() => getLastWorkoutDate(effectiveHistory, effectiveCardioHistory), [effectiveHistory, effectiveCardioHistory]);

      const lastWorkoutLabel = useMemo(() => {
        if (!lastWorkoutDate) return null;
        const today = new Date();
        const todayKey = toDayKey(today);
        const lastKey = toDayKey(lastWorkoutDate);
        if (lastKey === todayKey) return 'Today';
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (lastKey === toDayKey(yesterday)) return 'Yesterday';
        const diffDays = Math.floor((today - lastWorkoutDate) / 86400000);
        if (diffDays < 7) return `${diffDays} days ago`;
        return lastWorkoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }, [lastWorkoutDate]);

      const sessionSummary = useMemo(
        () => buildLastSessionSummary(effectiveHistory, lastWorkoutLabel),
        [effectiveHistory, lastWorkoutLabel]
      );
      const lastSessionSummary = sessionSummary?.full;
      const lastSessionShortLabel = sessionSummary?.short;
      const lastSessionDetail = sessionSummary?.detail;

      const weekWorkoutCount = useMemo(() => {
        const today = new Date();
        let count = 0;
        for (let i = 0; i < 7; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          const key = toDayKey(day);
          if (effectiveDayEntries?.[key]?.type === 'workout') count += 1;
        }
        return count;
      }, [effectiveDayEntries]);

      const streak = streakObj?.current || 0;
      const sessionsThisWeek = weekWorkoutCount || 0;

      const coachMessage = useMemo(
        () => getCoachMessage({ streak, sessionsThisWeek }),
        [streak, sessionsThisWeek]
      );
      const recordDayEntry = (dayKey, type = 'workout', extras = {}) => {
        setDayEntries(prev => {
          const existing = prev[dayKey];
          const resolvedType = existing?.type === 'workout' ? 'workout' : type;
          return { ...prev, [dayKey]: { ...(existing || {}), ...extras, type: resolvedType, date: dayKey } };
        });
      };

      const recordExerciseUse = (exerciseId, sets = []) => {
        if (!exerciseId) return;
        setRecentExercises(prev => {
          const filtered = prev.filter(id => id !== exerciseId);
          return [exerciseId, ...filtered].slice(0, 12);
        });
        setExerciseUsageCounts(prev => ({ ...prev, [exerciseId]: (prev[exerciseId] || 0) + Math.max(1, sets.length || 1) }));
        if (sets && sets.length > 0) {
          const lastSet = sets[sets.length - 1];
          setLastExerciseStats(prev => ({ ...prev, [exerciseId]: { weight: lastSet.weight, reps: lastSet.reps } }));
        }
      };

      const toggleStarredExercise = (exerciseId) => {
        if (!exerciseId) return;
        setStarredExercises(prev => prev.includes(exerciseId)
          ? prev.filter(id => id !== exerciseId)
          : [...prev, exerciseId]
        );
      };

      const todayKey = toDayKey(new Date());
      const activeSessionToday = activeSession?.date === todayKey ? activeSession : null;
      const draftPlanToday = draftPlan?.date === todayKey ? draftPlan : null;
      const restDayDates = Array.isArray(effectiveRestDays) ? effectiveRestDays : [];
      const isRestDay = restDayDates.includes(todayKey);
      const sessionIntent = useMemo(() => {
        if (isRestDay) return 'recovery';
        if (lastWorkoutLabel === 'Today') return 'calm';
        return 'standard';
      }, [isRestDay, lastWorkoutLabel]);
      const homeQuote = useMemo(() => getDailyQuote(homeQuotes, 'home'), [todayKey]);
      const suggestedFocus = useMemo(() => {
        const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
        const workoutDays = Object.entries(effectiveDayEntries || {})
          .filter(([, entry]) => entry?.type === 'workout')
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .slice(0, 2);
        if (workoutDays.length === 0) return 'Full Body';
        const used = new Set();
        workoutDays.forEach(([, entry]) => {
          (Array.isArray(entry.exercises) ? entry.exercises : []).forEach(id => {
            const group = resolveMuscleGroup(EQUIPMENT_DB[id]);
            if (group) used.add(group);
          });
        });
        const remaining = muscleGroups.filter(group => !used.has(group));
        return remaining[0] || 'Full Body';
      }, [effectiveDayEntries]);

      const lastWorkoutExerciseIds = useMemo(() => {
        const lastWorkout = Object.entries(effectiveDayEntries || {})
          .filter(([dayKey, entry]) => dayKey !== todayKey && entry?.type === 'workout' && Array.isArray(entry.exercises) && entry.exercises.length > 0)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))[0];
        if (!lastWorkout) return [];
        return Array.from(new Set(lastWorkout[1].exercises))
          .filter(id => EQUIPMENT_DB[id] && !EQUIPMENT_DB[id].comingSoon);
      }, [effectiveDayEntries, todayKey]);

      useEffect(() => {
        if (!isRestDay) return;
        setActiveEquipment(null);
        setActiveCardio(null);
        setActiveSession(null);
        setDraftPlan(null);
        setDismissedDraftDate(null);
      }, [isRestDay]);

      // Easter egg: Perfect Week detection (7 consecutive days)
      useEffect(() => {
        const checkPerfectWeek = () => {
          const today = new Date();
          const last7Days = [];
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(toDayKey(date));
          }
          
          const hasAllWorkouts = last7Days.every(dayKey => {
            const entry = effectiveDayEntries[dayKey];
            return entry && entry.type === 'workout';
          });
          
          if (hasAllWorkouts) {
            const lastShown = localStorage.getItem('lastPerfectWeekShown');
            if (lastShown !== todayKey) {
              setShowPerfectWeek(true);
              localStorage.setItem('lastPerfectWeekShown', todayKey);
            }
          }
        };
        
        checkPerfectWeek();
      }, [effectiveDayEntries, todayKey]);

      const createEmptySession = (overrides = {}) => ({
        date: todayKey,
        status: 'active',
        items: [],
        logsByExercise: {},
        createdFrom: overrides.createdFrom || 'manual',
        ...overrides
      });

      const updateSessionItemsByIds = (ids = [], options = {}) => {
        const uniqueIds = Array.from(new Set(ids));
        setActiveSession(prev => {
          const base = (!prev || prev.date !== todayKey) ? createEmptySession({ createdFrom: options.createdFrom || 'manual' }) : prev;
          const items = buildSessionItemsFromIds(uniqueIds, base.items || []);
          const logsByExercise = { ...(base.logsByExercise || {}) };
          uniqueIds.forEach(id => {
            if (!logsByExercise[id]) logsByExercise[id] = [];
          });
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
      };

      const buildSessionItem = (exerciseId, kind = 'strength') => {
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
      };

      const buildSessionItemsFromIds = (ids = [], baseItems = []) => {
        return ids.map(id => {
          const existing = baseItems.find(item => item.exerciseId === id || item.id === id);
          if (existing) {
            const name = EQUIPMENT_DB[id]?.name || existing.name || existing.label || 'Exercise';
            const muscleGroup = existing.muscleGroup || EQUIPMENT_DB[id]?.target || '';
            const derivedKind = EQUIPMENT_DB[id]?.type === 'cardio' ? 'cardio' : (existing.kind || 'strength');
            return { ...existing, exerciseId: id, id, name, label: name, kind: derivedKind, muscleGroup };
          }
          return buildSessionItem(id);
        });
      };

      const updateDraftPlanExercises = (updater) => {
        setDraftPlan(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          const nextExercises = updater(prev.exercises || []);
          return { ...prev, exercises: nextExercises };
        });
      };

      const updateActiveSession = (entry, setsList = null) => {
        if (!entry?.id) return;
        setActiveSession(prev => {
          const base = (!prev || prev.date !== todayKey) ? createEmptySession({ createdFrom: 'manual' }) : prev;
          const items = [...(base.items || [])];
          const logsByExercise = { ...(base.logsByExercise || {}) };
          const idx = items.findIndex(item => (item.exerciseId || item.id) === entry.id);
          const resolvedSets = Array.isArray(setsList)
            ? setsList
            : (Array.isArray(logsByExercise[entry.id]) ? logsByExercise[entry.id] : Array.from({ length: entry.sets || 0 }, () => ({ reps: null, weight: null })));
          logsByExercise[entry.id] = resolvedSets;
          const name = entry.name || entry.label || EQUIPMENT_DB[entry.id]?.name || 'Exercise';
          const updatedItem = {
            ...(idx >= 0 ? items[idx] : buildSessionItem(entry.id, entry.kind || 'strength')),
            exerciseId: entry.id,
            id: entry.id,
            name,
            label: name,
            kind: entry.kind || (idx >= 0 ? items[idx].kind : 'strength'),
            muscleGroup: entry.muscleGroup || (idx >= 0 ? items[idx].muscleGroup : null) || EQUIPMENT_DB[entry.id]?.target || '',
            sets: resolvedSets.length
          };
          if (idx >= 0) items[idx] = updatedItem;
          else items.push(updatedItem);
          return {
            ...base,
            status: base.status,
            items,
            logsByExercise
          };
        });
      };

      const updateSessionLogs = (exerciseId, sets) => {
        if (!exerciseId) return;
        
        // Easter egg: Check for 69 or 420 in weight
        sets.forEach(set => {
          if (set.weight === 69 || set.weight === 420 || set.weight === '69' || set.weight === '420') {
            setShowNice(true);
            setTimeout(() => setShowNice(false), 2000);
          }
        });
        
        updateActiveSession({
          id: exerciseId,
          name: EQUIPMENT_DB[exerciseId]?.name || 'Exercise',
          kind: EQUIPMENT_DB[exerciseId]?.type === 'cardio' ? 'cardio' : 'strength'
        }, sets);
      };

      const quickLogSessionSet = (exerciseId, set) => {
        const weight = Number(set?.weight);
        const reps = Number(set?.reps);
        if (!exerciseId || !weight || !reps) return false;
        const activeLogs = activeSessionToday?.logsByExercise?.[exerciseId] || [];
        const dedupeKey = `${exerciseId}-${weight}-${reps}`;
        const now = Date.now();
        if (quickLogSubmitRef.current.key === dedupeKey && now - quickLogSubmitRef.current.at < 400) {
          return false;
        }
        quickLogSubmitRef.current = { key: dedupeKey, at: now };
        updateSessionLogs(exerciseId, [...activeLogs, { weight, reps }]);
        showToast?.('Set saved');
        return true;
      };

      const ensureWorkoutDayEntry = (exercises = []) => {
        if (!profile.onboarded) return;
        recordDayEntry(todayKey, 'workout', { exercises: Array.from(new Set([...(dayEntries[todayKey]?.exercises || []), ...exercises])) });
      };

      const removeExerciseLogsForToday = (exerciseId, kind = 'strength') => {
        if (kind === 'cardio' && exerciseId.startsWith('cardio_')) {
          const cardioType = exerciseId.replace('cardio_', '');
          setCardioHistory(prev => {
            const existing = prev[cardioType] || [];
            const updated = existing.filter(s => toDayKey(new Date(s.date)) !== todayKey);
            if (updated.length === existing.length) return prev;
            return { ...prev, [cardioType]: updated };
          });
        }
        setHistory(prev => {
          const existing = prev[exerciseId] || [];
          const updated = existing.filter(s => toDayKey(new Date(s.date)) !== todayKey);
          if (updated.length === existing.length) return prev;
          return { ...prev, [exerciseId]: updated };
        });
        setDayEntries(prev => {
          const todayEntry = prev[todayKey];
          if (!todayEntry?.exercises) return prev;
          const updated = todayEntry.exercises.filter(id => id !== exerciseId);
          if (updated.length === todayEntry.exercises.length) return prev;
          return { ...prev, [todayKey]: { ...todayEntry, exercises: updated } };
        });
      };

      const createEmptyDraft = () => {
        createDraft({ label: 'Workout Draft', exercises: [], createdFrom: 'manual', type: todayWorkoutType });
        updateSessionItemsByIds([], { status: 'active', createdFrom: 'manual' });
        setFocusDraft(true);
      };

      const finishActiveSession = () => {
        if (!activeSession) return;
        const hasData = Object.values(activeSession.logsByExercise || {}).some(sets => (sets || []).length > 0);
        if (activeSession.status !== 'active' && !hasData) return;
        debugLog('workout_finish', { date: todayKey });
        const sessionDate = new Date().toISOString();
        const logsByExercise = activeSession.logsByExercise || {};
        const sessionExercises = activeSession.items || [];
        sessionExercises.forEach(item => {
          const exerciseId = item.exerciseId || item.id;
          const logs = logsByExercise[exerciseId] || [];
          if (!logs.length) return;
          if (item.kind === 'cardio') {
            handleSaveCardioSession(exerciseId, logs);
          } else {
            handleSaveSession(exerciseId, { date: sessionDate, type: 'strength', sets: logs }, { quiet: true });
          }
        });
        recordDayEntry(todayKey, 'workout', { exercises: sessionExercises.map(item => item.exerciseId || item.id) });
        setActiveSession(null);
        setDraftPlan(null);
        setDismissedDraftDate(null);
        setActiveEquipment(null);
        setActiveCardio(null);
        setSessionStartNotice(null);
        const chosenQuote = getRandomQuote(postWorkoutQuotes);
        setPostWorkoutQuote(chosenQuote);
        setShowPostWorkout(true);
        setShowPostWorkoutCelebration(true);
        if (postWorkoutCelebrationRef.current) clearTimeout(postWorkoutCelebrationRef.current);
        postWorkoutCelebrationRef.current = setTimeout(() => setShowPostWorkoutCelebration(false), 720);
        if (postWorkoutTimerRef.current) clearTimeout(postWorkoutTimerRef.current);
        postWorkoutTimerRef.current = setTimeout(() => setShowPostWorkout(false), 3600);
        setTab('home');
        pushMessage(COPY_PUSH.workoutSaved);
        showToast('Session saved. Future you says thanks.');
      };

      const buildDraftPlan = (type, options = {}) => {
        const gymType = GYM_TYPES[profile.gymType];
        const planKey = type === 'legs' ? 'Legs' : type === 'push' ? 'Push' : type === 'pull' ? 'Pull' : type === 'full' ? 'Full Body' : todayWorkoutType;
        const planLabel = planKey === 'Full Body' ? 'Full Body' : `${planKey} Day`;
        const plan = WORKOUT_PLANS[planKey] || {};
        const pool = [];
        const wantsMachines = options.equipment === 'machines';
        const wantsFree = options.equipment === 'free';
        const allowMachines = gymType?.machines && !wantsFree;
        const allowFree = (gymType?.dumbbells?.available || gymType?.barbells?.available) && !wantsMachines;
        if (allowMachines) pool.push(...(plan.machines || []));
        if (allowFree && gymType?.dumbbells?.available) pool.push(...(plan.dumbbells || []));
        if (allowFree && gymType?.barbells?.available) pool.push(...(plan.barbells || []));
        const uniquePool = Array.from(new Set(pool));
        if (uniquePool.length === 0) {
          uniquePool.push(...Object.keys(EQUIPMENT_DB).slice(0, 12));
        }
        const targetCount = options.duration === 30 ? 3 : options.duration === 60 ? 5 : 4;
        while (uniquePool.length < targetCount) {
          const fallback = Object.keys(EQUIPMENT_DB).filter(id => (EQUIPMENT_DB[id]?.tags || []).includes(planKey.toLowerCase()) || EQUIPMENT_DB[id]?.tags?.includes(planKey));
          if (fallback.length === 0) {
            uniquePool.push(...Object.keys(EQUIPMENT_DB).filter(id => uniquePool.indexOf(id) === -1).slice(0, targetCount - uniquePool.length));
          } else {
            uniquePool.push(...fallback);
          }
          uniquePool.splice(targetCount);
          if (uniquePool.length >= targetCount || fallback.length === 0) break;
        }
        const picks = [];
        const poolCopy = [...uniquePool];
        for (let i = 0; i < targetCount && poolCopy.length > 0; i++) {
          const idx = Math.floor(Math.random() * poolCopy.length);
          picks.push(poolCopy.splice(idx, 1)[0]);
        }
        const sanitizedOptions = {
          goal: options.goal || '',
          duration: options.duration || '',
          equipment: options.equipment || ''
        };
        return { type, label: planLabel, exercises: picks, options: sanitizedOptions };
      };

      const createDraft = (draft) => {
        const resolved = {
          date: todayKey,
          label: draft?.label || 'Workout Draft',
          exercises: draft?.exercises || [],
          options: draft?.options || {},
          status: 'active',
          createdFrom: draft?.createdFrom || 'manual',
          type: draft?.type || todayWorkoutType
        };
        setDraftPlan(resolved);
        setDismissedDraftDate(null);
      };

      const triggerGenerator = (type) => {
        if (isRestDay) {
          setTab('home');
          return;
        }
        if (activeSessionToday?.status === 'active') {
          setTab('workout');
          return;
        }
        const chosen = type === 'surprise' ? ['legs','push','pull','full'][Math.floor(Math.random()*4)] : type;
        const draft = buildDraftPlan(chosen, generatorOptions || {});
        updateSessionItemsByIds(draft.exercises || [], { status: 'active', createdFrom: 'generated' });
        showToast("Added to today's workout");
        setTab('workout');
      };

      const regenerateDraftPlan = () => {
        if (!draftPlan) return;
        const hasOptions = generatorOptions?.goal || generatorOptions?.duration || generatorOptions?.equipment;
        const regenerated = buildDraftPlan(draftPlan.type, hasOptions ? generatorOptions : (draftPlan.options || {}));
        createDraft({ ...regenerated, createdFrom: 'generated' });
        updateSessionItemsByIds(regenerated.exercises || [], {
          status: 'active',
          createdFrom: 'generated'
        });
      };

      const swapDraftExercise = (index, newId) => {
        const currentId = draftPlanToday?.exercises?.[index];
        const existingEntry = activeSessionToday?.items?.find(item => (item.exerciseId || item.id) === currentId);
        if (existingEntry?.sets > 0) {
          const confirmed = window.confirm("This will remove logged sets for this exercise from today's session.");
          if (!confirmed) return;
          removeExerciseLogsForToday(currentId, existingEntry.kind);
        }
        setDraftPlan(prev => {
          if (!prev) return prev;
          const updated = [...prev.exercises];
          updated[index] = newId;
          return { ...prev, exercises: updated };
        });
        setActiveSession(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          const items = [...(prev.items || [])];
          const logsByExercise = { ...(prev.logsByExercise || {}) };
          if (items[index]) {
            items[index] = buildSessionItem(newId);
          } else if (currentId) {
            const idx = items.findIndex(item => item.id === currentId);
            if (idx >= 0) {
              items[idx] = buildSessionItem(newId);
            }
          }
          if (currentId) delete logsByExercise[currentId];
          if (!logsByExercise[newId]) logsByExercise[newId] = [];
          return { ...prev, items, logsByExercise };
        });
      };

      const removeDraftExercise = (index) => {
        const currentId = draftPlanToday?.exercises?.[index];
        const existingEntry = activeSessionToday?.items?.find(item => (item.exerciseId || item.id) === currentId);
        if (existingEntry?.sets > 0) {
          const confirmed = window.confirm("This will remove logged sets for this exercise from today's session.");
          if (!confirmed) return;
          removeExerciseLogsForToday(currentId, existingEntry.kind);
        }
        setDraftPlan(prev => {
          if (!prev) return prev;
          const updated = prev.exercises.filter((_, idx) => idx !== index);
          return { ...prev, exercises: updated };
        });
        if (currentId) {
          setActiveSession(prev => {
            if (!prev || prev.date !== todayKey) return prev;
            const logsByExercise = { ...(prev.logsByExercise || {}) };
            delete logsByExercise[currentId];
            return { ...prev, items: (prev.items || []).filter(item => (item.exerciseId || item.id) !== currentId), logsByExercise };
          });
        }
      };

      const clearDraftPlan = () => {
        setDraftPlan(null);
        setDismissedDraftDate(null);
        if (activeSessionToday) {
          updateSessionItemsByIds([], {
            status: 'active',
            createdFrom: 'manual'
          });
        }
      };

      const logRestDay = () => {
        debugLog('rest_day', { date: todayKey });
        setAppState(prev => {
          const restDays = new Set(prev?.restDays || []);
          restDays.add(todayKey);
          return { ...(prev || {}), restDays: Array.from(restDays) };
        });
        recordDayEntry(todayKey, 'rest');
        setActiveSession(null);
        setDraftPlan(null);
        setDismissedDraftDate(null);
        setActiveEquipment(null);
        setActiveCardio(null);
        setTab('workout');
        pushMessage(COPY_PUSH.restDayLogged);
      };

      const undoRestDay = () => {
        setAppState(prev => {
          const restDays = (prev?.restDays || []).filter(day => day !== todayKey);
          return { ...(prev || {}), restDays };
        });
        setDayEntries(prev => {
          const entry = prev[todayKey];
          if (!entry || entry.type !== 'rest') return prev;
          const next = { ...prev };
          delete next[todayKey];
          return next;
        });
        pushMessage(COPY_PUSH.restDayRemoved);
      };

      const applyTemplatePlan = (plan) => {
        if (!plan) return;
        if (isRestDay) {
          undoRestDay();
        }

        const exerciseIds = (plan.exercises || [])
          .map((ex) => ex.id || ex.key || ex.name)
          .filter(Boolean);

        if (!exerciseIds.length) return;

        updateSessionItemsByIds(exerciseIds, {
          status: 'active',
          createdFrom: 'generated'
        });

        setDraftPlan({
          date: todayKey,
          label: plan.name || 'Workout Template',
          exercises: exerciseIds,
          options: {},
          status: 'active',
          createdFrom: 'generated',
          type: todayWorkoutType
        });

        setDismissedDraftDate(null);
      };

      const startWorkoutFromBuilder = () => {
        if (isRestDay || !activeSessionToday) return;
        ensureWorkoutDayEntry((activeSessionToday.items || []).map(item => item.exerciseId || item.id));
        setActiveSession(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          return { ...prev, status: 'active' };
        });
        debugLog('workout_start', { date: todayKey });
      };

      const handleStartWorkout = () => {
        if (isRestDay) {
          undoRestDay();
        }
        setTab('workout');
        if (activeSessionToday) {
          return;
        }
        if (!activeSessionToday) {
          startEmptySession();
        }
      };

      const handleOpenHistoryFromHome = () => {
        setHomeRequestedAnalyticsTab('history');
        setShowPatterns(false);
        setShowMuscleMap(false);
        setShowAnalytics(true);
      };

      const handleOpenSettingsFromHome = () => setTab('profile');

      const startEmptySession = () => {
        if (isRestDay) {
          undoRestDay();
        }
        setActiveSession(prev => {
          const base = (!prev || prev.date !== todayKey) ? createEmptySession({ createdFrom: 'manual' }) : prev;
          return { ...base, status: 'active' };
        });
      };

      const startSessionWithExercise = (id) => {
        if (!id || EQUIPMENT_DB[id]?.comingSoon) return;
        if (id === 'kung_fu') {
          setShowMatrix(true);
          return;
        }
        if (id === 'power_up') {
          setShowPowerUp(true);
          return;
        }
        if (isRestDay) {
          undoRestDay();
        }
        const alreadyAdded = activeSessionToday?.items?.some(item => (item.exerciseId || item.id) === id);
        setActiveSession(prev => {
          const base = (!prev || prev.date !== todayKey) ? createEmptySession({ createdFrom: 'quick-start' }) : prev;
          const items = [...(base.items || [])];
          const logsByExercise = { ...(base.logsByExercise || {}) };
          if (!items.find(item => (item.exerciseId || item.id) === id)) {
            items.push(buildSessionItem(id));
            logsByExercise[id] = logsByExercise[id] || [];
          }
          return {
            ...base,
            status: 'active',
            createdFrom: base.createdFrom || 'quick-start',
            items,
            logsByExercise
          };
        });
        setTab('workout');
        if (!alreadyAdded) {
          debugLog('exercise_quick_start', { id });
          showToast('Exercise added');
        }
      };

      const repeatLastWorkout = () => {
        if (!lastWorkoutExerciseIds.length) return;
        if (isRestDay) {
          undoRestDay();
        }
        updateSessionItemsByIds(lastWorkoutExerciseIds, {
          status: 'active',
          createdFrom: 'repeat'
        });
        setDraftPlan(null);
        setDismissedDraftDate(null);
        setTab('workout');
        showToast(`Loaded ${lastWorkoutExerciseIds.length} exercises`);
        debugLog('workout_repeat_last', { count: lastWorkoutExerciseIds.length });
      };

      const cancelTodaySession = (isActive = false, hasLoggedSets = false) => {
        if (hasLoggedSets) {
          const confirmed = window.confirm("Discard today's session? Your logged sets will be cleared.");
          if (!confirmed) return;
        } else if (isActive) {
          const confirmed = window.confirm('Cancel this workout?');
          if (!confirmed) return;
        }
        setActiveSession(null);
        setDraftPlan(null);
        setDismissedDraftDate(null);
        setActiveEquipment(null);
        setActiveCardio(null);
        setSessionStartNotice(null);
      };

      const addExerciseToDraft = (id) => {
        if (!id) return;
        addExerciseToSession(id, { status: activeSessionToday?.status || 'active' });
      };

      const addExerciseToSession = (id, options = {}) => {
        if (isRestDay) return;
        if (!id) return;
        if (!activeSessionToday) return;
        const alreadyAdded = activeSessionToday?.items?.some(item => (item.exerciseId || item.id) === id);
        setActiveSession(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          const base = prev;
          const items = [...(base.items || [])];
          const logsByExercise = { ...(base.logsByExercise || {}) };
          if (!items.find(item => (item.exerciseId || item.id) === id)) {
            items.push(buildSessionItem(id));
            logsByExercise[id] = [];
          }
          const nextStatus = options.status || base.status;
          return { ...base, status: 'active', createdFrom: base.createdFrom || options.createdFrom || 'manual', items, logsByExercise };
        });
        if (options.toast && !alreadyAdded) {
          showToast('Exercise added');
        }
        if (!alreadyAdded) {
          debugLog('exercise_add', { id });
        }
      };

      const addExerciseFromSearch = (id) => {
        if (isRestDay) return;
        if (!id) return;
        
        if (id === 'kung_fu') {
          setShowMatrix(true);
          return;
        }
        
        if (id === 'power_up') {
          setShowPowerUp(true);
          return;
        }
        
        addExerciseToSession(id, { status: activeSessionToday?.status === 'active' ? 'active' : 'active', toast: true });
      };

      const handleSelectExercise = (id, mode, options = {}) => {
        if (isRestDay) return;
        if (options.createDraftOnly) {
          createEmptyDraft();
          return;
        }
        if (!id) return;
        if (!activeSessionToday) return;
        if (activeSessionToday?.status !== 'active') return;
        if (EQUIPMENT_DB[id]?.comingSoon) return;
        if (mode === 'session') {
          if (!activeSessionToday?.items?.some(item => (item.exerciseId || item.id) === id)) return;
          const entry = activeSessionToday?.items?.find(item => (item.exerciseId || item.id) === id);
          if (activeEquipment === id || activeCardio === id) {
            setActiveEquipment(null);
            setActiveCardio(null);
            return;
          }
          if (entry?.kind === 'cardio') {
            setActiveEquipment(null);
            setActiveCardio(id);
          } else {
            setActiveCardio(null);
            setActiveEquipment(id);
            setPendingAutoFocusExercise(id);
          }
          return;
        }
      };

      const removeSessionExercise = (id) => {
        if (!id || !activeSessionToday) return;
        const entryIndex = activeSessionToday.items?.findIndex(item => (item.exerciseId || item.id) === id);
        const entry = activeSessionToday.items?.[entryIndex];
        const logs = activeSessionToday.logsByExercise?.[id] || [];
        const draftIndex = draftPlanToday?.exercises?.findIndex(exId => exId === id);
        const hadDraftEntry = Number.isInteger(draftIndex) && draftIndex >= 0;
        setActiveSession(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          const logsByExercise = { ...(prev.logsByExercise || {}) };
          delete logsByExercise[id];
          return { ...prev, items: (prev.items || []).filter(item => (item.exerciseId || item.id) !== id), logsByExercise };
        });
        updateDraftPlanExercises(prev => prev.filter(exId => exId !== id));
        showUndoToast({
          message: 'Removed.',
          onUndo: () => {
            setActiveSession(prev => {
              if (!prev || prev.date !== todayKey) return prev;
              const items = [...(prev.items || [])];
              const logsByExercise = { ...(prev.logsByExercise || {}) };
              if (!items.some(item => (item.exerciseId || item.id) === id)) {
                const insertAt = Number.isInteger(entryIndex) ? entryIndex : items.length;
                const restoredEntry = entry || buildSessionItem(id);
                items.splice(Math.min(insertAt, items.length), 0, restoredEntry);
              }
              logsByExercise[id] = logs;
              return { ...prev, items, logsByExercise };
            });
            if (hadDraftEntry) {
              updateDraftPlanExercises(prev => {
                if (prev.includes(id)) return prev;
                const next = [...prev];
                const insertAt = Number.isInteger(draftIndex) ? draftIndex : next.length;
                next.splice(Math.min(insertAt, next.length), 0, id);
                return next;
              });
            }
          },
          onCommit: () => {
            if (logs.length > 0) {
              removeExerciseLogsForToday(id, entry?.kind || 'strength');
            }
          }
        });
      };

      const swapSessionExercise = (index, newId) => {
        if (!activeSessionToday) return;
        const entry = activeSessionToday.items?.[index];
        if (!entry) return;
        const entryId = entry.exerciseId || entry.id;
        if ((activeSessionToday.logsByExercise?.[entryId] || []).length > 0) {
          const confirmed = window.confirm("This will remove logged sets for this exercise from today's session.");
          if (!confirmed) return;
          removeExerciseLogsForToday(entry.id, entry.kind);
        }
        setActiveSession(prev => {
          if (!prev || prev.date !== todayKey) return prev;
          const items = [...(prev.items || [])];
          const logsByExercise = { ...(prev.logsByExercise || {}) };
          if (!items[index]) return prev;
          const oldId = items[index].exerciseId || items[index].id;
          items[index] = buildSessionItem(newId);
          if (oldId) delete logsByExercise[oldId];
          if (!logsByExercise[newId]) logsByExercise[newId] = [];
          return { ...prev, items, logsByExercise };
        });
        updateDraftPlanExercises(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = newId;
            return updated;
          }
          const fallbackIndex = updated.findIndex(exId => exId === entry.id);
          if (fallbackIndex >= 0) updated[fallbackIndex] = newId;
          return updated;
        });
      };

      const handleSaveSession = (id, session, options = {}) => {
        if (isRestDay) return;
        if (!session) return;
        const normalizedSession = {
          ...session,
          sets: [...(session.sets || [])]
        };
        const sessionDay = toDayKey(new Date(session.date));
        const previousSessions = Array.isArray(history[id]) ? history[id] : [];
        const lastSession = previousSessions[previousSessions.length - 1];
        const lastMaxWeight = lastSession?.sets?.length ? Math.max(...lastSession.sets.map(s => s.weight || 0)) : null;
        const lastTotalReps = lastSession?.sets?.length ? lastSession.sets.reduce((sum, s) => sum + (s.reps || 0), 0) : null;
        const newMaxWeight = normalizedSession?.sets?.length ? Math.max(...normalizedSession.sets.map(s => s.weight || 0)) : null;
        const newTotalReps = normalizedSession?.sets?.length ? normalizedSession.sets.reduce((sum, s) => sum + (s.reps || 0), 0) : null;
        setHistory(prev => {
          const prevSessions = prev[id] || [];
          const existingIdx = prevSessions.findIndex(s => toDayKey(new Date(s.date)) === sessionDay);
          const updated = [...prevSessions];
          if (existingIdx >= 0) updated[existingIdx] = normalizedSession;
          else updated.push(normalizedSession);
          return { ...prev, [id]: updated };
        });

        setAppState(prev => ({
          ...prev,
          lastWorkoutType: todayWorkoutType,
          lastWorkoutDayKey: sessionDay
        }));

        // Unlock beginner mode after first workoutrecordExerciseUse(id, session.sets || []);
        recordDayEntry(sessionDay, 'workout', { exercises: Array.from(new Set([...(dayEntries[sessionDay]?.exercises || []), id])) });
        updateActiveSession({
          id,
          name: EQUIPMENT_DB[id]?.name || 'Exercise',
          kind: 'strength'
        }, normalizedSession.sets || []);

        // Only close modal if not explicitly told to keep it open (e.g., from cleanup/auto-save)
        if (!options.keepOpen) {
          setActiveEquipment(null);
        }
        if (!options.quiet) {
          if (settings.insightsEnabled !== false && lastSession && newMaxWeight !== null) {
            const improved = newMaxWeight > (lastMaxWeight || 0) || (newMaxWeight === lastMaxWeight && newTotalReps > (lastTotalReps || 0));
            if (improved) {
              const responses = ['More than last time.', "That's progress."];
              pushMessage(responses[Math.floor(Math.random() * responses.length)]);
            } else {
              pushMessage(COPY_PUSH.workoutSaved);
            }
          } else {
            pushMessage(COPY_PUSH.workoutSaved);
          }
        }
        // Stay on suggested workout screen if user is there
      };

      const handleSaveCardioSession = (exerciseId, entries = []) => {
        if (isRestDay) return;
        if (!exerciseId) return;
        const eq = EQUIPMENT_DB[exerciseId];
        const cardioType = exerciseId.startsWith('cardio_') ? exerciseId.replace('cardio_', '') : exerciseId;
        const totalMinutes = entries.reduce((sum, entry) => sum + (entry.durationMin || entry.minutes || 0), 0);
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
        recordDayEntry(todayKey, 'workout', {
          exercises: Array.from(new Set([...(dayEntries[todayKey]?.exercises || []), exerciseId]))
        });
      };

      const handleReset = () => {
        if(confirm("Reset all data? This can't be undone.")) {
          const freshProfile = { 
            username: '', 
            avatar: '💪', 
            workoutLocation: 'gym',
            gymType: 'commercial',
            barWeight: 45,
            onboarded: false,
          };
          setProfile(freshProfile);
          setHistory({});
          setCardioHistory({});
          setActiveSession(null);
          setView('onboarding');
          setTab('home');
          setAppState({ lastWorkoutType: null, lastWorkoutDayKey: null, restDays: [] });
          setSettings({ ...SETTINGS_DEFAULTS });
          setPinnedExercises([]);
          setStarredExercises([]);
          setColorfulExerciseCards(true);
          setRecentExercises([]);
          setExerciseUsageCounts({});
          setDayEntries({});
          setLastExerciseStats({});
          setDraftPlan(null);
          setDismissedDraftDate(null);
          setHasSeenCoachModeNudge(false);
          setShowCoachModeNudge(false);
          storage.set('ps_v2_profile', null);
          storage.set('ps_v2_history', {});
          storage.set('ps_v2_cardio', {});
          storage.set('ps_v2_state', { lastWorkoutType: null, lastWorkoutDayKey: null, restDays: [] });
          storage.set('ps_v2_settings', { ...SETTINGS_DEFAULTS });
          storage.set(STORAGE_KEY, { version: STORAGE_VERSION, pinnedExercises: [], recentExercises: [], exerciseUsageCounts: {}, dayEntries: {}, lastExerciseStats: {} });
          storage.set(ONBOARDING_KEY, false);
          storage.set('ps_dismissed_draft_date', null);
          storage.set(ACTIVE_SESSION_KEY, null);
          storage.set(DRAFT_SESSION_KEY, null);
          storage.set(TODAY_WORKOUT_KEY, null);
          storage.set(TODAY_SESSION_KEY, null);
          storage.set(REST_DAY_KEY, []);
          try {
            localStorage.setItem('ps_starredExercises', JSON.stringify([]));
            localStorage.setItem('ps_colorfulExerciseCards', JSON.stringify(true));
          } catch {
            return;
          }
        }
      };

      const handleResetOnboarding = () => {
        storage.set(ONBOARDING_KEY, false);
        setProfile(prev => ({ ...prev, onboarded: false }));
        setView('onboarding');
      };

      const completeOnboarding = () => {
        setProfile(prev => ({
          ...prev,
          onboarded: true,
          workoutLocation: prev.workoutLocation || 'gym',
          gymType: prev.gymType || 'commercial'
        }));
        storage.set(ONBOARDING_KEY, true);
        setView('app');
        setTab('home');
      };

      const handleExportData = () => {
        try {
          const exportData = {
            version: 'v2',
            exportDate: new Date().toISOString(),
            profile,
            settings,
            history,
            cardioHistory,
            appState,
            restDayDates: appState?.restDays || [],
            meta: {
              version: STORAGE_VERSION,
              pinnedExercises,
              recentExercises,
              exerciseUsageCounts,
              dayEntries,
              lastExerciseStats
            }
          };

          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `planet-strength-backup-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          alert('✅ Data exported successfully! Your backup file has been downloaded.');
        } catch (error) {
          alert('❌ Export failed: ' + error.message);
        }
      };

      const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const importedData = JSON.parse(event.target.result);
              const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

              // Validate the imported data - require at minimum a history or profile object
              // Be lenient with older exports that may lack cardioHistory or settings
              if (!isPlainObject(importedData) || (!isPlainObject(importedData.history) && !isPlainObject(importedData.profile))) {
                alert('❌ Invalid backup file format. Expected a Planet Strength export JSON.');
                return;
              }

              // Ensure required keys exist with safe defaults for older export formats
              if (!isPlainObject(importedData.history)) importedData.history = {};
              if (!isPlainObject(importedData.cardioHistory)) importedData.cardioHistory = {};
              if (!isPlainObject(importedData.settings)) importedData.settings = {};
              if (!isPlainObject(importedData.profile)) importedData.profile = {};

              if (confirm('⚠️ Import will replace all current data. Continue?')) {
                // Restore all data
                if (importedData.profile) {
                  setProfile(importedData.profile);
                  storage.set('ps_v2_profile', importedData.profile);
                }
                if (importedData.settings) {
                  const mergedSettings = { ...SETTINGS_DEFAULTS, ...importedData.settings };
                  setSettings(mergedSettings);
                  storage.set('ps_v2_settings', mergedSettings);
                }
                if (importedData.history) {
                  setHistory(importedData.history);
                  storage.set('ps_v2_history', importedData.history);
                }
                if (importedData.cardioHistory) {
                  setCardioHistory(importedData.cardioHistory);
                  storage.set('ps_v2_cardio', importedData.cardioHistory);
                }
                if (importedData.appState || importedData.restDayDates) {
                  const restDays = Array.isArray(importedData?.restDayDates)
                    ? importedData.restDayDates
                    : (Array.isArray(importedData?.appState?.restDays) ? importedData.appState.restDays : []);
                  const nextAppState = {
                    lastWorkoutType: importedData.appState?.lastWorkoutType || null,
                    lastWorkoutDayKey: importedData.appState?.lastWorkoutDayKey || null,
                    restDays
                  };
                  setAppState(nextAppState);
                  storage.set('ps_v2_state', nextAppState);
                  storage.set(REST_DAY_KEY, restDays);
                } else {
                  const nextAppState = { lastWorkoutType: null, lastWorkoutDayKey: null, restDays: [] };
                  setAppState(nextAppState);
                  storage.set('ps_v2_state', nextAppState);
                  storage.set(REST_DAY_KEY, []);
                }
                if (importedData.meta) {
                  const meta = {
                    version: STORAGE_VERSION,
                    pinnedExercises: importedData.meta.pinnedExercises || [],
                    recentExercises: importedData.meta.recentExercises || [],
                    exerciseUsageCounts: importedData.meta.exerciseUsageCounts || {},
                    dayEntries: importedData.meta.dayEntries || {},
                    lastExerciseStats: importedData.meta.lastExerciseStats || {}
                  };
                  setPinnedExercises(meta.pinnedExercises);
                  setRecentExercises(meta.recentExercises);
                  setExerciseUsageCounts(meta.exerciseUsageCounts);
                  setDayEntries(meta.dayEntries);
                  setLastExerciseStats(meta.lastExerciseStats);
                  storage.set(STORAGE_KEY, meta);
                } else {
                  const derivedMeta = {
                    version: STORAGE_VERSION,
                    pinnedExercises: importedData.settings?.pinnedExercises || [],
                    recentExercises: deriveRecentExercises(importedData.history || {}),
                    exerciseUsageCounts: deriveUsageCountsFromHistory(importedData.history || {}),
                    dayEntries: buildDayEntriesFromHistory(
                      importedData.history || {},
                      importedData.cardioHistory || {},
                      Array.isArray(importedData?.restDayDates)
                        ? importedData.restDayDates
                        : (importedData.appState?.restDays || [])
                    ),
                    lastExerciseStats: {}
                  };
                  setPinnedExercises(derivedMeta.pinnedExercises);
                  setRecentExercises(derivedMeta.recentExercises);
                  setExerciseUsageCounts(derivedMeta.exerciseUsageCounts);
                  setDayEntries(derivedMeta.dayEntries);
                  setLastExerciseStats(derivedMeta.lastExerciseStats);
                  storage.set(STORAGE_KEY, derivedMeta);
                }

                alert('✅ Data imported successfully! Your backup has been restored.');
              }
            } catch (error) {
              alert('❌ Import failed: Invalid JSON file or corrupted data.');
            }
          };
          reader.readAsText(file);
        };

        input.click();
      };

      if (!loaded) return null;if (view === 'onboarding') return <OnboardingFlow profile={profile} setProfile={setProfile} onFinish={completeOnboarding} />;

      
return (
        <>
          <InstallPrompt />
          <div className="app-root bg-gray-50 flex flex-col overflow-hidden">
            <div className="app-main">
              <InlineMessage message={tab === 'home' && inlineMessage === 'Workout saved.' ? null : inlineMessage} />
              <UndoToast message={undoToast?.message} onUndo={handleUndoAction} />
              <ToastHost toasts={toasts} />
              {showPostWorkout && (
                <div className="post-workout-screen" onClick={() => setShowPostWorkout(false)}>
                  <div
                    className={`post-workout-card ${showPostWorkoutCelebration ? 'post-workout-celebrate' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="post-workout-header">
                      <div className="text-xs font-bold text-gray-400 uppercase">Session</div>
                      <button className="post-workout-close" onClick={() => setShowPostWorkout(false)}>
                        <Icon name="X" className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-2xl font-black text-gray-900">Workout saved.</div>
                    {postWorkoutQuote && (
                      <div className="quote-block subtle">
                        <p className="quote-text">“{postWorkoutQuote.text}”</p>
                        <p className="quote-meta">— {postWorkoutQuote.movie}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="page-stack">
                <div className={`page ${showAnalytics ? 'active' : ''}`} aria-hidden={!showAnalytics}>
                  <div className="h-full flex flex-col bg-gray-50">
                    <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                      <button onClick={() => setShowAnalytics(false)} className="p-2 rounded-full bg-gray-100">
                        <Icon name="ChevronLeft" className="w-5 h-5 text-gray-700" />
                      </button>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase">Analytics</div>
                        <div className="text-lg font-black text-gray-900">Progress</div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <Progress
                        profile={profile}
                        history={effectiveHistory}
                        strengthScoreObj={strengthScoreObj}
                        cardioHistory={effectiveCardioHistory}
                        initialAnalyticsTab={homeRequestedAnalyticsTab || 'overview'}
                      />
                    </div>
                  </div>
                </div>
                <div className={`page ${showPatterns ? 'active' : ''}`} aria-hidden={!showPatterns}>
                  <PatternsScreen
                    history={effectiveHistory}
                    cardioHistory={effectiveCardioHistory}
                    onClose={() => setShowPatterns(false)}
                  />
                </div>
                <div className={`page ${showMuscleMap ? 'active' : ''}`} aria-hidden={!showMuscleMap}>
                  <MuscleMapScreen
                    history={effectiveHistory}
                    onClose={() => setShowMuscleMap(false)}
                  />
                </div>
                <div className={`page ${!showAnalytics && !showPatterns && !showMuscleMap && tab === 'home' ? 'active' : ''}`} aria-hidden={showAnalytics || showPatterns || showMuscleMap || tab !== 'home'}>
                  <Home
                    profile={profile}
                    lastWorkoutLabel={lastWorkoutLabel}
                    lastSessionSummary={lastSessionSummary}
                    lastSessionShortLabel={lastSessionShortLabel}
                    lastSessionDetail={lastSessionDetail}
                    suggestedFocus={suggestedFocus}
                    dayEntries={effectiveDayEntries}
                    lastWorkoutDate={lastWorkoutDate}
                    onStartWorkout={handleStartWorkout}
                    homeQuote={homeQuote}
                    coachMessage={coachMessage}
                    isRestDay={isRestDay}
                    sessionIntent={sessionIntent}
                    onLogRestDay={logRestDay}
                    onUndoRestDay={undoRestDay}
                    onTriggerGlory={() => setShowGlory(true)}
                    onLongPressRestDay={() => setShowButDidYouDie(true)}
                    onOpenTemplatesFromHome={() => {
                      setTab('workout');
                      setOpenTemplatesFromHome(true);
                    }}
                    onOpenHistoryFromHome={handleOpenHistoryFromHome}
                    onOpenSettingsFromHome={handleOpenSettingsFromHome}
                  />
                </div>
                <div className={`page ${!showAnalytics && !showPatterns && !showMuscleMap && tab === 'workout' ? 'active' : ''}`} aria-hidden={showAnalytics || showPatterns || showMuscleMap || tab !== 'workout'}>
                  <Workout
                    profile={profile}
                    history={effectiveHistory}
                    cardioHistory={effectiveCardioHistory}
                    colorfulExerciseCards={colorfulExerciseCards}
                    onSelectExercise={handleSelectExercise}
                    settings={settings}
                    setSettings={setSettings}
                    pinnedExercises={pinnedExercises}
                    setPinnedExercises={setPinnedExercises}
                    recentExercises={recentExercises}
                    starredExercises={starredExercises}
                    onToggleStarred={toggleStarredExercise}
                    exerciseUsageCounts={exerciseUsageCounts}
                    onStartWorkoutFromBuilder={startWorkoutFromBuilder}
                    activeSession={activeSessionToday}
                    onFinishSession={finishActiveSession}
                    onAddExerciseFromSearch={addExerciseFromSearch}
                    onPushMessage={pushMessage}
                    onRemoveSessionExercise={removeSessionExercise}
                    onSwapSessionExercise={swapSessionExercise}
                    onStartEmptySession={startEmptySession}
                    isRestDay={isRestDay}
                    onCancelSession={cancelTodaySession}
                    sessionIntent={sessionIntent}
                    onApplyTemplate={applyTemplatePlan}
                    openTemplatesFromHome={openTemplatesFromHome}
                    onConsumedOpenTemplatesFromHome={() => setOpenTemplatesFromHome(false)}
                    onOpenSettings={() => setTab('profile')}
                    onToggleRestDay={isRestDay ? undoRestDay : logRestDay}
                    onQuickLogSet={quickLogSessionSet}
                    onStartSessionWithExercise={startSessionWithExercise}
                    onRepeatLastWorkout={repeatLastWorkout}
                    repeatLastWorkoutCount={lastWorkoutExerciseIds.length}
                  />
                </div>
<div className={`page ${!showAnalytics && !showPatterns && !showMuscleMap && tab === 'profile' ? 'active' : ''}`} aria-hidden={showAnalytics || showPatterns || showMuscleMap || tab !== 'profile'}>
                  <ProfileView
                    settings={settings}
                    setSettings={setSettings}
                    colorfulExerciseCards={colorfulExerciseCards}
                    onToggleColorfulExerciseCards={setColorfulExerciseCards}
                    onBack={() => setTab('home')}
                    onViewAnalytics={() => {
                      setShowPatterns(false);
                      setShowMuscleMap(false);
                      setShowAnalytics(true);
                    }}
                    onViewPatterns={() => {
                      setShowAnalytics(false);
                      setShowMuscleMap(false);
                      setShowPatterns(true);
                    }}
                    onViewMuscleMap={() => {
                      setShowAnalytics(false);
                      setShowPatterns(false);
                      setShowMuscleMap(true);
                    }}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                    onResetApp={handleReset}
                    onResetOnboarding={handleResetOnboarding}
                  />
                </div>
              </div>
            </div>

            {!showAnalytics && !showPatterns && !showMuscleMap && <TabBar currentTab={tab} setTab={setTab} onWorkoutTripleTap={() => setShowSpartan(true)} />}

            {activeEquipment && (
              <EquipmentDetailFixed
                id={activeEquipment}
                profile={profile}
                history={Array.isArray(effectiveHistory[activeEquipment]) ? effectiveHistory[activeEquipment] : []}
                settings={settings}
                onSave={handleSaveSession}
                onUpdateSessionLogs={updateSessionLogs}
                sessionLogs={activeSessionToday?.logsByExercise?.[activeEquipment] || []}
                onRequestUndo={showUndoToast}
                onShowToast={showToast}
                autoFocusInput={pendingAutoFocusExercise === activeEquipment}
                onAutoFocusComplete={() => setPendingAutoFocusExercise(null)}
                onClose={() => {
                  setActiveEquipment(null);
                  setPendingAutoFocusExercise(null);
                }}
              />
            )}

            {activeCardio && (
              <CardioLogger
                id={activeCardio}
                onUpdateSessionLogs={updateSessionLogs}
                sessionLogs={activeSessionToday?.logsByExercise?.[activeCardio] || []}
                history={Array.isArray(effectiveHistory[activeCardio]) ? effectiveHistory[activeCardio] : []}
                settings={settings}
                onClose={() => setActiveCardio(null)}
              />
            )}

            <MatrixWaterfall 
              show={showMatrix} 
              onClose={() => setShowMatrix(false)} 
            />

            <PowerUpEffect 
              show={showPowerUp} 
              onClose={() => setShowPowerUp(false)} 
            />

            <GloryEasterEgg 
              show={showGlory} 
              onClose={() => setShowGlory(false)} 
            />

            <SpartanKick 
              show={showSpartan} 
              onClose={() => setShowSpartan(false)} 
            />

            <ButDidYouDie 
              show={showButDidYouDie} 
              onClose={() => setShowButDidYouDie(false)}
              onConfirm={() => {
                setShowButDidYouDie(false);
                logRestDay();
              }}
            />

            <NiceToast show={showNice} />

            <PerfectWeek 
              show={showPerfectWeek} 
              onClose={() => setShowPerfectWeek(false)} 
            />
          </div>
        </>
      );
    };

    ReactDOM.render(
      React.createElement(App),
      document.getElementById('root'),
      () => {
        const loader = document.getElementById('ps-loading');
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => loader.remove(), 450);
        }
      }
    );
