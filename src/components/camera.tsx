import { Focus, LoaderCircle } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
}

export default function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (isMountedRef.current && videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (isMountedRef.current && videoRef.current) {
            videoRef.current.play();
          }
        };
      } else {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.scale(-1, 1);

    const imageSrc = canvas.toDataURL("image/png");

    onCapture(imageSrc);
  };

  useEffect(() => {
    isMountedRef.current = true;

    startCamera();

    return () => {
      isMountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <div className="relative group">
        <video
          ref={videoRef}
          className="-scale-x-100"
          disablePictureInPicture
        />
        <canvas ref={canvasRef} className="text-white hidden" />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" onClick={capturePhoto}>
            <Focus />
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
