import React, { useState } from "react";
import "./LEOSatelliteCoverage.css";

const LEOSatelliteCoverage: React.FC = () => {
    const [area, setArea] = useState(448978); // O'zbekiston maydoni, km²
    const [radius, setRadius] = useState(1000); // Qamrov radiusi, km
    const [efficiency, setEfficiency] = useState(0.6); // 60%
    const [kFactor, setKFactor] = useState(24); // Ko‘paytiruvchi
    const [result, setResult] = useState<number | null>(null);
    const [renderId, setRenderId] = useState(0); // SVG yangilanishi uchun

    const calculateSatellites = () => {
        const coveragePerSatellite = Math.PI * Math.pow(radius, 2) * efficiency;
        const theoretical = area / coveragePerSatellite;
        const totalRequired = theoretical * kFactor;
        setResult(totalRequired);
        setRenderId(prev => prev + 1); // Har safar render yangilanishi uchun
    };

    const renderSatellites = () => {
        const satellites = [];
        const count = result ? Math.min(Math.ceil(result), 100) : 0;
        const orbitRadius = 120;

        for (let i = 0; i < count; i++) {
            const angle = (360 / count) * i;
            satellites.push(
                <g key={`${renderId}-${i}`} transform={`rotate(${angle})`}>
                    <g className="satellite-orbit">
                        <circle className="satellite" cx={orbitRadius} cy="0" r="5" />
                    </g>
                </g>
            );
        }

        return satellites;
    };

    return (
        <div className="leo-coverage-container">
            <h2>🌍 LEO Sun’iy Yo‘ldoshlar Hisoblagichi</h2>

            <div className="leo-coverage-inputs">
                <label>
                    🇺🇿 Maydon (S), km²:
                    <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
                </label>
                <label>
                    🛰 Qamrov radiusi (R), km:
                    <input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
                </label>
                <label>
                    📶 Samaradorlik (η):
                    <input type="number" step="0.01" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} />
                </label>
                <label>
                    ⏱ Ko‘paytiruvchi (K):
                    <input type="number" value={kFactor} onChange={(e) => setKFactor(Number(e.target.value))} />
                </label>
                <button onClick={calculateSatellites}>Hisoblash</button>
            </div>

            {result !== null && (
                <>
                    <div className="leo-coverage-result">
                        📊 Kerakli sun’iy yo‘ldoshlar soni: <strong>{Math.ceil(result)}</strong>
                    </div>

                    <div className="leo-visualization">
                        <svg viewBox="0 0 400 400" className="orbit-view">
                            <g transform="translate(200,200)">
                                <circle className="earth" r="40" />
                                <circle className="orbit-path" r="120" fill="none" />
                                {renderSatellites()}
                            </g>
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
};

export default LEOSatelliteCoverage;
