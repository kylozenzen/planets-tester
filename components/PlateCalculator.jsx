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

    // ========== PROGRESS TAB ==========
