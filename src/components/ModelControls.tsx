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
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

interface ModelControlsProps {
  setModel: Dispatch<SetStateAction<ModelType>>;
  setModelUrl: Dispatch<SetStateAction<string | null>>;
  setGeneratedTexture: Dispatch<SetStateAction<string | null>>;
}

const glassmorphismClass = "bg-white/5 border border-white/10 backdrop-blur-md shadow-lg";

const ModelControls: FC<ModelControlsProps> = ({ setModel, setModelUrl, setGeneratedTexture }) => {
  const { toast } = useToast();
  const [styleImageUrl, setStyleImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('a cosmic nebula');
  const [isGenerating, setIsGenerating] = useState(false);

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
        setStyleImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStyle = async () => {
    if (!styleImageUrl) {
      toast({
        title: 'Error',
        description: 'Please upload a style image first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedTexture(null);

    const result = await generateStyle(styleImageUrl, prompt);
    
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
            <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 hover:from-accent hover:to-primary" onClick={() => document.getElementById('model-upload')?.click()}>
              <Upload className="mr-2" />
              Upload .obj/.glb
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="styles" className="flex-grow mt-4">
        <Card className={glassmorphismClass}>
          <CardHeader>
            <CardTitle>AI Style Transfer</CardTitle>
            <CardDescription>Generate a texture with AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="mr-2" />
              {styleImageUrl ? 'Change' : 'Upload'} Style Image
            </Button>

            {styleImageUrl && <img src={styleImageUrl} alt="Style preview" className="rounded-md object-cover w-full h-32" />}
            
            <div className="space-y-2">
              <Label htmlFor="prompt">Style Prompt</Label>
              <Textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., a vibrant graffiti wall" />
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 hover:from-accent hover:to-primary" onClick={handleGenerateStyle} disabled={isGenerating || !styleImageUrl}>
              <Wand2 className="mr-2"/>
              {isGenerating ? 'Generating...' : 'Generate Style'}
            </Button>
            
            {isGenerating && <Progress value={undefined} className="w-full" />}

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ModelControls;
