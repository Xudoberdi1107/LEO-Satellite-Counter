'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
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

