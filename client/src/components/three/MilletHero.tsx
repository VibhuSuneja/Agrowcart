'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<any>(null);

    // Dynamic LoD: Adjust particle count based on device performance
    const count = useMemo(() => {
        if (typeof window !== 'undefined') {
            const cores = navigator.hardwareConcurrency || 4;
            return cores <= 4 ? 500 : 2000;
        }
        return 1000;
    }, []);

    const sphere = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color1 = new THREE.Color("#10b981");
        const color2 = new THREE.Color("#f59e0b");

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        return { positions, colors };
    }, [count]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere.positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
}

function FloatingGrain() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Dynamic LoD: Simplify geometry for lower-end devices
    const isLowEnd = useMemo(() => {
        if (typeof window !== 'undefined') {
            return (navigator.hardwareConcurrency || 4) <= 4;
        }
        return false;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={[0.8, 0, 0]}>
                <capsuleGeometry args={[0.15, 0.4, isLowEnd ? 2 : 4, isLowEnd ? 8 : 16]} />
                <MeshDistortMaterial
                    color="#f59e0b"
                    speed={isLowEnd ? 1 : 2}
                    distort={isLowEnd ? 0.1 : 0.3}
                    radius={1}
                />
            </mesh>
        </Float>
    );
}

const MilletHeroBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Canvas dpr={[1, 1.5]}>
                <PerspectiveCamera makeDefault position={[0, 0, 2]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f59e0b" />

                <ParticleField />

                {/* Visual anchor: A large floating "golden grain" on the right side of the hero */}
                <group position={[0.5, 0, 0]}>
                    <FloatingGrain />
                </group>

                <fog attach="fog" args={['#ffffff', 1, 5]} />
            </Canvas>
        </div>
    );
};

export default MilletHeroBackground;
