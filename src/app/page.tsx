'use client';
import type { FC } from 'react';
import React, from 'react';
import Header from '@/components/Header';
import ModelControls from '@/components/ModelControls';
import CustomizationControls from '@/components/CustomizationControls';
import ThreeScene from '@/components/ThreeScene';

export type MaterialType = 'matte' | 'metallic' | 'wireframe' | 'cotton' | 'silk' | 'denim';
export type ModelType = 'cube' | 'sphere' | 'knot' | 'pyramid';
export type ModelInfo = {
  type: 'url',
  url: string;
} | {
  type: 'shape',
  shape: ModelType
}


const Home: FC = () => {
  const [modelInfo, setModelInfo] = React.useState<ModelInfo>({type: 'url', url: 'https://firebasestorage.googleapis.com/v0/b/genkit-llm-7669a.appspot.com/o/jacket_2.glb?alt=media&token=f94a4855-4674-4b52-a59a-25c786a63507'});
  const [material, setMaterial] = React.useState<MaterialType>('matte');
  const [lightIntensity, setLightIntensity] = React.useState(1.5);
  const [generatedTexture, setGeneratedTexture] = React.useState<string | null>(null);

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
          <div className="w-full h-full bg-[#0F0F1C] text-white flex flex-col overflow-hidden rounded-[36px]">
            <div className="relative tv-screen">
              <Header onSnapshot={captureSnapshot} onExport={exportModel} />
            </div>
            <div className="flex flex-1 border-t border-white/10 overflow-hidden">
              <aside className="relative w-80 h-full overflow-y-auto p-4 border-r border-white/10 bg-[#141424] flex flex-col gap-4 tv-screen">
                <ModelControls setModelInfo={setModelInfo} setGeneratedTexture={setGeneratedTexture} />
              </aside>
              <main className="flex-1 relative">
                <ThreeScene modelInfo={modelInfo} material={material} lightIntensity={lightIntensity} generatedTexture={generatedTexture} />
              </main>
              <aside className="relative w-72 h-full overflow-y-auto p-4 border-l border-white/10 bg-[#141424] tv-screen">
                <CustomizationControls
                  setMaterial={setMaterial}
                  material={material}
                  setLightIntensity={setLightIntensity}
                  lightIntensity={lightIntensity}
                />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
