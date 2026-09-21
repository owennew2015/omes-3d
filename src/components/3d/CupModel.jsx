import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function CupModel(props) {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} {...props}>
      <group ref={group}>
        {/* Cup Body */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.6, 1.8, 32]} />
          <meshStandardMaterial color="#FDFBF7" roughness={0.2} metalness={0.1} />
        </mesh>
        
        {/* Cup Sleeve (Brand Color) */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.77, 0.63, 0.8, 32]} />
          <meshStandardMaterial color="#C8523B" roughness={0.9} />
        </mesh>
        
        {/* Coffee Liquid / Foam */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.05, 32]} />
          <meshStandardMaterial color="#8D4B32" roughness={0.5} />
        </mesh>

        {/* Lid */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.1, 32]} />
          <meshStandardMaterial color="#2A1E1A" roughness={0.6} />
        </mesh>

        {/* Steam Particles */}
        <Sparkles count={30} scale={1.5} size={3} speed={0.4} opacity={0.6} color="#ffffff" position={[0, 1.5, 0]} />
      </group>
    </Float>
  );
}
