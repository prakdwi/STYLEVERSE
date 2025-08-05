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
      <h1 className="text-2xl font-headline font-bold text-[#FFBA08]">StyleVerse 3D</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSnapshot} className="border-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
          <Camera className="mr-2" />
          Snapshot
        </Button>
        <button onClick={onExport} className="btn-gradient">
          <span>
            <Download className="mr-2 inline-block" />
            Export Model
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
