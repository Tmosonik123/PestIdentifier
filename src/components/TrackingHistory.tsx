import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, SortAsc, SortDesc } from "lucide-react";

interface TrackingEntry {
  id: string;
  date: Date;
  pestName: string;
  location: string;
  affectedPlants: string;
  treatmentPlan: string;
}

interface TrackingHistoryProps {
  entries?: TrackingEntry[];
}

const defaultEntries: TrackingEntry[] = [
  {
    id: "1",
    date: new Date("2024-03-15"),
    pestName: "Aphids",
    location: "Vegetable Garden",
    affectedPlants: "Tomatoes, Peppers",
    treatmentPlan: "Neem oil spray applied",
  },
  {
    id: "2",
    date: new Date("2024-03-10"),
    pestName: "Japanese Beetles",
    location: "Rose Garden",
    affectedPlants: "Rose bushes",
    treatmentPlan: "Hand picking and organic pesticide",
  },
];

const TrackingHistory = ({
  entries = defaultEntries,
}: TrackingHistoryProps) => {
  const [date, setDate] = React.useState<Date>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tracking History</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by pest name or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="vegetable">Vegetable Garden</SelectItem>
              <SelectItem value="flower">Flower Garden</SelectItem>
              <SelectItem value="greenhouse">Greenhouse</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{entry.pestName}</h3>
                <p className="text-sm text-gray-500">
                  {format(entry.date, "PPP")}
                </p>
                <p className="mt-2">Location: {entry.location}</p>
                <p>Affected Plants: {entry.affectedPlants}</p>
              </div>
              <div className="md:text-right">
                <h4 className="font-medium">Treatment Plan:</h4>
                <p className="text-sm">{entry.treatmentPlan}</p>
                <Button variant="outline" className="mt-2">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrackingHistory;
