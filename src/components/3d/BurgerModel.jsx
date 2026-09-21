import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export function BurgerModel(props) {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8} {...props}>
      <group ref={group} scale={0.9}>
        {/* Top Bun */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#EAA15E" roughness={0.7} />
        </mesh>
        
        {/* Lettuce */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.95, 0.9, 0.1, 16]} />
          <meshStandardMaterial color="#4B805A" roughness={0.9} />
        </mesh>

        {/* Tomato */}
        <mesh position={[0.2, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
          <meshStandardMaterial color="#C8523B" roughness={0.5} />
        </mesh>
        <mesh position={[-0.3, 0.35, 0.2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 16]} />
          <meshStandardMaterial color="#C8523B" roughness={0.5} />
        </mesh>

        {/* Cheese */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow rotation={[0, Math.PI/4, 0]}>
          <boxGeometry args={[1.5, 0.05, 1.5]} />
          <meshStandardMaterial color="#F4B27A" roughness={0.4} />
        </mesh>

        {/* Patty */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.35, 32]} />
          <meshStandardMaterial color="#651313" roughness={0.8} />
        </mesh>
        
        {/* Bottom Bun */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.8, 0.25, 32]} />
          <meshStandardMaterial color="#EAA15E" roughness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}
