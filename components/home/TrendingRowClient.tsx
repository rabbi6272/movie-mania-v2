"use client";
import { useState } from "react";

import { Button } from "../ui/Button";

const TIME_WINDOWS = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
] as const;

type TimeWindow = (typeof TIME_WINDOWS)[number]["value"];

const ROW_CLASSES = "flex gap-3 overflow-x-auto pb-4 scrollbar-hide";

export function TrendingRowClient({
  day,
  week,
}: {
  day: React.ReactNode;
  week: React.ReactNode;
}) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("week");

  return (
    <div className="w-full mx-auto px-2 md:px-4 mt-4 lg:mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-900 font-nunito font-bold text-lg md:text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-500">local_fire_department</span>
          Trending Now
        </h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {TIME_WINDOWS.map((window) => (
            <Button
              key={window.value}
              onClick={() => setTimeWindow(window.value)}
              varient={timeWindow === window.value ? "primary" : "outline"}
              size="sm"
            >
              {window.label}
            </Button>
          ))}
        </div>
      </div>

      <div className={timeWindow === "week" ? ROW_CLASSES : "hidden"}>{week}</div>
      <div className={timeWindow === "day" ? ROW_CLASSES : "hidden"}>{day}</div>
    </div>
  );
}
