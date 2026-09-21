import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { CupModel } from './CupModel';
import { BurgerModel } from './BurgerModel';
import { DrinkModel } from './DrinkModel';
import { DonutModel } from './DonutModel';

function FloatingCafeObjects() {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Central Hot Coffee Cup */}
      <CupModel position={[0, 0, 0]} scale={1.1} />

      {/* Floating Burger Left */}
      <BurgerModel position={[-2.4, 0.4, -0.5]} scale={0.8} />

      {/* Floating Cold Drink Right */}
      <DrinkModel position={[2.4, 0.2, -0.4]} scale={0.85} />

      {/* Floating Donut Bottom */}
      <DonutModel position={[0, -1.8, 0.8]} scale={0.7} />
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-80 md:h-[420px] relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#651313] via-[#4A0E0E] to-[#2A1E1A] shadow-2xl">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#FFF8E7" castShadow />
        <pointLight position={[-4, 2, -2]} intensity={2} color="#ED7B35" />
        <pointLight position={[4, -2, 2]} intensity={1.5} color="#C8523B" />
        <spotLight position={[0, 5, 0]} intensity={2.5} angle={0.6} penumbra={0.8} color="#FFF8E7" />

        <Suspense fallback={null}>
          <FloatingCafeObjects />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minPolarAngle={Math.PI / 2.5} 
          autoRotate 
          autoRotateSpeed={0.8} 
        />
      </Canvas>

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FFF8E7] bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          ✨ 3D Interactive Café Experience
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="bg-[#FFF8E7] text-[#C8523B] font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg transform rotate-3 flex items-center gap-1.5 border border-[#ED7B35]">
          <span>👆 Drag to rotate 360°</span>
        </div>
      </div>
    </div>
  );
}
