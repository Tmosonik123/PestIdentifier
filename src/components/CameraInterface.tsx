import React, { useState } from "react";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CameraInterfaceProps {
  onPhotoCapture?: (photo: string) => void;
  onPhotoUpload?: (photo: string) => void;
}

const CameraInterface = ({
  onPhotoCapture = () => {},
  onPhotoUpload = () => {},
}: CameraInterfaceProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Function to handle camera access and photo capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCapturing(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");
        setPhotoPreview(photoData);
        onPhotoCapture(photoData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setPhotoPreview(photoData);
        onPhotoUpload(photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setPhotoPreview(null);
    startCamera();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-3 sm:p-6 bg-card text-card-foreground shadow-lg">
      <div className="space-y-6">
        {!isCapturing && !photoPreview && (
          <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex gap-4">
              <Button
                onClick={startCamera}
                className="flex items-center gap-2"
                variant="default"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </Button>
              <label>
                <Button
                  className="flex items-center gap-2"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}

        {isCapturing && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button onClick={capturePhoto} variant="default">
                Capture Photo
              </Button>
            </div>
          </div>
        )}

        {photoPreview && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={retakePhoto}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CameraInterface;
