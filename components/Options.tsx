import React from 'react';
import { Button } from './ui/button'; // Assuming you have a Button component from Shadcn

interface OptionsProps {
  onSave: () => void;
}

const Options: React.FC<OptionsProps> = ({ onSave }) => {

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Save Button */}
      <Button onClick={onSave} className="ml-4">
        Save
      </Button>
    </div>
  );
};

export default Options;
