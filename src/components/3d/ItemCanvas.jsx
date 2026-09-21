import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CupModel } from './CupModel';
import { BurgerModel } from './BurgerModel';
import { DrinkModel } from './DrinkModel';
import { DonutModel } from './DonutModel';

function ModelSelector({ category }) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('coffee') && !cat.includes('non')) {
    return <CupModel position={[0, 0, 0]} />;
  } else if (cat.includes('non') || cat.includes('drink')) {
    return <DrinkModel position={[0, 0, 0]} />;
  } else if (cat.includes('food') || cat.includes('burger')) {
    return <BurgerModel position={[0, 0, 0]} />;
  } else {
    return <DonutModel position={[0, 0, 0]} />;
  }
}

export function ItemCanvas({ category, interactive = true, className = "h-40 w-full" }) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 1, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -2, -2]} intensity={0.5} color="#ED7B35" />
        
        <Suspense fallback={null}>
          <ModelSelector category={category} />
        </Suspense>

        {interactive && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />}
      </Canvas>
    </div>
  );
}
