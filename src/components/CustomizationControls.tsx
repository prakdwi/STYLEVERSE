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
import { Palette, Sun } from 'lucide-react';
import type { MaterialType } from '@/app/page';

interface CustomizationControlsProps {
  material: MaterialType;
  setMaterial: Dispatch<SetStateAction<MaterialType>>;
  lightIntensity: number;
  setLightIntensity: Dispatch<SetStateAction<number>>;
}

const CustomizationControls: FC<CustomizationControlsProps> = ({
  material,
  setMaterial,
  lightIntensity,
  setLightIntensity,
}) => {
  return (
    <Accordion type="multiple" defaultValue={['environment', 'material']} className="w-full">
      <AccordionItem value="environment">
        <AccordionTrigger>
          <Sun className="mr-2"/> Environment
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <Label htmlFor="light-intensity">Light Intensity</Label>
          <Slider
            id="light-intensity"
            min={0}
            max={5}
            step={0.1}
            value={[lightIntensity]}
            onValueChange={(value) => setLightIntensity(value[0])}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="material">
        <AccordionTrigger>
          <Palette className="mr-2"/> Material
        </AccordionTrigger>
        <AccordionContent className="p-1 space-y-2">
          <RadioGroup value={material} onValueChange={(value: MaterialType) => setMaterial(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="matte" id="matte" />
              <Label htmlFor="matte">Matte</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metallic" id="metallic" />
              <Label htmlFor="metallic">Metallic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wireframe" id="wireframe" />
              <Label htmlFor="wireframe">Wireframe</Label>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomizationControls;
