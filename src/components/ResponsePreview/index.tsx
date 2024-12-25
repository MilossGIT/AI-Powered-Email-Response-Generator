import React from 'react';
import { GeneratedReply } from '@/types/common';

export interface ResponsePreviewProps {
  reply: GeneratedReply;
  onInsert: () => void;
  onRefresh?: () => void;  // Made optional
  disabled?: boolean;
}

export const ResponsePreview: React.FC<ResponsePreviewProps> = ({
  reply,
  onInsert,
  onRefresh,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-400">
            Generated Reply ({reply.tone}, {reply.length})
          </div>
          <div className="text-sm text-gray-400">
            {new Date(reply.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="text-gray-200 whitespace-pre-wrap">
          {reply.text}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onInsert}
          disabled={disabled}
          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert Reply
        </button>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={disabled}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↺ Refresh
          </button>
        )}
      </div>
    </div>
  );
};