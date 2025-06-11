import { useState } from 'react';
import './App.css';
import LEOSatelliteCoverage from './LEOSatelliteCoverage';
import SelectOrbits from './select';
export type orbitsType = {
  inclination: number;
  radius: number;
  color: string;
  count: number;
}
const orbits: orbitsType[] = [
  { inclination: 0, radius: 120, color: 'green', count: 5 },
  { inclination: 30, radius: 140, color: 'yellow', count: 5 },
  { inclination: 90, radius: 160, color: 'red', count: 5 },
  { inclination: 98, radius: 180, color: 'orange', count: 5 },
  { inclination: 63.4, radius: 130, color: 'purple', count: 4 },
];
function App() {
  const [orbitsAndSatellites, setOrbitsAndSatellites] = useState<orbitsType[]>(orbits)
  return (
    <div className='app'>
      <LEOSatelliteCoverage orbitsAndSatellites={orbitsAndSatellites} />
      <SelectOrbits setOrbitsAndSatellites={setOrbitsAndSatellites} orbitsAndSatellites={orbitsAndSatellites} />
    </div>
  )
}

export default App
