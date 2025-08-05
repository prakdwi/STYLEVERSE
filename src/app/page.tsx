'use client';
import type { FC } from 'react';
import React, from 'react';
import Header from '@/components/Header';
import ModelControls from '@/components/ModelControls';
import CustomizationControls from '@/components/CustomizationControls';
import ThreeScene from '@/components/ThreeScene';

export type MaterialType = 'matte' | 'metallic' | 'wireframe' | 'cotton' | 'silk' | 'denim';
export type ModelType = 'cube' | 'sphere' | 'knot' | 'jacket';

const Home: FC = () => {
  const [model, setModel] = React.useState<ModelType>('cube');
  const [modelUrl, setModelUrl] = React.useState<string | null>(null);
  const [material, setMaterial] = React.useState<MaterialType>('matte');
  const [lightIntensity, setLightIntensity] = React.useState(1.5);
  const [generatedTexture, setGeneratedTexture] = React.useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = React.useState('#0F0F1C');
  const [showGrid, setShowGrid] = React.useState(false);

  const captureSnapshot = () => {
    const event = new CustomEvent('snapshot');
    window.dispatchEvent(event);
  };
  
  const exportModel = () => {
    const event = new CustomEvent('export');
    window.dispatchEvent(event);
  };

  const handleSetModel = (newModel: ModelType) => {
    setModel(newModel);
    if (newModel === 'jacket') {
      // Set a default model URL for the jacket.
      // You can replace this URL with your own self-hosted model.
      setModelUrl('https://firebasestorage.googleapis.com/v0/b/genkit-llm-7669a.appspot.com/o/7a760c6c-a43c-43f1-8f2c-55cbbc433871.glb?alt=media&token=c191a32a-4a81-4357-93e5-b82772528c89');
    } else {
      // For other models, clear the URL to use the built-in geometry.
      setModelUrl(null);
    }
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
                <ModelControls setModel={handleSetModel} setModelUrl={setModelUrl} setGeneratedTexture={setGeneratedTexture} />
              </aside>
              <main className="flex-1 relative">
                <ThreeScene model={model} modelUrl={modelUrl} material={material} lightIntensity={lightIntensity} generatedTexture={generatedTexture} backgroundColor={backgroundColor} showGrid={showGrid} />
              </main>
              <aside className="relative w-72 h-full overflow-y-auto p-4 border-l border-white/10 bg-[#141424] tv-screen">
                <CustomizationControls
                  setMaterial={setMaterial}
                  material={material}
                  setLightIntensity={setLightIntensity}
                  lightIntensity={lightIntensity}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  showGrid={showGrid}
                  setShowGrid={setShowGrid}
                />
              </aside>
            </div>
          </div>

          {/* TV Frame Details */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="w-24 h-4 bg-gray-600 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
