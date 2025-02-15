import React from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TrackingLogFormProps {
  onSubmit?: (data: TrackingLogData) => void;
  initialData?: TrackingLogData;
}

interface TrackingLogData {
  date: Date;
  location: string;
  affectedPlants: string;
  treatmentPlan: string;
  notes: string;
}

const TrackingLogForm = ({
  onSubmit,
  initialData = {
    date: new Date(),
    location: "",
    affectedPlants: "",
    treatmentPlan: "",
    notes: "",
  },
}: TrackingLogFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TrackingLogData>({
    defaultValues: initialData,
  });

  const date = watch("date");

  const handleFormSubmit = (data: TrackingLogData) => {
    onSubmit?.(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setValue("date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Back garden, tomato bed"
            {...register("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affectedPlants">Affected Plants</Label>
          <Input
            id="affectedPlants"
            placeholder="e.g., Tomatoes, peppers"
            {...register("affectedPlants")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatmentPlan">Treatment Plan</Label>
          <Textarea
            id="treatmentPlan"
            placeholder="Describe your planned treatment method"
            className="min-h-[100px]"
            {...register("treatmentPlan")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional observations or notes"
            className="min-h-[100px]"
            {...register("notes")}
          />
        </div>

        <Button type="submit" className="w-full">
          Save Entry
        </Button>
      </form>
    </Card>
  );
};

export default TrackingLogForm;
