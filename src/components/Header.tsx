import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Download } from 'lucide-react';

interface HeaderProps {
  onSnapshot: () => void;
  onExport: () => void;
}

const Header: FC<HeaderProps> = ({ onSnapshot, onExport }) => {
  return (
    <header className="flex items-center justify-between p-4 h-16 bg-[#141424] text-white border-b-2 border-t-2 border-[#333]">
      <h1 className="text-4xl font-headline font-bold text-primary animate-pulse">StyleVerse 3D</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSnapshot} className="border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full w-10 h-10 p-0">
          <Camera />
        </Button>
        <button onClick={onExport} className="btn-gradient shadow-lg shadow-accent/20">
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
