import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface PhotoProps {
  photo: string;
  onRecapture: () => void;
}

export default function Photo({ photo, onRecapture }: PhotoProps) {
  return (
    <div className="relative group">
      <img src={photo} alt="chalkak" />

      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" onClick={onRecapture}>
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
