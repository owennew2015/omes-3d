import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function DonutModel(props) {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.x = Math.sin(t * 0.5) * 0.4;
      group.current.rotation.y = t * 0.6;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} {...props}>
      <group ref={group} scale={0.9}>
        {/* Cookie Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.7, 0.45, 24, 48]} />
          <meshStandardMaterial color="#D15E35" roughness={0.7} />
        </mesh>
        
        {/* Chocolate Glaze */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.71, 0.46, 24, 48, Math.PI]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#2A1E1A" roughness={0.2} metalness={0.2} />
        </mesh>

        {/* Choco Chunks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 0.65 + Math.random() * 0.1;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          return (
            <mesh key={i} position={[x, 0.42, z]} rotation={[Math.random(), Math.random(), 0]}>
              <boxGeometry args={[0.12, 0.08, 0.12]} />
              <meshStandardMaterial color="#ED7B35" roughness={0.4} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}
