'use client';
import type { FC, Dispatch, SetStateAction } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Circle, Upload, ToyBrick } from 'lucide-react';
import type { ModelType } from '@/app/page';

interface ModelControlsProps {
  setModel: Dispatch<SetStateAction<ModelType>>;
  setStyleImageUrl: Dispatch<SetStateAction<string | null>>;
  setModelUrl: Dispatch<SetStateAction<string | null>>;
}

const glassmorphismClass = "bg-white/5 border border-white/10 backdrop-blur-md";

const ModelControls: FC<ModelControlsProps> = ({ setModel, setStyleImageUrl, setModelUrl }) => {
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setStyleImageUrl(URL.createObjectURL(file));
    }
  };

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setModelUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Tabs defaultValue="models" className="w-full flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="styles">Styles</TabsTrigger>
      </TabsList>
      <TabsContent value="models" className="flex-grow mt-4">
        <Card className={glassmorphismClass}>
          <CardHeader>
            <CardTitle>Select a Model</CardTitle>
            <CardDescription>Choose a base model or upload your own.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => { setModel('cube'); setModelUrl(null); }}><Box className="mr-2"/>Cube</Button>
              <Button variant="outline" onClick={() => { setModel('sphere'); setModelUrl(null); }}><Circle className="mr-2"/>Sphere</Button>
              <Button variant="outline" onClick={() => { setModel('torus'); setModelUrl(null); }}><ToyBrick className="mr-2"/>Torus</Button>
            </div>
            <input type="file" id="model-upload" className="hidden" accept=".obj,.glb" onChange={handleModelUpload} />
            <Button className="w-full" onClick={() => document.getElementById('model-upload')?.click()}>
              <Upload className="mr-2" />
              Upload .obj/.glb
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="styles" className="flex-grow mt-4">
        <Card className={glassmorphismClass}>
          <CardHeader>
            <CardTitle>Style Input</CardTitle>
            <CardDescription>Upload an image to apply as a texture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <Button className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="mr-2" />
              Upload Style Image
            </Button>
            <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
              Gradient Editor (Coming Soon)
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ModelControls;
