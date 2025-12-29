import { useState } from 'react';

const flowers = [
  { id: 1, name: '🌸 Роза', intervalNumber: 2, intervalUnit: 'hours', duration: 5 },
  { id: 2, name: '🌺 Орхидея', intervalNumber: 3, intervalUnit: 'hours', duration: 3 },
  { id: 3, name: '🌻 Подсолнух', intervalNumber: 1, intervalUnit: 'hours', duration: 8 },
  { id: 4, name: '🌿 Фикус', intervalNumber: 1, intervalUnit: 'days', duration: 4 }
];

function App() {
  const [connected, setConnected] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [flowerSettings, setFlowerSettings] = useState([...flowers]);
  const [selectedFlower, setSelectedFlower] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const connect = () => {
    setConnected(true);
    console.log('BLE Demo: AutoWaterESP32 подключён!');
  };

  const toggleRelay = (id) => {
    console.log(`R${id}ON → Реле ${id} КЛИК! (nRF Connect тест)`);
  };

  const toggleAuto = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);
    console.log(newMode ? 'AUTO' : 'MANUAL');
  };

  const openSettings = (index) => {
    setSelectedFlower(index);
    setShowSettings(true);
  };

  const closeSettings = () => setShowSettings(false);

  const saveFlowerSettings = () => {
    const settings = flowerSettings[selectedFlower];
    const intervalSeconds = settings.intervalUnit === 'days' 
      ? settings.intervalNumber * 86400 
      : settings.intervalNumber * 3600;
    console.log(`SET${selectedFlower + 1}:${intervalSeconds}:${settings.duration}`);
    alert(`✅ Сохранено на ESP32!\n${settings.intervalNumber} ${settings.intervalUnit} × ${settings.duration}с`);
    closeSettings();
  };

  const updateIntervalNumber = (value) => {
    const newSettings = [...flowerSettings];
    newSettings[selectedFlower].intervalNumber = parseInt(value) || 1;
    setFlowerSettings(newSettings);
  };

  const updateIntervalUnit = (unit) => {
    const newSettings = [...flowerSettings];
    newSettings[selectedFlower].intervalUnit = unit;
    setFlowerSettings(newSettings);
  };

  const updateDuration = (value) => {
    const newSettings = [...flowerSettings];
    newSettings[selectedFlower].duration = parseInt(value) || 1;
    setFlowerSettings(newSettings);
  };

  const currentFlower = flowerSettings[selectedFlower] || flowers[0];

  return (
    <div style={{ 
      padding: '20px', maxWidth: '400px', margin: 'auto', 
      fontFamily: 'system-ui', background: '#f5f5f5', minHeight: '100vh' 
    }}>
      <h1 style={{textAlign: 'center', color: '#228B22', fontSize: '28px'}}>🌱 Автополив</h1>
      <p style={{textAlign: 'center', color: '#666', fontSize: '14px'}}>
        React + ESP32 BLE + nRF Connect
      </p>
      
      {!connected ? (
        <div style={{textAlign: 'center'}}>
          <button onClick={connect} style={{
            width: '100%', padding: '20px', fontSize: '20px', 
            background: '#4CAF50', color: 'white', border: 'none', 
            borderRadius: '15px', cursor: 'pointer', marginBottom: '10px'
          }}>
            🔗 Подключить ESP32
          </button>
          <p style={{fontSize: '12px', color: '#999'}}>
            nRF Connect: AutoWaterESP32 → R1ON
          </p>
        </div>
      ) : (
        <>
          <button onClick={toggleAuto} style={{
            width: '100%', padding: '15px', fontSize: '18px',
            background: autoMode ? '#f44336' : '#FF9800',
            color: 'white', border: 'none', borderRadius: '10px', marginBottom: '20px'
          }}>
            {autoMode ? '🔧 Ручной режим' : '🤖 Автоматический режим'}
          </button>

          {flowers.map((flower, index) => (
            <div key={flower.id} style={{
              background: 'white', padding: '15px', borderRadius: '10px', 
              marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{margin: 0, color: '#228B22'}}>{flower.name}</h3>
                <button onClick={() => openSettings(index)} style={{
                  padding: '8px 12px', background: '#2196F3', color: 'white',
                  border: 'none', borderRadius: '5px', fontSize: '12px', cursor: 'pointer'
                }}>
                  ⚙️
                </button>
              </div>
              <button onClick={() => toggleRelay(index + 1)} style={{
                width: '100%', padding: '12px', marginTop: '10px',
                background: '#4CAF50', color: 'white', fontSize: '16px',
                border: 'none', borderRadius: '8px', cursor: 'pointer'
              }}>
                💧 Полить сейчас
              </button>
              <div style={{marginTop: '8px', fontSize: '14px', color: '#666'}}>
                ⏰ {flower.intervalNumber} {flower.intervalUnit}
              </div>
            </div>
          ))}
        </>
      )}

      {showSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '25px', borderRadius: '15px', 
            maxWidth: '90%', maxHeight: '80vh', width: '350px', overflow: 'auto'
          }}>
            <h2 style={{marginTop: 0}}>{flowers[selectedFlower]?.name} ⚙️</h2>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                Интервал полива:
              </label>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <input 
                  type="number" min="1" max="30" 
                  value={currentFlower.intervalNumber}
                  onChange={(e) => updateIntervalNumber(e.target.value)}
                  style={{
                    flex: 1, padding: '12px', border: '1px solid #ddd', 
                    borderRadius: '5px', fontSize: '16px'
                  }}
                />
                <select 
                  value={currentFlower.intervalUnit}
                  onChange={(e) => updateIntervalUnit(e.target.value)}
                  style={{
                    padding: '12px', border: '1px solid #ddd', 
                    borderRadius: '5px', fontSize: '16px'
                  }}
                >
                  <option value="hours">часов</option>
                  <option value="days">дней</option>
                </select>
              </div>
            </div>

            <div style={{marginBottom: '25px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                Длительность полива:
              </label>
              <input 
                type="range" min="1" max="60" step="1"
                value={currentFlower.duration}
                onChange={(e) => updateDuration(e.target.value)}
                style={{width: '100%', height: '8px', borderRadius: '5px'}}
              />
              <div style={{textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#228B22'}}>
                {currentFlower.duration} секунд
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={saveFlowerSettings} style={{
                flex: 1, padding: '15px', background: '#4CAF50', 
                color: 'white', border: 'none', borderRadius: '10px', 
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
              }}>
                💾 Сохранить на ESP32
              </button>
              <button onClick={closeSettings} style={{
                flex: 1, padding: '15px', background: '#f44336', 
                color: 'white', border: 'none', borderRadius: '10px', 
                fontSize: '16px', cursor: 'pointer'
              }}>
                ❌ Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
