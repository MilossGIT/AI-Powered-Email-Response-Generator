import React from 'react';
import { ReplyLength } from '@/types/common';

interface LengthSelectorProps {
    selectedLength: ReplyLength;
    onLengthSelect: (length: ReplyLength) => void;
    disabled?: boolean;
}

const lengthOptions: Array<{ value: ReplyLength; label: string; icon: string }> = [
    { value: 'short', label: 'Short', icon: '📝' },
    { value: 'medium', label: 'Medium', icon: '📄' },
    { value: 'long', label: 'Long', icon: '📑' }
];

export const LengthSelector: React.FC<LengthSelectorProps> = ({
    selectedLength,
    onLengthSelect,
    disabled = false
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Response Length</label>
            <div className="grid grid-cols-3 gap-2">
                {lengthOptions.map(({ value, label, icon }) => (
                    <button
                        key={value}
                        onClick={() => onLengthSelect(value)}
                        disabled={disabled}
                        className={`
                            p-3 rounded-lg flex items-center justify-center space-x-2
                            transition-colors duration-200
                            ${selectedLength === value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};