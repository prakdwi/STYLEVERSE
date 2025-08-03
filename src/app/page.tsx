'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import Header from '@/components/Header';
import ModelControls from '@/components/ModelControls';
import CustomizationControls from '@/components/CustomizationControls';
import ThreeScene from '@/components/ThreeScene';

export type MaterialType = 'matte' | 'metallic' | 'wireframe';
export type ModelType = 'cube' | 'jacket' | 'shirt' | 'person';

const Home: FC = () => {
  const [model, setModel] = useState<ModelType>('cube');
  const [material, setMaterial] = useState<MaterialType>('matte');
  const [lightIntensity, setLightIntensity] = useState(1.5);
  const [styleImageUrl, setStyleImageUrl] = useState<string | null>(null);

  const captureSnapshot = () => {
    const event = new CustomEvent('snapshot');
    window.dispatchEvent(event);
  };
  
  const exportModel = () => {
    const event = new CustomEvent('export');
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body overflow-hidden">
      <Header onSnapshot={captureSnapshot} onExport={exportModel} />
      <div className="flex flex-1 border-t border-white/10 overflow-hidden">
        <aside className="w-80 h-full overflow-y-auto p-4 border-r border-white/10 bg-black/20 flex flex-col gap-4">
          <ModelControls setModel={setModel} setStyleImageUrl={setStyleImageUrl} />
        </aside>
        <main className="flex-1 relative">
          <ThreeScene model={model} material={material} lightIntensity={lightIntensity} styleImageUrl={styleImageUrl} />
        </main>
        <aside className="w-72 h-full overflow-y-auto p-4 border-l border-white/10 bg-black/20">
          <CustomizationControls
            setMaterial={setMaterial}
            material={material}
            setLightIntensity={setLightIntensity}
            lightIntensity={lightIntensity}
          />
        </aside>
      </div>
    </div>
  );
};

export default Home;
