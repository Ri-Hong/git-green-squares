import React, { useState } from 'react';
import { Button } from './ui/button'; // Assuming you have Button and Input components from Shadcn
import { Input } from './ui/input';
import { useToast } from '../components/ui/use-toast'; // Assuming you have a useToast hook
import { patternMapping } from '../utils/patternMapping'; // Import the custom pattern mapping
import { Separator } from "@/components/ui/separator"

// Function to calculate the width of a character based on its pattern
const calculateCharacterWidth = (charPattern: number[]): number => {
  const uniqueColumns = new Set(charPattern.map(p => Math.floor(p / 5))); // Math.floor(p / 5) to get column index
  return uniqueColumns.size; // Number of unique columns determines the width
};

// Function to convert text to a pattern on the contribution chart
const textToPattern = (text: string): number[] | null => {
  let pattern: number[] = [];
  let currentColumnOffset = 0;

  for (const char of text.toUpperCase()) {
    if (char === ' ') {
      // Add 2 columns of empty space for a space character
      currentColumnOffset += 2;
      continue;
    }

    if (!patternMapping.hasOwnProperty(char)) {
      return null; // Return null if any character is not found in the mapping
    }

    const charPattern = patternMapping[char];
    const charWidth = calculateCharacterWidth(charPattern);

    const charPatternWithOffset = charPattern.map(p => {
      const row = (p % 5); // Ensure the pattern uses rows 1 to 5 (middle rows of the grid)
      const col = Math.floor(p / 5);
      return row + (col + currentColumnOffset) * 7;
    });

    pattern = pattern.concat(charPatternWithOffset);
    currentColumnOffset += charWidth + 1; // +1 for 1-pixel space between characters
  }

  return pattern;
};

interface TextToPatternProps {
  onPatternGenerate: (pattern: number[]) => void;
}

const TextToPattern: React.FC<TextToPatternProps> = ({ onPatternGenerate }) => {
  const [textInput, setTextInput] = useState<string>('');
  const { toast } = useToast();

  const handleTextSubmit = () => {
    const pattern = textToPattern(textInput);

    if (pattern === null) {
      toast({
        title: 'Error',
        description: 'Some characters are not supported.',
        variant: 'destructive',
      });
      return; // Prevent submission
    }

    onPatternGenerate(pattern);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value.toUpperCase()); // Convert input to uppercase
  };

  return (
    <div className="flex flex-col items-center mt-4 gap-4 w-full p-4">
      <h1 className="text-xl">Text to Pattern</h1>
      <Separator />

      <div className="flex flex-row gap-5">
        <Input
          type="text"
          placeholder="Enter text to create a pattern"
          value={textInput}
          className={"w-60"}
          onChange={handleInputChange} // Use custom handler to enforce uppercase
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleTextSubmit();
            }
          }}
        />
        <Button onClick={handleTextSubmit}>Generate Pattern</Button>
      </div>
    </div>
  );
};

export default TextToPattern;
