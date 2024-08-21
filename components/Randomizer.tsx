import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from './ui/button'; // Assuming you have a Button component from Shadcn

interface RandomizerProps {
  onRandomize: (newData: { date: string; level: number }[]) => void;
  dates: string[];
}

const Randomizer: React.FC<RandomizerProps> = ({ onRandomize, dates }) => {
  const [intensity, setIntensity] = useState<number>(3);

  const handleRandomize = () => {
    const newData = dates.map(date => {
      const level = getRandomLevel(intensity);
      return { date, level };
    });

    onRandomize(newData);
  };

  const getRandomLevel = (intensity: number): number => {
    const randomValue = Math.random();
    if (randomValue < 0.1 * intensity) return 4;
    if (randomValue < 0.2 * intensity) return 3;
    if (randomValue < 0.4 * intensity) return 2;
    if (randomValue < 0.7 * intensity) return 1;
    return 0;
  };

  const getStatusText = (intensity: number): string => {
    if (intensity < 1) return "I touch grass";
    if (intensity >= 4) return "GIVE ME A JOB!!!";
    return "I'm a nerd 🤓";
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-4 w-full p-4">
      <h1 className="text-xl">Randomize</h1>
      <Separator />
      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <label htmlFor="intensity-slider" className="mr-2">Intensity:</label>
          <input
            id="intensity-slider"
            type="range"
            min="0.25"
            max="5"
            step="0.25"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="slider w-64 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ffffff ${(intensity - 0.25) * 20}%, #333333 ${(intensity - 0.25) * 20}%)`,
            }}
          />
          <span className="ml-2 text-white w-8">{intensity}</span>
        </div>
        <Button onClick={handleRandomize}>
          Randomize
        </Button>
      </div>

      <div className="">
        <span className="text-lg">{getStatusText(intensity)}</span>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #000000;
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #000000;
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: pointer;
        }

        input[type='range']::-ms-thumb {
          width: 20px;
          height: 20px;
          background: #000000;
          border-radius: 50%;
          border: 2px solid #ffffff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Randomizer;
