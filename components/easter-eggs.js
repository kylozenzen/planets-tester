// ========== EASTER EGG COMPONENTS ==========
// Self-contained celebration / joke modals.
// None of these share app state — they receive show + onClose only.
// Extracted from script.js for performance and clarity.

const MatrixWaterfall = ({ show, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black" onClick={onClose}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="text-2xl font-mono text-green-400"
          style={{ textShadow: '0 0 20px rgba(0,255,0,0.8)', opacity: 0.7, animation: 'fadeIn 2s' }}
        >
          Wake up, Neo...
        </div>
      </div>
    </div>
  );
};

const PowerUpEffect = ({ show, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-90"></div>

      <div className="relative z-10 text-center">
        <div
          className="text-7xl font-black mb-4"
          style={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255,215,0,0.8)',
            animation: 'powerPulse 0.5s infinite alternate'
          }}
        >
          IT'S OVER 9000!
        </div>
        <div className="text-2xl text-yellow-400 font-bold">
          ⚡ POWER LEVEL: MAXIMUM ⚡
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          animation: 'auraExpand 1.5s ease-out infinite'
        }}
      ></div>

      <style>{`
        @keyframes powerPulse {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes auraExpand {
          from { transform: scale(0.8); opacity: 0.8; }
          to { transform: scale(1.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

const GloryEasterEgg = ({ show, onClose }) => {
  const [phase, setPhase] = useState(0);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!show) {
      setPhase(0);
      setConfetti([]);
      return;
    }

    const timer1 = setTimeout(() => setPhase(1), 300);
    const timer2 = setTimeout(() => {
      setPhase(2);
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotate: Math.random() * 360,
        color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(newConfetti);
    }, 1800);

    const timer3 = setTimeout(onClose, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <div className="text-center px-8">
        {phase >= 1 && (
          <div
            className="text-4xl font-black text-white mb-4"
            style={{
              animation: 'slideDown 0.5s ease-out',
              textShadow: '0 0 20px rgba(255,215,0,0.5)'
            }}
          >
            Press it...
          </div>
        )}

        {phase >= 2 && (
          <div
            className="text-5xl font-black mb-2"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'slideUp 0.6s ease-out, gloryPulse 2s ease-in-out infinite',
              textShadow: '0 0 30px rgba(255,215,0,0.8)'
            }}
          >
            Press it for GLORY!
          </div>
        )}

        {phase >= 2 && (
          <div
            className="text-lg text-gray-400 font-semibold"
            style={{ animation: 'fadeIn 1s ease-in' }}
          >
            — Barney Stinson
          </div>
        )}
      </div>

      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: c.x + '%',
            top: '-20px',
            backgroundColor: c.color,
            animation: `fall ${c.duration}s linear ${c.delay}s forwards`,
            transform: `rotate(${c.rotate}deg)`,
            boxShadow: `0 0 10px ${c.color}`
          }}
        />
      ))}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gloryPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fall {
          to { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const SpartanKick = ({ show, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-stone-800 to-red-900 opacity-95"></div>

      <div className="relative z-10 text-center" style={{ animation: 'kickImpact 0.5s ease-out' }}>
        <div className="text-8xl mb-4">🗡️</div>
        <div
          className="text-7xl font-black mb-4 text-red-600"
          style={{
            textShadow: '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000',
            animation: 'spartanShake 0.5s ease-in-out'
          }}
        >
          THIS IS SPARTA!
        </div>
        <div className="text-2xl text-amber-400 font-bold" style={{ textShadow: '2px 2px 4px #000' }}>
          ⚔️ TONIGHT WE LIFT IN GLORY ⚔️
        </div>
      </div>

      <style>{`
        @keyframes kickImpact {
          0% { transform: translateX(-100vw); }
          60% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        @keyframes spartanShake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

const ButDidYouDie = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-80" onClick={onClose}></div>

      <div className="relative z-10 bg-gray-900 rounded-3xl p-8 max-w-sm mx-4 border-4 border-purple-500">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💀</div>
          <div className="text-4xl font-black text-white mb-2">BUT DID YOU DIE?</div>
          <div className="text-sm text-gray-400">Rest is important, but so is consistency...</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl font-bold active:scale-95"
          >
            Nevermind
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold active:scale-95"
          >
            Log Rest Day
          </button>
        </div>
      </div>
    </div>
  );
};

const NiceToast = ({ show }) => {
  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 bg-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
      style={{ animation: 'niceSlide 2s ease-in-out' }}
    >
      Nice 😎
      <style>{`
        @keyframes niceSlide {
          0% { transform: translate(-50%, 100px); opacity: 0; }
          20% { transform: translate(-50%, 0); opacity: 1; }
          80% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, 100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const PerfectWeek = ({ show, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-95"></div>

      <div className="relative z-10 text-center">
        <div className="text-7xl mb-6">🎩</div>
        <div
          className="text-6xl font-black mb-4"
          style={{
            background: 'linear-gradient(45deg, #FFD700, #FF1493, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'perfectPulse 1s ease-in-out infinite'
          }}
        >
          YOU JUST PULLED
        </div>
        <div
          className="text-7xl font-black mb-4"
          style={{
            background: 'linear-gradient(135deg, #4169E1, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255,215,0,0.8)'
          }}
        >
          A BARNEY!
        </div>
        <div className="text-3xl text-white font-bold mb-2">✋ PERFECT WEEK ✋</div>
        <div className="text-xl text-purple-300">7 days, 7 workouts. Legendary.</div>
      </div>

      <style>{`
        @keyframes perfectPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};
