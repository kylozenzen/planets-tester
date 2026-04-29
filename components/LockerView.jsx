    const LockerView = () => {
      const [combo, setCombo] = usePersistedState('ps_locker_combo', '');
      const [barcode, setBarcode] = usePersistedState('ps_locker_barcode', '');
      const [gymApp, setGymApp] = usePersistedState('ps_locker_gymapp', '');
      const [gymAppUrl, setGymAppUrl] = usePersistedState('ps_locker_gymappurl', '');
      const [showCombo, setShowCombo] = React.useState(false);
      const [editingCombo, setEditingCombo] = React.useState(false);
      const [editingBarcode, setEditingBarcode] = React.useState(false);
      const [editingGymApp, setEditingGymApp] = React.useState(false);
      const [barcodeFullscreen, setBarcodeFullscreen] = React.useState(false);
      const [tempCombo, setTempCombo] = React.useState('');
      const [tempBarcode, setTempBarcode] = React.useState('');
      const [tempGymApp, setTempGymApp] = React.useState('');
      const [tempGymAppUrl, setTempGymAppUrl] = React.useState('');
      const barcodeRef = React.useRef(null);
      const barcodeFullRef = React.useRef(null);

      // Render barcode using canvas
      const drawBarcode = (canvas, value) => {
        if (!canvas || !value) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);

        // Simple Code39-style barcode renderer
        const chars = value.toUpperCase().split('');
        const barWidth = Math.floor(w / (chars.length * 12 + 4));
        if (barWidth < 1) return;
        
        // Encode each char as alternating black/white bars (simplified visual)
        const encode = (c) => {
          const code = c.charCodeAt(0);
          return [
            (code >> 6) & 1, (code >> 5) & 1, (code >> 4) & 1,
            (code >> 3) & 1, (code >> 2) & 1, (code >> 1) & 1, code & 1,
            1, 0, 0
          ];
        };
        
        let x = barWidth * 2;
        ctx.fillStyle = '#000';
        
        // Start bar
        ctx.fillRect(x, 0, barWidth, h - 16);
        x += barWidth * 2;
        
        chars.forEach(c => {
          const bits = encode(c);
          bits.forEach(bit => {
            if (bit) ctx.fillRect(x, 0, barWidth, h - 16);
            x += barWidth;
          });
          x += barWidth; // gap between chars
        });
        
        // End bar
        ctx.fillRect(x, 0, barWidth, h - 16);
        
        // Draw text
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(10, h * 0.1)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(value, w / 2, h - 2);
      };

      React.useEffect(() => {
        if (barcodeRef.current && barcode) {
          drawBarcode(barcodeRef.current, barcode);
        }
      }, [barcode, barcodeRef.current]);

      React.useEffect(() => {
        if (barcodeFullRef.current && barcode && barcodeFullscreen) {
          setTimeout(() => drawBarcode(barcodeFullRef.current, barcode), 50);
        }
      }, [barcode, barcodeFullscreen]);

      const handleGymAppLaunch = () => {
        if (!gymAppUrl) return;
        window.location.href = gymAppUrl;
      };

      const handleInstagram = () => {
        window.location.href = 'instagram://camera';
        setTimeout(() => {
          window.location.href = 'https://www.instagram.com';
        }, 1000);
      };

      const GYM_APP_PRESETS = [
        { label: 'Planet Fitness', url: 'planetfitness://' },
        { label: 'LA Fitness', url: 'laf://' },
        { label: 'Anytime Fitness', url: 'anytimefitness://' },
        { label: 'YMCA', url: 'ymca://' },
        { label: 'Custom…', url: '' },
      ];

      return (
        <div className="flex flex-col h-full overflow-y-auto pb-24" style={{ background: 'var(--background)' }}>
          {/* Header */}
          <div className="px-5 pt-12 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <span style={{ fontSize: 28 }}>🔒</span>
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Bebas Neue', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>LOCKER</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your gym essentials, one tap away.</p>
          </div>

          <div className="px-4 flex flex-col gap-4">

            {/* LOCKER COMBO */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>🔢</span>
                  <span className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Locker Combo</span>
                </div>
                <button
                  onClick={() => { setEditingCombo(true); setTempCombo(combo); }}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'var(--accent)', color: '#000' }}
                >
                  {combo ? 'Edit' : 'Set'}
                </button>
              </div>

              {editingCombo ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="e.g. 23-5-17 or 1234"
                    value={tempCombo}
                    onChange={e => setTempCombo(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-xl font-mono font-bold text-center"
                    style={{ background: 'var(--background)', border: '2px solid var(--accent)', color: 'var(--text-primary)', outline: 'none' }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCombo(tempCombo); setEditingCombo(false); }}
                      className="flex-1 py-2 rounded-xl font-bold text-sm"
                      style={{ background: 'var(--accent)', color: '#000' }}
                    >Save</button>
                    <button
                      onClick={() => setEditingCombo(false)}
                      className="flex-1 py-2 rounded-xl font-bold text-sm"
                      style={{ background: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                    >Cancel</button>
                  </div>
                </div>
              ) : combo ? (
                <div
                  className="flex items-center justify-center rounded-xl py-4 cursor-pointer select-none"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  onPointerDown={() => setShowCombo(true)}
                  onPointerUp={() => setShowCombo(false)}
                  onPointerLeave={() => setShowCombo(false)}
                >
                  {showCombo ? (
                    <span className="text-4xl font-mono font-black" style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}>{combo}</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl tracking-widest" style={{ color: 'var(--text-secondary)' }}>{'● '.repeat(Math.min(combo.length, 8)).trim()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  Tap "Set" to store your locker combination
                </div>
              )}
              {combo && !editingCombo && (
                <p className="text-center text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Hold to reveal</p>
              )}
            </div>

            {/* MEMBERSHIP BARCODE */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>🎫</span>
                  <span className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Membership Card</span>
                </div>
                <button
                  onClick={() => { setEditingBarcode(true); setTempBarcode(barcode); }}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'var(--accent)', color: '#000' }}
                >
                  {barcode ? 'Edit' : 'Set'}
                </button>
              </div>

              {editingBarcode ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter your member ID or barcode number"
                    value={tempBarcode}
                    onChange={e => setTempBarcode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl px-4 py-3 text-lg font-mono font-bold text-center"
                    style={{ background: 'var(--background)', border: '2px solid var(--accent)', color: 'var(--text-primary)', outline: 'none' }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setBarcode(tempBarcode); setEditingBarcode(false); }}
                      className="flex-1 py-2 rounded-xl font-bold text-sm"
                      style={{ background: 'var(--accent)', color: '#000' }}
                    >Save</button>
                    <button
                      onClick={() => setEditingBarcode(false)}
                      className="flex-1 py-2 rounded-xl font-bold text-sm"
                      style={{ background: 'var(--background)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                    >Cancel</button>
                  </div>
                </div>
              ) : barcode ? (
                <div
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: '#fff', padding: '12px 8px 4px' }}
                  onClick={() => setBarcodeFullscreen(true)}
                >
                  <canvas ref={barcodeRef} width={320} height={80} style={{ width: '100%', display: 'block' }} />
                  <p className="text-center text-xs mt-1 pb-1" style={{ color: '#666' }}>Tap to expand for scanning</p>
                </div>
              ) : (
                <div className="text-center py-3" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  Tap "Set" to store your membership barcode number
                </div>
              )}
            </div>

            {/* QUICK LAUNCH */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 18 }}>⚡</span>
                <span className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Quick Launch</span>
              </div>
              <div className="flex flex-col gap-3">
                {/* Gym App */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGymAppLaunch}
                    disabled={!gymAppUrl}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                    style={{
                      background: gymAppUrl ? 'var(--accent)' : 'var(--background)',
                      color: gymAppUrl ? '#000' : 'var(--text-secondary)',
                      border: gymAppUrl ? 'none' : '1px solid var(--border)',
                      opacity: gymAppUrl ? 1 : 0.7
                    }}
                  >
                    <span>🏋️</span>
                    <span>{gymApp || 'Gym App'}</span>
                  </button>
                  <button
                    onClick={() => { setEditingGymApp(true); setTempGymApp(gymApp); setTempGymAppUrl(gymAppUrl); }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  >⚙️</button>
                </div>

                {editingGymApp && (
                  <div className="flex flex-col gap-3 p-3 rounded-xl" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Select gym or enter custom</p>
                    <div className="flex flex-wrap gap-2">
                      {GYM_APP_PRESETS.map(p => (
                        <button
                          key={p.label}
                          onClick={() => { if (p.url) { setTempGymApp(p.label); setTempGymAppUrl(p.url); } }}
                          className="text-xs px-3 py-1.5 rounded-full font-semibold"
                          style={{
                            background: tempGymApp === p.label ? 'var(--accent)' : 'var(--surface)',
                            color: tempGymApp === p.label ? '#000' : 'var(--text-primary)',
                            border: '1px solid var(--border)'
                          }}
                        >{p.label}</button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="App name"
                      value={tempGymApp}
                      onChange={e => setTempGymApp(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm font-mono"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="Deep link URL (e.g. planetfitness://)"
                      value={tempGymAppUrl}
                      onChange={e => setTempGymAppUrl(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm font-mono"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setGymApp(tempGymApp); setGymAppUrl(tempGymAppUrl); setEditingGymApp(false); }}
                        className="flex-1 py-2 rounded-xl font-bold text-sm"
                        style={{ background: 'var(--accent)', color: '#000' }}
                      >Save</button>
                      <button
                        onClick={() => setEditingGymApp(false)}
                        className="flex-1 py-2 rounded-xl font-bold text-sm"
                        style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >Cancel</button>
                    </div>
                  </div>
                )}

                {/* Instagram Camera */}
                <button
                  onClick={handleInstagram}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm w-full"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff' }}
                >
                  <span>📸</span>
                  <span>Post the Proof</span>
                </button>
              </div>
            </div>

          </div>

          {/* BARCODE FULLSCREEN MODAL */}
          {barcodeFullscreen && (
            <div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center"
              style={{ background: '#fff' }}
              onClick={() => setBarcodeFullscreen(false)}
            >
              <p className="text-xs mb-4" style={{ color: '#999', fontFamily: 'Space Mono' }}>Tap anywhere to close</p>
              <canvas
                ref={barcodeFullRef}
                width={340}
                height={160}
                style={{ width: '90vw', maxWidth: 400, display: 'block' }}
              />
              <p className="text-sm mt-4 font-mono font-bold" style={{ color: '#222' }}>{barcode}</p>
            </div>
          )}
        </div>
      );
    };
