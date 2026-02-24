// ========== ONBOARDING COMPONENTS ==========
// First-time user setup flow.
// Only shown once — after setup these sit in memory unused.
// Extracted from script.js for clarity and future lazy-loading potential.
// Depends on: COPY_ONBOARDING_STEPS (data/copy.js), AVATARS (data/constants.js), Icon (components/Icon.jsx)

const OnboardingProgress = ({ step, total }) => (
  <div className="onboarding-progress">
    {[...Array(total)].map((_, idx) => (
      <div key={idx} className={`dot ${idx <= step ? 'active' : ''}`} />
    ))}
    <span className="text-xs font-semibold text-gray-500">{step + 1} / {total}</span>
  </div>
);

const OnboardingCardShell = ({ children, step, total, onSkip }) => (
  <div className="onboarding-card animate-slide-up">
    <div className="flex items-start justify-between">
      <OnboardingProgress step={step} total={total} />
      {onSkip && <button className="ghost-button text-sm" onClick={onSkip}>Skip</button>}
    </div>
    {children}
  </div>
);

const OnboardingIntro = ({ title, subhead, body, step, total, onNext, onSkip, emoji }) => (
  <OnboardingCardShell step={step} total={total} onSkip={onSkip}>
    <div className="flex flex-col items-center text-center gap-3 flex-1">
      <div className="onboarding-hero">{emoji}</div>
      <h1 className="onboarding-title">{title}</h1>
      {subhead && <p className="onboarding-subhead">{subhead}</p>}
      <p className="onboarding-body">{body}</p>
    </div>
    <div className="onboarding-actions">
      <button className="ghost-button" onClick={onSkip}>Skip</button>
      <button className="accent-button" onClick={onNext}>Next</button>
    </div>
  </OnboardingCardShell>
);

const OnboardingForm = ({ profile, setProfile, onComplete, onBack, step, total }) => {
  const canStart = profile.username && profile.avatar && profile.workoutLocation;
  const locationOptions = [
    { id: 'gym', label: 'Gym', detail: 'Commercial gym or studio', gymType: 'commercial' },
    { id: 'home', label: 'Home', detail: 'Garage, apartment, or backyard', gymType: 'home' },
    { id: 'other', label: 'Other', detail: 'Travel or mixed', gymType: 'commercial' },
  ];

  return (
    <OnboardingCardShell step={step} total={total}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-gray-500 uppercase">Quick setup</div>
        {onBack && <button className="ghost-button text-sm" onClick={onBack}>Back</button>}
      </div>
      <div className="space-y-3 flex-1 flex flex-col">
        <div className="form-tile">
          <label className="field-label">Name</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="input-surface"
              placeholder="Your name"
            />
          </div>

        <div className="form-tile">
          <label className="field-label">Emoji avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setProfile({ ...profile, avatar: a })}
                  className={`p-3 rounded-xl text-2xl border ${profile.avatar === a ? 'border-purple-400 bg-purple-50' : 'bg-gray-50 border-gray-200'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

        <div className="form-tile">
          <label className="field-label">Where are you working out?</label>
          <div className="flex items-stretch justify-center gap-2">
            {locationOptions.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setProfile({ ...profile, workoutLocation: loc.id, gymType: loc.gymType })}
                className={`flex-1 min-w-0 rounded-xl border-2 px-3 py-3 text-center transition-all flex flex-col items-center gap-1 ${
                  profile.workoutLocation === loc.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-xl">{loc.id === 'gym' ? '🏋️' : loc.id === 'home' ? '🏠' : '🧳'}</div>
                <div className={`text-sm font-bold ${profile.workoutLocation === loc.id ? 'text-purple-700' : 'text-gray-900'}`}>{loc.label}</div>
                <div className="text-[11px] text-gray-500 leading-snug">{loc.detail}</div>
                {profile.workoutLocation === loc.id && <Icon name="Check" className="w-4 h-4 text-purple-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="onboarding-actions">
        <button
          onClick={() => { if (canStart) onComplete(); }}
          disabled={!canStart}
          className="accent-button"
        >
          Start Tracking
        </button>
      </div>
    </OnboardingCardShell>
  );
};

const OnboardingFlow = ({ profile, setProfile, onFinish }) => {
  const [step, setStep] = useState(0);
  const steps = COPY_ONBOARDING_STEPS;
  const total = steps.length;

  return (
    <div className="onboarding-shell">
      {steps[step].type === 'intro' ? (
        <OnboardingIntro
          title={steps[step].title}
          subhead={steps[step].subhead}
          body={steps[step].body}
          emoji={steps[step].emoji}
          step={step}
          total={total}
          onSkip={() => setStep(total - 1)}
          onNext={() => setStep(Math.min(step + 1, total - 1))}
        />
      ) : (
        <OnboardingForm
          profile={profile}
          setProfile={setProfile}
          onComplete={onFinish}
          onBack={() => setStep((prev) => Math.max(prev - 1, 0))}
          step={step}
          total={total}
        />
      )}
    </div>
  );
};
