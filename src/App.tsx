import html2canvas from "html2canvas-pro";
import { Download } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import "./App.css";
import Camera from "./components/camera";
import Photo from "./components/photo";
import { Button } from "./components/ui/button";

function App() {
  const [photos, setPhotos] = useState<string[]>(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [prevActiveIndex, setPrevActiveIndex] = useState<number | null>(null);

  const photoStripRef = useRef<HTMLDivElement>(null);

  const handleCapture = (imageSrc: string) => {
    if (activeIndex === null) return;

    setPhotos((prevPhotos) => {
      const newPhotos = [...prevPhotos];
      newPhotos[activeIndex] = imageSrc;
      return newPhotos;
    });

    if (prevActiveIndex) {
      setActiveIndex(prevActiveIndex);
      setPrevActiveIndex(null);
    } else {
      setActiveIndex((prevIndex) => {
        if (prevIndex === null) return 0;
        if (prevIndex < photos.length - 1) {
          return prevIndex + 1;
        }
        return null;
      });
    }
  };

  const handleRecapture = (index: number) => {
    setPrevActiveIndex(activeIndex);
    setActiveIndex(index);
    setPhotos((prevPhotos) => {
      const newPhotos = [...prevPhotos];
      newPhotos[index] = "";
      return newPhotos;
    });
  };

  const handleDownloadPhotoStrip = async () => {
    if (!photoStripRef.current) return;

    try {
      const canvas = await html2canvas(photoStripRef.current, {
        scale: 5,
      });

      const link = document.createElement("a");
      link.download = `Chalkak ${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error(error);
    }

    toast("Download success");
  };

  const allPhotosCaptured = photos.every((photo) => photo !== "");

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-screen h-screen">
      <div ref={photoStripRef} className="grid grid-cols-1 gap-3 bg-black p-3">
        {photos.map((photo, index) => (
          <div key={index} className="flex items-center w-48 h-36">
            {photo ? (
              <Photo photo={photo} onRecapture={() => handleRecapture(index)} />
            ) : index === activeIndex ? (
              <Camera onCapture={handleCapture} />
            ) : (
              <div className="w-full h-full border border-white border-dashed" />
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleDownloadPhotoStrip} disabled={!allPhotosCaptured}>
        <Download /> Download
      </Button>
    </div>
  );
}

export default App;
