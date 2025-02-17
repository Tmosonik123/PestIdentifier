import React, { useState } from "react";
import type { IdentificationInfo } from "./PestIdentificationResults";
import { identifyFromImage } from "../lib/gemini";
import { Loader2 } from "lucide-react";
import CameraInterface from "./CameraInterface";
import PestIdentificationResults from "./PestIdentificationResults";
import TrackingLogForm from "./TrackingLogForm";
import { addTrackingEntry } from "../lib/tracking";
import TrackingHistory from "./TrackingHistory";
import AgriChat from "./AgriChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";

const Home = () => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identificationResult, setIdentificationResult] =
    useState<IdentificationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("capture");

  const handlePhotoCapture = async (photoData: string) => {
    try {
      setCurrentPhoto(photoData);
      setShowResults(true);
      setIsAnalyzing(true);

      const result = await identifyFromImage(photoData);
      if ("error" in result && result.error === "no_disease_found") {
        setError("No pest or disease identified in the image");
        setIdentificationResult(null);
      } else {
        setError(null);
        setIdentificationResult(result as IdentificationInfo);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(
        "Error analyzing image. Please check your API key configuration.",
      );
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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="capture">Identify Pest/Disease</TabsTrigger>
              <TabsTrigger value="track">Track Pest & Diseases</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="chat">Ask Expert</TabsTrigger>
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
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setCurrentPhoto(null);
                      setIdentificationResult(null);
                      setError(null);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </button>
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
                    <>
                      {error ? (
                        <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
                          {error}
                        </div>
                      ) : (
                        <PestIdentificationResults
                          result={identificationResult}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="track">
              <TrackingLogForm
                initialData={
                  identificationResult
                    ? {
                        date: new Date(),
                        pestName: identificationResult.name,
                        location: "",
                        affectedPlants:
                          identificationResult.affectedPlants?.join(", ") || "",
                        treatmentPlan:
                          identificationResult.controlMethods?.join("\n") || "",
                        notes: "",
                      }
                    : undefined
                }
                onSubmit={async (data) => {
                  try {
                    const entryData = {
                      ...data,
                      // If we have identification results, include them
                      ...(identificationResult && {
                        confidence: identificationResult.confidence,
                        threatLevel: identificationResult.threatLevel,
                        description: identificationResult.description,
                        symptoms: identificationResult.symptoms,
                        controlMethods: identificationResult.controlMethods,
                        type: identificationResult.type,
                      }),
                    };
                    await addTrackingEntry(entryData);
                    alert("Entry saved successfully!");
                    setActiveTab("history");
                  } catch (error) {
                    console.error("Error saving entry:", error);
                    alert("Error saving entry. Please try again.");
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="chat">
              <AgriChat />
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
