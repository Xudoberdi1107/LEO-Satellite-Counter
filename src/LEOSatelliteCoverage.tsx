import React, { useEffect, useState } from 'react';

interface Orbit {
    name: string;
    inclination: number; // in degrees
    altitude: number;    // in km, orbital balandlik
    color: string;
    satelliteCount: number; // suniy yo‘ldoshlar soni
}

const EARTH_RADIUS_KM = 6371;

const orbits: Orbit[] = [
    { name: "Ekvatorial (0°-10°)", inclination: 5, altitude: 400, color: "#FF5733", satelliteCount: 2 },
    { name: "Yonaltirilgan (20°-70°)", inclination: 45, altitude: 800, color: "#33C1FF", satelliteCount: 3 },
    { name: "Qutbiy (≈90°)", inclination: 90, altitude: 600, color: "#33FF57", satelliteCount: 4 },
    { name: "Sun-synchronous (≈97°-98°)", inclination: 97, altitude: 700, color: "#FFC300", satelliteCount: 7 },
    { name: "Molniya-o‘xshash (63.4°)", inclination: 63.4, altitude: 600, color: "#8E44AD", satelliteCount: 8 },
];

const width = 1000;
const height = 1000;
const centerX = width / 2;
const centerY = height / 2;
const scale = 0.05;

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const OrbitSimulator: React.FC = () => {
    const [angle, setAngle] = useState(0); // Barcha suniy yo‘ldoshlar uchun umumiy burchak

    // Animatsiya (har 50 ms da angle o‘zgaradi)
    useEffect(() => {
        const interval = setInterval(() => {
            setAngle((prev) => (prev + 1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <svg width={width} height={height} style={{ backgroundColor: '#001f3f' }}>
            {/* Yer yuzasi */}
            <circle
                cx={centerX}
                cy={centerY}
                r={EARTH_RADIUS_KM * scale}
                fill="#2E86C1"
                stroke="#1B4F72"
                strokeWidth={3}
            />
            {/* <text
                x={centerX}
                y={centerY + EARTH_RADIUS_KM * scale + 20}
                fill="white"
                fontSize={14}
                textAnchor="middle"
            >
                Yer (Earth)
            </text> */}

            {/* Orbitalarni chizish va suniy yo‘ldoshlar */}
            {orbits.map(({ inclination, altitude, color, satelliteCount }, idx) => {
                const orbitRadius = (EARTH_RADIUS_KM + altitude) * scale;
                const radIncl = degToRad(inclination);

                const rx = orbitRadius;
                const ry = orbitRadius * Math.cos(radIncl);

                // Orbitani aylantirish burchagi
                const rotation = 45;

                return (
                    <g key={idx}>
                        {/* Orbit ellipse */}
                        <ellipse
                            cx={centerX}
                            cy={centerY}
                            rx={rx}
                            ry={ry}
                            stroke={color}
                            strokeWidth={2}
                            fill="none"
                            transform={`rotate(${rotation}, ${centerX}, ${centerY})`}
                            opacity={0.8}
                        />
                        {/* Orbit nomi */}
                        {/* <text
                            x={centerX + rx + 10}
                            y={centerY - ry + idx * 20}
                            fill={color}
                            fontSize={12}
                            fontWeight="bold"
                        >
                            {name}
                        </text> */}

                        {/* Suniy yo‘ldoshlar */}
                        {[...Array(satelliteCount)].map((_, satIdx) => {
                            // Har bir suniy yo‘ldosh uchun burchak
                            const satAngle = ((360 / satelliteCount) * satIdx + angle) % 360;
                            const radSatAngle = degToRad(satAngle);

                            // Suniy yo‘ldosh koordinatalari ellipsa bo‘yicha
                            // Ellipsaning parametrik tenglamasi:
                            // x = cx + rx * cos(t)
                            // y = cy + ry * sin(t)
                            // Biz orbitani 45° aylantiramiz, shuning uchun x, y ni transformatsiya qilamiz:

                            // Aylantirish formulasini qo'llaymiz (x,y) atrofida (cx,cy) markazda:
                            // x' = cx + (x - cx) * cosθ - (y - cy) * sinθ
                            // y' = cy + (x - cx) * sinθ + (y - cy) * cosθ
                            const x0 = centerX + rx * Math.cos(radSatAngle);
                            const y0 = centerY + ry * Math.sin(radSatAngle);

                            const radRot = degToRad(rotation);
                            const x =
                                centerX +
                                (x0 - centerX) * Math.cos(radRot) -
                                (y0 - centerY) * Math.sin(radRot);
                            const y =
                                centerY +
                                (x0 - centerX) * Math.sin(radRot) +
                                (y0 - centerY) * Math.cos(radRot);

                            return (
                                <circle
                                    key={satIdx}
                                    cx={x}
                                    cy={y}
                                    r={5}
                                    fill={color}
                                    stroke="#fff"
                                    strokeWidth={1}
                                />
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
};

export default OrbitSimulator;
