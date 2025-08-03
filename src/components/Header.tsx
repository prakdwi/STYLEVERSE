import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Download } from 'lucide-react';

interface HeaderProps {
  onSnapshot: () => void;
  onExport: () => void;
}

const Header: FC<HeaderProps> = ({ onSnapshot, onExport }) => {
  return (
    <header className="flex items-center justify-between p-4 h-16">
      <h1 className="text-2xl font-headline font-bold text-white">StyleVerse 3D</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSnapshot}>
          <Camera className="mr-2" />
          Snapshot
        </Button>
        <Button onClick={onExport}>
          <Download className="mr-2" />
          Export Model
        </Button>
      </div>
    </header>
  );
};

export default Header;
