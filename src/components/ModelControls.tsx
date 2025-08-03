'use client';
import type { FC, Dispatch, SetStateAction } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cube, Shirt, Upload, User } from 'lucide-react';
import AIRecommender from '@/components/AIRecommender';
import type { ModelType } from '@/app/page';

interface ModelControlsProps {
  setModel: Dispatch<SetStateAction<ModelType>>;
  setStyleImageUrl: Dispatch<SetStateAction<string | null>>;
}

const glassmorphismClass = "bg-white/5 border border-white/10 backdrop-blur-md";

const ModelControls: FC<ModelControlsProps> = ({ setModel, setStyleImageUrl }) => {
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setStyleImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Tabs defaultValue="models" className="w-full flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="styles">Styles</TabsTrigger>
        <TabsTrigger value="ai">AI</TabsTrigger>
      </TabsList>
      <TabsContent value="models" className="flex-grow mt-4">
        <Card className={glassmorphismClass}>
          <CardHeader>
            <CardTitle>Select a Model</CardTitle>
            <CardDescription>Choose a base model or upload your own.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setModel('cube')}><Cube className="mr-2"/>Cube</Button>
              <Button variant="outline" onClick={() => setModel('jacket')}><Shirt className="mr-2"/>Jacket</Button>
              <Button variant="outline" onClick={() => setModel('shirt')}><Shirt className="mr-2"/>Shirt</Button>
              <Button variant="outline" onClick={() => setModel('person')}><User className="mr-2"/>Person</Button>
            </div>
            <Button className="w-full">
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
            <CardDescription>Upload an image or use the gradient editor.</CardDescription>
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
      <TabsContent value="ai" className="flex-grow mt-4">
        <AIRecommender />
      </TabsContent>
    </Tabs>
  );
};

export default ModelControls;
