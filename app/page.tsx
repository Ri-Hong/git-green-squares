'use client'

import React, { useState, useEffect } from 'react';
import ContributionChart from '@/components/ContributionChart';
import Randomizer from '@/components/Randomizer';
import { useToast } from '@/components/ui/use-toast';
import TextToPattern from '@/components/TextToPattern';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ChevronsLeft, ChevronsRight, Undo, Redo } from "lucide-react"

const generateAllDatesInYear = (year: number): string[] => {
  const dates: string[] = [];
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export default function Home() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<{ date: string; level: number }[]>([]);
  const [history, setHistory] = useState<{ date: string; level: number }[][]>([]);
  const [redoStack, setRedoStack] = useState<{ date: string; level: number }[][]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/git-green-squares/contributions.json');
      const data = await response.json();
      setData(data);
    };

    loadData();
  }, []);

  const handleCellClick = (date: string) => {
    updateData(prevData => {
      const existingEntry = prevData.find(d => d.date === date);
      if (existingEntry) {
        return prevData.map(d =>
          d.date === date ? { ...d, level: (d.level + 1) % 5 } : d
        );
      } else {
        return [...prevData, { date, level: 1 }];
      }
    });
  };

  const handleRandomize = (newData: { date: string; level: number }[]) => {
    updateData(prevData => {
      const prevDataMap = new Map(prevData.map(entry => [entry.date, entry]));

      newData.forEach(newEntry => {
        if (prevDataMap.has(newEntry.date)) {
          prevDataMap.set(newEntry.date, { date: newEntry.date, level: newEntry.level });
        } else {
          prevDataMap.set(newEntry.date, newEntry);
        }
      });

      return Array.from(prevDataMap.values());
    });
  };

  const handleSave = async () => {
    const filteredData = data.filter(entry => entry.level !== 0);

    const response = await fetch('/api/save-contributions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: filteredData }),
    });

    if (response.ok) {
      toast({
        title: 'Success',
        description: 'Data saved successfully!',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save data.',
        variant: 'destructive'
      });
    }
  };

  const handlePatternGenerate = (pattern: number[]) => {
    setData(prevData => {
      const allDates = generateAllDatesInYear(selectedYear);
  
      const patternDates = pattern.map(index => ({
        date: allDates[index],
        level: 4, // Set the level for lit squares
      }));
  
      const updatedDataMap = new Map(prevData.map(entry => [entry.date, entry.level]));
  
      patternDates.forEach(({ date, level }) => {
        updatedDataMap.set(date, level); // Overwrite or add new entries
      });
  
      // Convert the map back to an array
      return Array.from(updatedDataMap, ([date, level]) => ({ date, level }));
    });
  };

  const updateData = (updateFn: (prevData: { date: string; level: number }[]) => { date: string; level: number }[]) => {
    setHistory(prevHistory => [...prevHistory, data]); // Save current state to history
    setRedoStack([]); // Clear redo stack when new change is made
    setData(updateFn);
    console.log(data)
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack(prevRedo => [data, ...prevRedo]);
      setHistory(prevHistory => prevHistory.slice(0, -1));
      setData(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory(prevHistory => [...prevHistory, data]);
      setRedoStack(prevRedo => prevRedo.slice(1));
      setData(nextState);
    }
  };

  const shiftRight = () => {
    updateData(prevData => {
      if (prevData.length === 0) return prevData;
  
      // Determine the range of years based on the existing data
      const years = [...new Set(prevData.map(entry => new Date(entry.date).getFullYear()))];
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
  
      // Generate all dates across the range of years
      const allDates = [];
      for (let year = minYear; year <= maxYear + 1; year++) {
        allDates.push(...generateAllDatesInYear(year));
      }
  
      // Create a map of the current data for quick lookup
      const dataMap = new Map(prevData.map(entry => [entry.date, entry.level]));
  
      // Create a full data array with levels, filling in missing dates with level 0
      const fullData = allDates.map(date => ({
        date,
        level: dataMap.get(date) || 0,
      }));
  
      // Perform the right shift by 7 days
      const shiftedData = fullData.map((entry, index) => {
        const newIndex = (index + 7) % fullData.length; // shift by one week (7 days)
        return { date: fullData[newIndex].date, level: entry.level };
      });
  
      // Filter to retain only dates that have non-zero levels
      return shiftedData.filter(entry => entry.level !== 0);
    });
  };
  
  const shiftLeft = () => {
    updateData(prevData => {
      if (prevData.length === 0) return prevData;
  
      // Determine the range of years based on the existing data
      const years = Array.from(new Set(prevData.map(entry => new Date(entry.date).getFullYear())));
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
  
      // Generate all dates across the range of years
      const allDates = [];
      for (let year = minYear - 1; year <= maxYear; year++) {
        allDates.push(...generateAllDatesInYear(year));
      }
  
      // Create a map of the current data for quick lookup
      const dataMap = new Map(prevData.map(entry => [entry.date, entry.level]));
  
      // Create a full data array with levels, filling in missing dates with level 0
      const fullData = allDates.map(date => ({
        date,
        level: dataMap.get(date) || 0,
      }));
  
      // Perform the left shift by 7 days
      const shiftedData = fullData.map((entry, index) => {
        const newIndex = (index - 7 + fullData.length) % fullData.length; // shift by one week (7 days)
        return { date: fullData[newIndex].date, level: entry.level };
      });
  
      // Filter to retain only dates that have non-zero levels
      return shiftedData.filter(entry => entry.level !== 0);
    });
  };
  
  
  

  const allDatesInYear = generateAllDatesInYear(selectedYear);

  return (
    <div className="flex flex-col items-center p-8">

      <h1 className="text-center text-4xl font-bold mb-6">Git Green Squares</h1>

        <ContributionChart
          data={data}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onCellClick={handleCellClick}
          />

        <div className="w-2/5">
          <Randomizer onRandomize={handleRandomize} dates={allDatesInYear} />
          <TextToPattern onPatternGenerate={handlePatternGenerate} />

          <div className="flex flex-col items-center mt-4 gap-4 w-full p-4">
          <h1 className="text-xl">Utilities</h1>
            <Separator />
            <div className="flex gap-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleUndo} variant="outline" size="icon" disabled={history.length === 0}>
                    <Undo className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleRedo} variant="outline" size="icon" disabled={redoStack.length === 0}>
                    <Redo className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={shiftLeft} variant="outline" size="icon" >
                    <ChevronsLeft className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shift Left</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={shiftRight} variant="outline" size="icon" >
                    <ChevronsRight className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shift Right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={handleSave}>
              Save
            </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
