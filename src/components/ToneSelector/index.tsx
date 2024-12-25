import React from 'react';
import { EmailTone } from '@/types/common';

interface ToneSelectorProps {
  selectedTone: EmailTone;
  onToneSelect: (tone: EmailTone) => void;
  disabled?: boolean;
}

const toneOptions: Array<{ value: EmailTone; label: string; icon: string }> = [
  { value: 'professional', label: 'Professional', icon: '👔' },
  { value: 'friendly', label: 'Friendly', icon: '😊' },
  { value: 'formal', label: 'Formal', icon: '📜' },
  { value: 'casual', label: 'Casual', icon: '✌️' }
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneSelect, disabled }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white">Response Tone</label>
    <div className="grid grid-cols-2 gap-2">
      {toneOptions.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onToneSelect(value)}
          disabled={disabled}
          className={`
                        px-4 py-3 rounded-lg transition-all
                        flex items-center justify-center space-x-2
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedTone === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }
                    `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  </div>
);