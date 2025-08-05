'use client';
import type { FC, Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Circle, Upload, ToyBrick, Wand2 } from 'lucide-react';
import type { ModelType } from '@/app/page';
import { generateStyle } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface ModelControlsProps {
  setModel: Dispatch<SetStateAction<ModelType>>;
  setModelUrl: Dispatch<SetStateAction<string | null>>;
  setGeneratedTexture: Dispatch<SetStateAction<string | null>>;
}

const ModelControls: FC<ModelControlsProps> = ({ setModel, setModelUrl, setGeneratedTexture }) => {
  const { toast } = useToast();
  const [styleImageUrl, setStyleImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleModelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setModelUrl(URL.createObjectURL(file));
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setStyleImageUrl(result);
        setUploadedImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStyle = async () => {
    if (!styleImageUrl) {
      toast({
        title: 'Error',
        description: 'Please upload or select a style image first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedTexture(null);

    const result = await generateStyle(styleImageUrl);
    
    if(result.success) {
      setGeneratedTexture(result.texture);
      toast({
        title: 'Success!',
        description: 'New texture generated and applied.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsGenerating(false);
  };
  
  const selectPredefinedStyle = (url: string) => {
    setStyleImageUrl(url);
    setUploadedImagePreview(null);
  };

  return (
    <Tabs defaultValue="models" className="w-full flex flex-col h-full">
      <TabsList className="grid w-full grid-cols-2 bg-[#0F0F1C] text-white">
        <TabsTrigger value="models">Models</TabsTrigger>
        <TabsTrigger value="styles">Styles</TabsTrigger>
      </TabsList>
      <TabsContent value="models" className="flex-grow mt-4">
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-primary text-2xl">Select a Model</CardTitle>
            <CardDescription className="text-white/70">Choose a base model or upload your own.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="text-lg border-primary text-primary hover:bg-primary hover:text-white" onClick={() => { setModel('cube'); setModelUrl(null); }}><Box className="mr-2"/>Cube</Button>
              <Button variant="outline" className="text-lg border-primary text-primary hover:bg-primary hover:text-white" onClick={() => { setModel('sphere'); setModelUrl(null); }}><Circle className="mr-2"/>Sphere</Button>
              <Button variant="outline" className="text-lg border-primary text-primary hover:bg-primary hover:text-white" onClick={() => { setModel('torus'); setModelUrl(null); }}><ToyBrick className="mr-2"/>Torus</Button>
            </div>
            <input type="file" id="model-upload" className="hidden" accept=".obj,.glb,.gltf" onChange={handleModelUpload} />
            <button className="w-full btn-gradient" onClick={() => document.getElementById('model-upload')?.click()}>
                <span className="text-lg">
                    <Upload className="mr-2 inline-block" />
                    Upload .obj/.glb
                </span>
            </button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="styles" className="flex-grow mt-4">
        <Card className="bg-transparent border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-primary text-2xl">AI Style Transfer</CardTitle>
            <CardDescription className="text-white/70">Generate a texture with AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <Button variant="outline" className="w-full text-lg" onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="mr-2" />
              {uploadedImagePreview ? 'Change' : 'Upload'} Style Image
            </Button>
            
            <CardDescription className="text-white/70">Or select a predefined style:</CardDescription>
            <div className="grid grid-cols-2 gap-2">
                <Button className="text-lg" variant={styleImageUrl === 'https://placehold.co/300x200.png?text=Madhubani' ? 'default' : 'outline'} onClick={() => selectPredefinedStyle('https://placehold.co/300x200.png?text=Madhubani')} data-ai-hint="madhubani painting">Madhubani</Button>
                <Button className="text-lg" variant={styleImageUrl === 'https://placehold.co/300x200.png?text=Van+Gogh' ? 'default' : 'outline'} onClick={() => selectPredefinedStyle('https://placehold.co/300x200.png?text=Van+Gogh')} data-ai-hint="starry night">Van Gogh</Button>
            </div>

            {uploadedImagePreview && <img src={uploadedImagePreview} alt="Style preview" className="rounded-md object-cover w-full h-32" />}

            <button className="w-full btn-gradient" onClick={handleGenerateStyle} disabled={isGenerating || !styleImageUrl}>
                <span className="text-lg">
                    <Wand2 className="mr-2 inline-block"/>
                    {isGenerating ? 'Generating...' : 'Generate Style'}
                </span>
            </button>
            
            {isGenerating && <Progress value={undefined} className="w-full" />}

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ModelControls;
