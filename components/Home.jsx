    const HomeLockerWidget = () => {
      const [combo, setCombo] = usePersistedState('ps_locker_combo', '');
      const [gymCardImg, setGymCardImg] = usePersistedState('ps_locker_gymcard', '');
      const [expanded, setExpanded] = React.useState(false);
      const [showCombo, setShowCombo] = React.useState(false);
      const [activePanel, setActivePanel] = React.useState(null);
      const [tempCombo, setTempCombo] = React.useState('');
      const [cardFullscreen, setCardFullscreen] = React.useState(false);
      const fileInputRef = React.useRef(null);
      const comboInputRef = React.useRef(null);

      const handleInstagram = () => {
        window.location.href = 'instagram://camera';
        setTimeout(() => { window.location.href = 'https://www.instagram.com'; }, 1000);
      };

      const handleSaveCombo = () => {
        setCombo(tempCombo);
        setActivePanel(null);
      };

      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { setGymCardImg(ev.target.result); setActivePanel(null); };
        reader.readAsDataURL(file);
      };

      React.useEffect(() => {
        if (activePanel === 'combo' && comboInputRef.current) {
          setTimeout(() => comboInputRef.current?.focus(), 100);
        }
      }, [activePanel]);

      const dots = [combo, gymCardImg].filter(Boolean).length;

      const ROW_STYLE = {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 12px',
        background: 'var(--off-black)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        width: '100%',
      };

      const LABEL_STYLE = {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--muted)',
        fontWeight: 700,
      };

      const VALUE_STYLE = (active) => ({
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: active ? 'var(--yellow)' : 'var(--muted)',
        marginLeft: 'auto',
        letterSpacing: active ? '0.05em' : '0.25em',
      });

      const iconStyle = (active) => ({
        flexShrink: 0,
        color: active ? 'var(--yellow)' : 'var(--muted)',
      });

      return (
        <div className="home-section-card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* ── HEADER ── */}
          <button
            type="button"
            onClick={() => { setExpanded(e => !e); if (!expanded) setActivePanel(null); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)', fontWeight: 700 }}>LOCKER</span>
              {!expanded && dots > 0 && (
                <div style={{ display: 'flex', gap: 3, marginLeft: 2 }}>
                  {Array.from({ length: dots }).map((_, i) => (
                    <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--yellow)', display: 'inline-block' }} />
                  ))}
                </div>
              )}
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* ── EXPANDED ── */}
          {expanded && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>

              {/* ── ROW 1: LOCKER COMBO ── */}
              <div>
                <button
                  type="button"
                  onPointerDown={() => combo && activePanel !== 'combo' ? setShowCombo(true) : null}
                  onPointerUp={() => setShowCombo(false)}
                  onPointerLeave={() => setShowCombo(false)}
                  onClick={() => setActivePanel(activePanel === 'combo' ? null : 'combo')}
                  style={{
                    ...ROW_STYLE,
                    borderColor: activePanel === 'combo' ? 'var(--yellow)' : 'var(--border)',
                    background: activePanel === 'combo' ? 'rgba(250,204,21,0.06)' : 'var(--off-black)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(!!combo)}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span style={LABEL_STYLE}>Combo</span>
                  <span style={VALUE_STYLE(!!combo && showCombo)}>
                    {combo
                      ? (showCombo ? combo : '● ● ●')
                      : <span style={{ color: 'var(--border-bright)', fontSize: 9 }}>not set</span>
                    }
                  </span>
                </button>

                {activePanel === 'combo' && (
                  <div style={{ marginTop: 6, background: 'var(--black)', border: '1px solid var(--yellow)', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--yellow)', marginBottom: 8 }}>Locker combination</div>
                    <input
                      ref={comboInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9\-]*"
                      placeholder="e.g.  23 - 5 - 17"
                      value={tempCombo}
                      onChange={e => setTempCombo(e.target.value)}
                      style={{
                        width: '100%', background: 'var(--off-black)',
                        border: '1px solid var(--border-bright)', borderRadius: 4,
                        padding: '10px 12px', fontFamily: 'var(--font-mono)',
                        fontSize: 22, fontWeight: 700, textAlign: 'center',
                        letterSpacing: '0.2em', color: 'var(--white)', outline: 'none',
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={handleSaveCombo} style={{ flex: 1, background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 4, padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>Save</button>
                      {combo && <button onClick={() => { setCombo(''); setActivePanel(null); }} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>Clear</button>}
                      <button onClick={() => setActivePanel(null)} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>✕</button>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', textAlign: 'center', marginTop: 8, letterSpacing: '0.1em' }}>Hold the row above to peek at your combo</div>
                  </div>
                )}
              </div>

              {/* ── ROW 2: GYM CARD ── */}
              <div>
                <button
                  type="button"
                  onClick={() => gymCardImg ? setCardFullscreen(true) : setActivePanel(activePanel === 'card' ? null : 'card')}
                  style={{
                    ...ROW_STYLE,
                    borderColor: activePanel === 'card' ? 'var(--yellow)' : 'var(--border)',
                    background: activePanel === 'card' ? 'rgba(250,204,21,0.06)' : 'var(--off-black)',
                    overflow: 'hidden',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle(!!gymCardImg)}>
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                  <span style={LABEL_STYLE}>Gym Card</span>
                  {gymCardImg ? (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={gymCardImg} alt="" style={{ height: 28, width: 44, objectFit: 'cover', borderRadius: 3, opacity: 0.85 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--yellow)', letterSpacing: '0.1em' }}>tap to scan</span>
                    </div>
                  ) : (
                    <span style={{ ...VALUE_STYLE(false), letterSpacing: '0.05em' }}>
                      <span style={{ color: 'var(--border-bright)', fontSize: 9 }}>not set</span>
                    </span>
                  )}
                </button>

                {activePanel === 'card' && (
                  <div style={{ marginTop: 6, background: 'var(--black)', border: '1px solid var(--yellow)', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--yellow)', marginBottom: 6 }}>Membership card screenshot</div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>
                      Screenshot your gym's membership screen (Club Pass, barcode, QR code), then save it here. Tap the row to go full-screen for scanning.
                    </p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 4, padding: '8px 0', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer' }}>Choose Screenshot</button>
                      {gymCardImg && <button onClick={() => { setGymCardImg(''); setActivePanel(null); }} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>Clear</button>}
                      <button onClick={() => setActivePanel(null)} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── ROW 3: INSTAGRAM ── */}
              <button
                type="button"
                onClick={handleInstagram}
                style={{ ...ROW_STYLE }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="igG" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#833ab4"/>
                      <stop offset="50%" stopColor="#fd1d1d"/>
                      <stop offset="100%" stopColor="#fcb045"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igG)"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#igG)"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#igG)"/>
                </svg>
                <span style={LABEL_STYLE}>Post the Proof</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>open camera →</span>
              </button>

            </div>
          )}

          {/* ── FULLSCREEN GYM CARD ── */}
          {cardFullscreen && (
            <div
              onClick={() => setCardFullscreen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 9998, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            >
              <img src={gymCardImg} alt="Gym card" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 12, objectFit: 'contain' }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
                <button
                  onClick={e => { e.stopPropagation(); setActivePanel('card'); setCardFullscreen(false); setExpanded(true); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Replace
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>tap anywhere to close</span>
              </div>
            </div>
          )}

        </div>
      );
    };

const Home = ({
  profile,
  lastWorkoutLabel,
  lastSessionSummary,
  lastSessionShortLabel,
  lastSessionDetail,
  suggestedFocus,
  dayEntries,
  lastWorkoutDate,
  onStartWorkout,
  homeQuote,
  coachMessage,
  isRestDay,
  sessionIntent,
  onLogRestDay,
  onUndoRestDay,
  onTriggerGlory,
  onLongPressRestDay,
  onOpenTemplatesFromHome,
  onOpenHistoryFromHome,
  onOpenSettingsFromHome
}) => {
  const longPressTimerRef = useRef(null);
  const restDayTimerRef = useRef(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isHoldingRestDay, setIsHoldingRestDay] = useState(false);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (restDayTimerRef.current) clearTimeout(restDayTimerRef.current);
    };
  }, []);

  const handleAvatarTouchStart = () => {
    setIsHolding(true);
    longPressTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      onTriggerGlory();
    }, 1500);
  };

  const handleAvatarTouchEnd = () => {
    setIsHolding(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleRestDayTouchStart = (e) => {
    if (isRestDay) return;
    e.preventDefault();
    setIsHoldingRestDay(true);
    restDayTimerRef.current = setTimeout(() => {
      setIsHoldingRestDay(false);
      onLongPressRestDay();
    }, 2000);
  };

  const handleRestDayTouchEnd = () => {
    setIsHoldingRestDay(false);
    if (restDayTimerRef.current) {
      clearTimeout(restDayTimerRef.current);
      restDayTimerRef.current = null;
    }
  };

  const handleRestDayClick = () => {
    if (restDayTimerRef.current) {
      clearTimeout(restDayTimerRef.current);
      restDayTimerRef.current = null;
    }
    if (!isHoldingRestDay) {
      if (isRestDay) {
        onUndoRestDay();
      } else {
        onLogRestDay();
      }
    }
  };

  const handleHomeTemplatesClick = () => {
    onOpenTemplatesFromHome?.();
  };

  const handleHomeLastSessionClick = () => {
    onOpenHistoryFromHome?.();
  };

  const homeStartSubtext = 'Plan your workout in seconds.';

  const muscleGroups = useMemo(() => ([
    { label: 'Chest', key: 'chest' },
    { label: 'Back', key: 'back' },
    { label: 'Legs', key: 'legs' },
    { label: 'Core', key: 'core' },
    { label: 'Arms', key: 'arms' },
    { label: 'Shoulders', key: 'shoulders' }
  ]), []);

  return (
    <div className="flex flex-col h-full bg-gray-50 home-screen">
      <div className="ps-hero-header sticky top-0 z-20">
        <div className="ps-hero-header__inner">
          <div className="ps-hero-header__left">
            <div className="ps-hero-header__brand select-none">PLANET STRENGTH</div>
            <div className="ps-hero-header__welcome">
              Welcome back, <span className="ps-hero-header__name">{profile.username || 'Athlete'}.</span>
            </div>
          </div>
          <div className="ps-hero-header__icons">
            <button
              type="button"
              onClick={handleRestDayClick}
              onTouchStart={handleRestDayTouchStart}
              onTouchEnd={handleRestDayTouchEnd}
              onMouseDown={handleRestDayTouchStart}
              onMouseUp={handleRestDayTouchEnd}
              onMouseLeave={handleRestDayTouchEnd}
              className="ps-nav-icon-btn"
              style={{ transform: isHoldingRestDay ? 'scale(0.9)' : 'scale(1)', transition: 'all 0.1s ease' }}
              title={isRestDay ? 'Undo rest day' : 'Log rest day'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            </button>
            <button
              type="button"
              className="ps-nav-icon-btn"
              onClick={onOpenSettingsFromHome}
              title="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <div
              className="ps-nav-icon-btn ps-nav-icon-btn--avatar"
              style={{
                transform: isHolding ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.1s ease'
              }}
              onTouchStart={handleAvatarTouchStart}
              onTouchEnd={handleAvatarTouchEnd}
              onMouseDown={handleAvatarTouchStart}
              onMouseUp={handleAvatarTouchEnd}
              onMouseLeave={handleAvatarTouchEnd}
              title="Profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 home-content ps-home-scroll">
        <div className="ps-home-stack">
          <button onClick={onStartWorkout} className="home-primary-button ps-cta-btn card-enter">
            Build Today's Workout
          </button>
          <div className="ps-mini-tiles">
            <button type="button" className="home-mini-tile" onClick={handleHomeTemplatesClick}>
              <div className="home-mini-label">Quick Start</div>
              <div className="home-mini-title">Templates</div>
              <div className="home-mini-accent">Start</div>
              <div className="home-mini-subtitle">Without Thinking</div>
            </button>
            <button type="button" className="home-mini-tile" onClick={handleHomeLastSessionClick}>
              <div className="home-mini-label">Previous</div>
              <div className="home-mini-title">Last Session</div>
              <div className="home-lastsession-top">
                {lastSessionShortLabel || lastWorkoutLabel || '—'}
              </div>
              <div className="home-lastsession-bottom">
                {lastSessionDetail || '—'}
              </div>
            </button>
          </div>
          {homeQuote && (
            <div className="home-section-card home-quote">
              <div className="home-section-title">Inspiration</div>
              <div className="quote-block">
                <p className="quote-text">“{homeQuote.text}”</p>
                <p className="quote-meta">— {homeQuote.movie}</p>
              </div>
            </div>
          )}

          {/* ===== LOCKER WIDGET ===== */}
          <HomeLockerWidget />

          {/* ===== MANIFESTO LIST ===== */}
          <div className="ps-manifesto-list">
            <div className="ps-manifesto-list__label">Built by Nobody.</div>
            {COPY_TICKER.map((item, i) => (
              <div key={i} className="ps-manifesto-list__item">
                <span className="ps-manifesto-list__dot" />
                <span className={i % 2 === 0 ? 'ps-manifesto-list__item--hi' : ''}>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
