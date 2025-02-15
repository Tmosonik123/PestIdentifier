import React, { useState } from "react";
import CameraInterface from "./CameraInterface";
import PestIdentificationResults from "./PestIdentificationResults";
import TrackingLogForm from "./TrackingLogForm";
import TrackingHistory from "./TrackingHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";

const Home = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const handlePhotoCapture = (photoData: string) => {
    setCurrentPhoto(photoData);
    setShowResults(true);
  };

  const handlePhotoUpload = (photoData: string) => {
    setCurrentPhoto(photoData);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-7xl mx-auto bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Garden Pest Identifier & Tracker
          </h1>

          <Tabs defaultValue="capture" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="capture">Capture & Identify</TabsTrigger>
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
                  <PestIdentificationResults />
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
