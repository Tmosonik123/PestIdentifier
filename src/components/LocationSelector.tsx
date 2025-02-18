import React from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MapPin } from "lucide-react";
import type { LocationInfo } from "../lib/location";

interface LocationSelectorProps {
  location?: LocationInfo;
  onLocationChange: (location: LocationInfo) => void;
}

const LocationSelector = ({
  location,
  onLocationChange,
}: LocationSelectorProps) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 w-[200px]">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 grid gap-2">
        <Label htmlFor="country">Location</Label>
        <Select
          value={location?.country || ""}
          onValueChange={(value) =>
            onLocationChange({
              country: value,
              region: "",
              city: "",
            })
          }
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="South Africa">South Africa</SelectItem>
            <SelectItem value="Kenya">Kenya</SelectItem>
            <SelectItem value="Nigeria">Nigeria</SelectItem>
            <SelectItem value="Tanzania">Tanzania</SelectItem>
            <SelectItem value="Uganda">Uganda</SelectItem>
            <SelectItem value="Ghana">Ghana</SelectItem>
            <SelectItem value="Ethiopia">Ethiopia</SelectItem>
            <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
            <SelectItem value="Zambia">Zambia</SelectItem>
            <SelectItem value="Morocco">Morocco</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
