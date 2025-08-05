'use client';
import type { Dispatch, FC, SetStateAction } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Cloud, Palette, Sun } from 'lucide-react';
import type { MaterialType } from '@/app/page';
import { Input } from './ui/input';

interface CustomizationControlsProps {
  material: MaterialType;
  setMaterial: Dispatch<SetStateAction<MaterialType>>;
  lightIntensity: number;
  setLightIntensity: Dispatch<SetStateAction<number>>;
  fogColor: string;
  setFogColor: Dispatch<SetStateAction<string>>;
  fogDensity: number;
  setFogDensity: Dispatch<SetStateAction<number>>;
}

const CustomizationControls: FC<CustomizationControlsProps> = ({
  material,
  setMaterial,
  lightIntensity,
  setLightIntensity,
  fogColor,
  setFogColor,
  fogDensity,
  setFogDensity,
}) => {
  return (
    <Accordion type="multiple" defaultValue={['environment', 'material']} className="w-full text-white">
      <AccordionItem value="environment">
        <AccordionTrigger className="text-xl">
          <Sun className="mr-2 text-primary"/> Environment
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-2">
          <div className="space-y-2">
            <Label htmlFor="light-intensity" className="text-primary text-lg">Light Intensity</Label>
            <Slider
              id="light-intensity"
              min={0}
              max={5}
              step={0.1}
              value={[lightIntensity]}
              onValueChange={(value) => setLightIntensity(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fog-color" className="text-primary text-lg flex items-center">
              <Cloud className="mr-2" /> Fog Color
            </Label>
            <Input
              id="fog-color"
              type="color"
              value={fogColor}
              onChange={(e) => setFogColor(e.target.value)}
              className="w-full h-10 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fog-density" className="text-primary text-lg">Fog Density</Label>
            <Slider
              id="fog-density"
              min={0}
              max={0.5}
              step={0.01}
              value={[fogDensity]}
              onValueChange={(value) => setFogDensity(value[0])}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="material">
        <AccordionTrigger className="text-xl">
          <Palette className="mr-2 text-primary"/> Material
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <RadioGroup value={material} onValueChange={(value: MaterialType) => setMaterial(value)} className="space-y-2 text-lg">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="matte" id="matte" />
              <Label htmlFor="matte" className="hover:text-primary">Matte</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metallic" id="metallic" />
              <Label htmlFor="metallic" className="hover:text-primary">Metallic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wireframe" id="wireframe" />
              <Label htmlFor="wireframe" className="hover:text-primary">Wireframe</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cotton" id="cotton" />
              <Label htmlFor="cotton" className="hover:text-primary">Cotton</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="silk" id="silk" />
              <Label htmlFor="silk" className="hover:text-primary">Silk</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="denim" id="denim" />
              <Label htmlFor="denim" className="hover:text-primary">Denim</Label>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomizationControls;
