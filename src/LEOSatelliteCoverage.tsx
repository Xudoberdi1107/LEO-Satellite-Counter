// // components/OrbitSimulator.tsx
// 'use client';

// import { OrbitControls } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import * as THREE from 'three';

// type OrbitProps = {
//     inclination: number;
//     radius: number;
//     color: string;
// };

// const Orbit = ({ inclination, radius, color }: OrbitProps) => {
//     const points: THREE.Vector3[] = [];
//     const segments = 360;

//     for (let i = 0; i <= segments; i++) {
//         const theta = (i / segments) * 2 * Math.PI;
//         const x = radius * Math.cos(theta);
//         const y = radius * Math.sin(theta) * Math.cos(THREE.MathUtils.degToRad(inclination));
//         const z = radius * Math.sin(theta) * Math.sin(THREE.MathUtils.degToRad(inclination));
//         points.push(new THREE.Vector3(x, y, z));
//     }

//     const curve = new THREE.CatmullRomCurve3(points, true);
//     const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, true);

//     return (
//         <mesh geometry={geometry}>
//             <meshBasicMaterial attach="material" color={color} />
//         </mesh>
//     );
// };

// export default function OrbitSimulator() {
//     return (
//         <Canvas camera={{ position: [0, 0, 500], fov: 25 }} style={{ width: "100vw", height: "100vh", border: "5px solid width" }}>
//             {/* Yer shari */}
//             <mesh>
//                 <sphereGeometry args={[100, 64, 64]} /> // [30 → 100]
//                 <meshStandardMaterial color="#1E90FF" wireframe />
//             </mesh>

//             {/* Trayektoriyalar */}
//             <Orbit inclination={0} radius={120} color="green" />     // Ekvatorial
//             <Orbit inclination={30} radius={140} color="yellow" />   // Yonaltirilgan
//             <Orbit inclination={90} radius={160} color="red" />      // Qutbiy
//             <Orbit inclination={98} radius={180} color="orange" />   // Sun-synchronous
//             <Orbit inclination={63.4} radius={130} color="purple" /> // Molniya-o‘xshash
//             {/* Yorug'lik */}
//             <ambientLight intensity={0.8} />
//             <pointLight position={[100, 100, 100]} intensity={1} />

//             {/* Harakat uchun */}
//             <OrbitControls />
//         </Canvas>
//     );
// }


'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import type { orbitsType } from './App';

type OrbitProps = {
    inclination: number;
    radius: number;
    color: string;
};

const Orbit = ({ inclination, radius, color }: OrbitProps) => {
    const points: THREE.Vector3[] = [];
    const segments = 360;

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta) * Math.cos(THREE.MathUtils.degToRad(inclination));
        const z = radius * Math.sin(theta) * Math.sin(THREE.MathUtils.degToRad(inclination));
        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, true);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial attach="material" color={color} />
        </mesh>
    );
};

type SatelliteProps = {
    inclination: number;
    radius: number;
    speed: number;
    color: string;
    initialAngle: number;
};

const Satellite = ({ inclination, radius, speed, color, initialAngle }: SatelliteProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const angleRef = useRef(initialAngle);

    useFrame(() => {
        angleRef.current += speed;

        const theta = angleRef.current;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta) * Math.cos(THREE.MathUtils.degToRad(inclination));
        const z = radius * Math.sin(theta) * Math.sin(THREE.MathUtils.degToRad(inclination));

        meshRef.current.position.set(x, y, z);
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

type OrbitSimulatorProps = {
    orbitsAndSatellites: orbitsType[]
}
export default function OrbitSimulator(props: OrbitSimulatorProps) {
    const { orbitsAndSatellites } = props


    const satellites: SatelliteProps[] = [];

    orbitsAndSatellites.forEach(({ inclination, radius, count }, orbitIndex) => {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI; // 0 dan 2π gacha bo‘linadi
            const speed = 0.0035 + orbitIndex * 0.0002; // Har bir orbitaga mos tezlik
            satellites.push({
                inclination,
                radius,
                speed,
                color: 'white',
                initialAngle: angle,
            });
        }
    });

    return (
        <Canvas camera={{ position: [0, 0, 500], fov: 25 }} style={{ width: '100vw', height: '100vh' }}>
            {/* Yer shari */}
            <mesh>
                <sphereGeometry args={[100, 64, 64]} />
                <meshStandardMaterial color="#1E90FF" wireframe />
            </mesh>

            {/* Orbit trayektoriyalari */}
            {orbitsAndSatellites.map(({ inclination, radius, color }, index) => (
                <Orbit key={index} inclination={inclination} radius={radius} color={color} />
            ))}

            {/* 24 ta sun’iy yo‘ldosh */}
            {satellites.map((sat, index) => (
                <Satellite key={index} {...sat} />
            ))}

            {/* Yorug‘lik manbalari */}
            <ambientLight intensity={0.8} />
            <pointLight position={[100, 100, 100]} intensity={1} />

            {/* Kamera harakati */}
            <OrbitControls />
        </Canvas>
    );
}

