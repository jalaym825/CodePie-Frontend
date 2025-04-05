"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const ampmOptions = ["AM", "PM"];

function toDateTimeString(date, hour, minute, ampm) {
  if (!date || !hour || !minute || !ampm) return null;
  let h = parseInt(hour, 10);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(h).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${minute}`;
}

export default function DateTimePicker({ setStartTime, setEndTime }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeData, setTimeData] = useState({
    startHour: "",
    startMinute: "",
    startAMPM: "",
    endHour: "",
    endMinute: "",
    endAMPM: "",
  });

  useEffect(() => {
    const { startHour, startMinute, startAMPM, endHour, endMinute, endAMPM } = timeData;
    if (
      startDate &&
      startHour &&
      startMinute &&
      startAMPM &&
      endDate &&
      endHour &&
      endMinute &&
      endAMPM
    ) {
      const start = toDateTimeString(startDate, startHour, startMinute, startAMPM);
      const end = toDateTimeString(endDate, endHour, endMinute, endAMPM);
      if (start && end) {
        setStartTime(start);
        setEndTime(end);
      }
    }
  }, [startDate, endDate, timeData]);

  return (
    <div className="w-full max-w-md space-y-6 text-gray-800">
      {/* Start Date & Time */}
      <div className="space-y-2">
        <label className="block font-medium">Start Date:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-left font-normal text-gray-800">
              {startDate ? format(startDate, "PPP") : <span className="text-gray-500">Pick a start date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 text-gray-700">
          <label className="font-medium">Start Time:</label>
          <select
            className="border rounded px-2 py-1"
            value={timeData.startHour}
            onChange={(e) => setTimeData((prev) => ({ ...prev, startHour: e.target.value }))}
          >
            <option value="">HH</option>
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          :
          <select
            className="border rounded px-2 py-1"
            value={timeData.startMinute}
            onChange={(e) => setTimeData((prev) => ({ ...prev, startMinute: e.target.value }))}
          >
            <option value="">MM</option>
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={timeData.startAMPM}
            onChange={(e) => setTimeData((prev) => ({ ...prev, startAMPM: e.target.value }))}
          >
            <option value="">AM/PM</option>
            {ampmOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {timeData.startHour && timeData.startMinute && timeData.startAMPM && (
          <p className="text-sm text-gray-500 mt-1">
            Selected Start Time: {timeData.startHour}:{timeData.startMinute} {timeData.startAMPM}
          </p>
        )}
      </div>

      {/* End Date & Time */}
      <div className="space-y-2">
        <label className="block font-medium">End Date:</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-left font-normal text-gray-800">
              {endDate ? format(endDate, "PPP") : <span className="text-gray-500">Pick an end date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 text-gray-700">
          <label className="font-medium">End Time:</label>
          <select
            className="border rounded px-2 py-1"
            value={timeData.endHour}
            onChange={(e) => setTimeData((prev) => ({ ...prev, endHour: e.target.value }))}
          >
            <option value="">HH</option>
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          :
          <select
            className="border rounded px-2 py-1"
            value={timeData.endMinute}
            onChange={(e) => setTimeData((prev) => ({ ...prev, endMinute: e.target.value }))}
          >
            <option value="">MM</option>
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={timeData.endAMPM}
            onChange={(e) => setTimeData((prev) => ({ ...prev, endAMPM: e.target.value }))}
          >
            <option value="">AM/PM</option>
            {ampmOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {timeData.endHour && timeData.endMinute && timeData.endAMPM && (
          <p className="text-sm text-gray-500 mt-1">
            Selected End Time: {timeData.endHour}:{timeData.endMinute} {timeData.endAMPM}
          </p>
        )}
      </div>
    </div>
  );
}
