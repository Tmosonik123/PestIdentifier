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
    <div className="flex items-center gap-4 p-2 rounded-lg bg-muted/50">
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
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="New Zealand">New Zealand</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Philippines">Philippines</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSelector;
