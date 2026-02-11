'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function MiniGrain({ color }: { color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const isMobile = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
        }
    });

    return (
        <Float speed={5} rotationIntensity={2} floatIntensity={1}>
            <mesh ref={meshRef}>
                <capsuleGeometry args={[0.4, 0.8, isMobile ? 2 : 4, isMobile ? 8 : 16]} />
                <MeshDistortMaterial
                    color={color}
                    speed={isMobile ? 1.5 : 3}
                    distort={isMobile ? 0.1 : 0.2}
                    radius={1}
                />
            </mesh>
        </Float>
    );
}

export default function CardGrain3D({ color = "#10b981" }: { color?: string }) {
    return (
        <div className="absolute -right-4 -top-4 w-24 h-24 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <Canvas dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5}>
                <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
                <ambientLight intensity={1} />
                <pointLight position={[2, 2, 2]} intensity={1.5} color={color} />
                <pointLight position={[-2, -2, -2]} intensity={1} color="#ffffff" />
                <MiniGrain color={color} />
            </Canvas>
        </div>
    );
}
