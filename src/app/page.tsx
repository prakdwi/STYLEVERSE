'use client';
import type { FC } from 'react';
import React from 'react';
import Header from '@/components/Header';
import ModelControls from '@/components/ModelControls';
import CustomizationControls from '@/components/CustomizationControls';
import ThreeScene from '@/components/ThreeScene';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type MaterialType = 'matte' | 'metallic' | 'wireframe' | 'cotton' | 'silk' | 'denim';
export type ModelType = 'cube' | 'sphere' | 'knot' | 'pyramid';
export type ModelInfo = {
  type: 'url',
  url: string;
  fileType: 'glb' | 'obj';
} | {
  type: 'shape',
  shape: ModelType
}


const Home: FC = () => {
  const [modelInfo, setModelInfo] = React.useState<ModelInfo>({type: 'url', url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', fileType: 'glb'});
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
    <div className="flex items-center justify-center min-h-screen p-0 md:p-4 font-body bg-[#C6C0AC]">
      <div className="w-full h-screen md:w-[1200px] md:h-[800px] md:bg-[#C6C0AC] md:rounded-2xl md:p-8 md:shadow-2xl md:border-4 md:border-[#B4AE9C]">
        <div className="bg-black w-full h-full md:rounded-[40px] border-4 border-black overflow-hidden relative shadow-inner">
          {/* Screen Content */}
          <div className="w-full h-full bg-[#0F0F1C] text-white flex flex-col overflow-hidden md:rounded-[36px]">
            <div className="relative tv-screen">
              <Header onSnapshot={captureSnapshot} onExport={exportModel} />
            </div>
            {/* Desktop View */}
            <div className="hidden md:flex flex-1 border-t border-white/10 overflow-hidden">
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
             {/* Mobile View */}
            <div className="flex md:hidden flex-1 flex-col border-t border-white/10 overflow-hidden">
              <Tabs defaultValue="scene" className="w-full flex flex-col h-full bg-[#141424]">
                <TabsList className="grid w-full grid-cols-3 bg-[#0F0F1C] text-white rounded-none">
                  <TabsTrigger value="models">Models/Style</TabsTrigger>
                  <TabsTrigger value="scene">Scene</TabsTrigger>
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                </TabsList>
                <TabsContent value="models" className="flex-grow overflow-y-auto p-4">
                   <ModelControls setModelInfo={setModelInfo} setGeneratedTexture={setGeneratedTexture} />
                </TabsContent>
                <TabsContent value="scene" className="flex-grow relative h-full">
                  <ThreeScene modelInfo={modelInfo} material={material} lightIntensity={lightIntensity} generatedTexture={generatedTexture} />
                </TabsContent>
                <TabsContent value="customize" className="flex-grow overflow-y-auto p-4">
                  <CustomizationControls
                    setMaterial={setMaterial}
                    material={material}
                    setLightIntensity={setLightIntensity}
                    lightIntensity={lightIntensity}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
