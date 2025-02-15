import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Bug, Info, AlertTriangle, Sprout } from "lucide-react";

interface PestInfo {
  name: string;
  confidence: number;
  description: string;
  threatLevel: "low" | "medium" | "high";
  controlMethods: string[];
  affectedPlants: string[];
}

interface PestIdentificationResultsProps {
  pestInfo?: PestInfo;
}

const defaultPestInfo: PestInfo = {
  name: "Japanese Beetle",
  confidence: 92,
  description:
    "A destructive garden pest that feeds on leaves, flowers, and fruits of many plants.",
  threatLevel: "high",
  controlMethods: [
    "Handpick beetles in early morning",
    "Use neem oil spray",
    "Install beetle traps away from plants",
    "Apply milky spore to lawn",
  ],
  affectedPlants: ["Roses", "Grape vines", "Japanese maple", "Fruit trees"],
};

const PestIdentificationResults: React.FC<PestIdentificationResultsProps> = ({
  pestInfo = defaultPestInfo,
}) => {
  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bug className="h-6 w-6" />
            Pest Identification Results
          </CardTitle>
          <Badge
            variant="secondary"
            className={getThreatLevelColor(pestInfo.threatLevel)}
          >
            {pestInfo.threatLevel.charAt(0).toUpperCase() +
              pestInfo.threatLevel.slice(1)}{" "}
            Threat
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pest Name and Confidence Score */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{pestInfo.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">AI Confidence:</span>
                <Progress value={pestInfo.confidence} className="w-32" />
                <span className="text-sm font-medium">
                  {pestInfo.confidence}%
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-900">{pestInfo.description}</p>
            </div>

            {/* Detailed Information Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {/* Control Methods */}
              <AccordionItem value="control-methods">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Control Methods
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {pestInfo.controlMethods.map((method, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {method}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Affected Plants */}
              <AccordionItem value="affected-plants">
                <AccordionTrigger className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Affected Plants
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {pestInfo.affectedPlants.map((plant, index) => (
                      <Badge key={index} variant="outline">
                        {plant}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PestIdentificationResults;
