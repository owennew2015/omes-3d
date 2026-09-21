import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

export function DrinkModel(props) {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = -t * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1} {...props}>
      <group ref={group} scale={0.85}>
        {/* Glass Cup */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.55, 1.8, 32]} />
          <meshPhysicalMaterial 
            transmission={0.9} 
            opacity={1} 
            transparent 
            roughness={0.1} 
            ior={1.5}
            thickness={0.5}
            color="#FFFFFF"
          />
        </mesh>

        {/* Liquid Inside */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.72, 0.53, 1.5, 32]} />
          <meshStandardMaterial color="#E96362" roughness={0.3} opacity={0.85} transparent />
        </mesh>

        {/* Ice Cubes */}
        <mesh position={[0.2, 0.4, 0.1]} rotation={[0.4, 0.3, 0.1]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshPhysicalMaterial transmission={0.95} transparent opacity={0.9} roughness={0.05} />
        </mesh>
        <mesh position={[-0.2, 0.2, -0.1]} rotation={[0.1, 0.5, 0.6]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshPhysicalMaterial transmission={0.95} transparent opacity={0.9} roughness={0.05} />
        </mesh>

        {/* Straw */}
        <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
          <meshStandardMaterial color="#ED7B35" />
        </mesh>

        <Sparkles count={25} scale={1.8} size={2.5} speed={0.6} color="#FFF8E7" />
      </group>
    </Float>
  );
}
