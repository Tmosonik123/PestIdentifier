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

export interface ControlProduct {
  brandName: string;
  activeIngredient: string;
  applicationRate: string;
  applicationMethod: string;
  safeDays: string;
  safetyPrecautions: string;
}

interface ControlMethod {
  method: string;
  products?: ControlProduct[];
  description?: string;
}

interface IdentificationInfo {
  type: "pest" | "disease";
  name: string;
  confidence: number;
  description: string;
  threatLevel: "low" | "medium" | "high";
  controlMethods: ControlMethod[];
  affectedPlants: string[];
  symptoms?: string[];
}

interface IdentificationResultsProps {
  result?: IdentificationInfo;
}

const defaultResult: IdentificationInfo = {
  type: "pest",
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
  symptoms: ["Skeletonized leaves", "Damaged flower buds", "Holes in foliage"],
};

const IdentificationResults: React.FC<IdentificationResultsProps> = ({
  result,
}) => {
  if (!result) return null;
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
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-card text-card-foreground">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Bug className="h-6 w-6" />
            {result.type === "pest" ? "Pest" : "Disease"} Identification Results
          </CardTitle>
          <Badge
            variant="secondary"
            className={getThreatLevelColor(result.threatLevel)}
          >
            {result.threatLevel.charAt(0).toUpperCase() +
              result.threatLevel.slice(1)}{" "}
            Threat
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pest Name and Confidence Score */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{result.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">AI Confidence:</span>
                <Progress value={result.confidence} className="w-32" />
                <span className="text-sm font-medium">
                  {result.confidence}%
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-900">{result.description}</p>
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
                  <div className="space-y-4 pl-4">
                    {result.controlMethods.map((method, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-base">
                          {method.method}
                        </h4>
                        {method.products ? (
                          <div className="space-y-3">
                            {method.products.map((product, pIndex) => (
                              <div
                                key={pIndex}
                                className="bg-muted p-3 rounded-md text-foreground"
                              >
                                <h5 className="font-medium text-sm">
                                  {product.brandName}
                                </h5>
                                <ul className="text-sm space-y-1 mt-1 text-muted-foreground">
                                  <li>
                                    <span className="font-medium">
                                      Active Ingredient:
                                    </span>{" "}
                                    {product.activeIngredient}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Application Rate:
                                    </span>{" "}
                                    {product.applicationRate}
                                  </li>
                                  <li>
                                    <span className="font-medium">Method:</span>{" "}
                                    {product.applicationMethod}
                                  </li>
                                  <li>
                                    <span className="font-medium">
                                      Safe Days:
                                    </span>{" "}
                                    {product.safeDays}
                                  </li>
                                  <li>
                                    <span className="font-medium">Safety:</span>{" "}
                                    {product.safetyPrecautions}
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">
                            {method.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
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
                    {result.affectedPlants.map((plant, index) => (
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

export default IdentificationResults;
