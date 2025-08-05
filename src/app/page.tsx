'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import Header from '@/components/Header';
import ModelControls from '@/components/ModelControls';
import CustomizationControls from '@/components/CustomizationControls';
import ThreeScene from '@/components/ThreeScene';

export type MaterialType = 'matte' | 'metallic' | 'wireframe' | 'cotton' | 'silk' | 'denim';
export type ModelType = 'cube' | 'sphere' | 'torus';

const Home: FC = () => {
  const [model, setModel] = useState<ModelType>('cube');
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [material, setMaterial] = useState<MaterialType>('matte');
  const [lightIntensity, setLightIntensity] = useState(1.5);
  const [generatedTexture, setGeneratedTexture] = useState<string | null>(null);

  const captureSnapshot = () => {
    const event = new CustomEvent('snapshot');
    window.dispatchEvent(event);
  };
  
  const exportModel = () => {
    const event = new CustomEvent('export');
    window.dispatchEvent(event);
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-body">
      <div className="w-[1200px] h-[800px] bg-[#C6C0AC] rounded-2xl p-8 shadow-2xl border-4 border-[#B4AE9C]">
        <div className="bg-black w-full h-full rounded-[40px] border-4 border-black overflow-hidden relative shadow-inner">
          {/* Screen Content */}
          <div className="w-full h-full bg-[#0F0F1C] text-white flex flex-col overflow-hidden tv-screen rounded-[36px]">
            <Header onSnapshot={captureSnapshot} onExport={exportModel} />
            <div className="flex flex-1 border-t border-white/10 overflow-hidden">
              <aside className="w-80 h-full overflow-y-auto p-4 border-r border-white/10 bg-[#141424] flex flex-col gap-4">
                <ModelControls setModel={setModel} setModelUrl={setModelUrl} setGeneratedTexture={setGeneratedTexture} />
              </aside>
              <main className="flex-1 relative">
                <ThreeScene model={model} modelUrl={modelUrl} material={material} lightIntensity={lightIntensity} generatedTexture={generatedTexture} />
              </main>
              <aside className="w-72 h-full overflow-y-auto p-4 border-l border-white/10 bg-[#141424]">
                <CustomizationControls
                  setMaterial={setMaterial}
                  material={material}
                  setLightIntensity={setLightIntensity}
                  lightIntensity={lightIntensity}
                />
              </aside>
            </div>
          </div>

          {/* TV Frame Details */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="w-24 h-4 bg-gray-600 rounded-full opacity-20"></div>
          </div>
          <div className="absolute right-8 bottom-20 flex flex-col gap-4">
              <div className="w-12 h-12 bg-[#B4AE9C] rounded-full border-2 border-[#A29C8A] shadow-inner"></div>
              <div className="w-12 h-12 bg-[#B4AE9C] rounded-full border-2 border-[#A29C8A] shadow-inner"></div>
          </div>
          <div className="absolute right-8 top-20 w-8 h-24 bg-repeat-y bg-[length:100%_1rem]" style={{backgroundImage: 'linear-gradient(to bottom, transparent, transparent 4px, #A29C8A 4px, #A29C8A 6px)'}}>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
