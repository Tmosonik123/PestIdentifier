import React, { useState } from "react";
import type { IdentificationInfo } from "./PestIdentificationResults";
import { identifyFromImage } from "../lib/gemini";
import { Loader2 } from "lucide-react";
import CameraInterface from "./CameraInterface";
import PestIdentificationResults from "./PestIdentificationResults";
import TrackingLogForm from "./TrackingLogForm";
import TrackingHistory from "./TrackingHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";

const Home = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identificationResult, setIdentificationResult] =
    useState<IdentificationInfo | null>(null);
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const handlePhotoCapture = async (photoData: string) => {
    try {
      setCurrentPhoto(photoData);
      setShowResults(true);
      setIsAnalyzing(true);

      const result = await identifyFromImage(photoData);
      setIdentificationResult(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePhotoUpload = handlePhotoCapture;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-7xl mx-auto bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Garden Pest & Disease Identifier
          </h1>

          <Tabs defaultValue="capture" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="capture">Identify Pest/Disease</TabsTrigger>
              <TabsTrigger value="track">Track Pest</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="capture" className="space-y-8">
              {!showResults && (
                <CameraInterface
                  onPhotoCapture={handlePhotoCapture}
                  onPhotoUpload={handlePhotoUpload}
                />
              )}

              {showResults && (
                <div className="space-y-8">
                  {currentPhoto && (
                    <div className="max-w-md mx-auto">
                      <img
                        src={currentPhoto}
                        alt="Captured pest"
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Analyzing image...</span>
                    </div>
                  ) : (
                    <PestIdentificationResults result={identificationResult} />
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="track">
              <TrackingLogForm />
            </TabsContent>

            <TabsContent value="history">
              <TrackingHistory />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Home;
