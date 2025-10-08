/**
 * NameQuestion Component
 * Name input with optional nicknames
 * 
 * Single Responsibility: Render name + nickname inputs
 * Props: 4 (under the 7-prop limit)
 */

import { useState, useEffect } from 'react';
import { Input, Button } from '@/modules/ui';
import type { NameData } from '@/types';
import type { QuestionComponentProps } from '../QuestionRegistry';
import { UI_CONFIG } from '@/config';

/**
 * Name question component
 */
export const NameQuestion: React.FC<QuestionComponentProps> = ({
  value,
  onChange,
  error,
}) => {
  const nameData = (value as NameData) || { name: '', nicknames: [] };
  
  const [name, setName] = useState(nameData.name || '');
  const [nicknames, setNicknames] = useState<string[]>(
    nameData.nicknames?.length > 0 ? nameData.nicknames : ['']
  );
  const [showNicknames, setShowNicknames] = useState(!!nameData.name);

  // Show nicknames section when name is entered
  useEffect(() => {
    if (name.trim()) {
      setShowNicknames(true);
    }
  }, [name]);

  // Update parent when data changes
  useEffect(() => {
    const newData = {
      name,
      nicknames: nicknames.filter((n) => n.trim()),
    };
    
    // Only call onChange if data actually changed
    if (JSON.stringify(newData) !== JSON.stringify(nameData)) {
      onChange(newData);
    }
  }, [name, nicknames]); // Removed onChange from dependencies to prevent infinite loop

  // Add nickname field
  const addNickname = () => {
    if (nicknames.length < UI_CONFIG.MAX_NICKNAME_COUNT) {
      setNicknames([...nicknames, '']);
    }
  };

  // Update specific nickname
  const updateNickname = (index: number, value: string) => {
    const newNicknames = [...nicknames];
    newNicknames[index] = value;
    setNicknames(newNicknames);
  };

  return (
    <div className="fyw-space-y-6">
      {/* Name input */}
      <Input
        label="What's your name?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name..."
        required
        error={error}
        autoFocus
      />

      {/* Nicknames section */}
      {showNicknames && (
        <div className="fyw-space-y-4 fyw-animate-fadeIn">
          <p className="fyw-text-sm fyw-text-fyw-gray-400">
            Do you have a nickname?{' '}
            <span className="fyw-text-fyw-gray-500">
              (Optional • Up to {UI_CONFIG.MAX_NICKNAME_COUNT})
            </span>
          </p>

          {/* Nickname inputs */}
          {nicknames.map((nickname, index) => (
            <Input
              key={index}
              value={nickname}
              onChange={(e) => updateNickname(index, e.target.value)}
              placeholder={`Nickname ${index + 1}...`}
            />
          ))}

          {/* Add nickname button */}
          {nicknames.length < UI_CONFIG.MAX_NICKNAME_COUNT && (
            <Button variant="secondary" onClick={addNickname} fullWidth>
              + Add another nickname
            </Button>
          )}
        </div>
      )}
    </div>
  );
};


