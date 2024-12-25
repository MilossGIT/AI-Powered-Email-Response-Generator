import React, { useState, useEffect } from 'react';
import { EmailContent, ToneType } from '@/types/common';
import { Icon } from '@/components/Icons';
import { AIService } from '@/services/ai';

const TONE_OPTIONS = [
    {
        value: 'professional' as const,
        label: 'Professional',
        icon: '👔',
        description: 'Business-appropriate'
    },
    {
        value: 'friendly' as const,
        label: 'Friendly',
        icon: '😊',
        description: 'Warm and approachable'
    },
    {
        value: 'formal' as const,
        label: 'Formal',
        icon: '📜',
        description: 'Traditional'
    },
    {
        value: 'casual' as const,
        label: 'Casual',
        icon: '✌️',
        description: 'Relaxed'
    }
] as const;

export const App: React.FC = () => {
    const [emailContent, setEmailContent] = useState<EmailContent | null>(null);
    const [error, setError] = useState<string>('');
    const [tone, setTone] = useState<ToneType>('professional');
    const [generating, setGenerating] = useState(false);
    const [generatedReply, setGeneratedReply] = useState<string>('');
    const [darkMode, setDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const checkGmailAndGetContent = async () => {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                if (!tab.id) {
                    setError('Unable to access current tab');
                    return;
                }

                if (!tab.url?.includes('mail.google.com')) {
                    setError('Please open Gmail to use this extension');
                    return;
                }

                chrome.tabs.sendMessage(
                    tab.id,
                    { action: 'getSelectedEmail' },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            setError('Please refresh Gmail and try again');
                            return;
                        }

                        if (response?.error) {
                            setError('Select an email to generate a reply');
                            return;
                        }

                        if (response?.content) {
                            setEmailContent(response.content);
                            setError('');
                        }
                    }
                );
            } catch (err) {
                setError('Error accessing Gmail');
                console.error('Error:', err);
            }
        };

        checkGmailAndGetContent();
    }, []);

    const handleGenerateReply = async () => {
        if (!emailContent) return;

        setGenerating(true);
        try {
            const aiService = new AIService();
            const reply = await aiService.generateReply(emailContent, tone);
            setGeneratedReply(reply);
            setError('');
        } catch (err) {
            console.error('Error generating reply:', err);
            setError('Failed to generate reply. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedReply);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleInsertReply = async () => {
        if (!generatedReply) return;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.id) return;

            await chrome.tabs.sendMessage(tab.id, {
                action: 'insertReply',
                text: generatedReply
            });
            window.close();
        } catch (err) {
            console.error('Failed to insert reply:', err);
        }
    };

    return (
        <div className={`w-[400px] h-[600px] ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="flex flex-col h-full">
                {/* Header - Fixed */}
                <div className="flex-none p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Icon name="Mail" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div className="absolute -right-1 -bottom-1">
                                    <Icon name="Sparkles" className="w-3 h-3 text-yellow-400" />
                                </div>
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Reply</h1>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Icon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Main content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 space-y-4">
                        {error ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <Icon name="AlertCircle" className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                            </div>
                        ) : (
                            emailContent && (
                                <>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {emailContent.subject}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {emailContent.body}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Select Tone
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {TONE_OPTIONS.map((option) => (
                                                <button
                                                    key={option.value}
                                                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-all
                            flex items-center justify-center space-x-2
                            ${tone === option.value
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                                                    onClick={() => setTone(option.value)}
                                                >
                                                    <span>{option.icon}</span>
                                                    <span>{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        className={`w-full py-3 px-4 rounded-lg text-white font-medium
                      flex items-center justify-center space-x-2
                      ${!generating
                                                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                                                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                                        onClick={handleGenerateReply}
                                        disabled={generating}
                                    >
                                        {generating ? (
                                            <>
                                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="Wand2" className="w-5 h-5 text-white" />
                                                <span>Generate Reply</span>
                                            </>
                                        )}
                                    </button>

                                    {generatedReply && (
                                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Generated Reply
                                                </h2>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        onClick={handleCopy}
                                                    >
                                                        <Icon name={copied ? "Check" : "Copy"} className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        onClick={handleInsertReply}
                                                    >
                                                        <Icon name="ArrowRight" className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                                {generatedReply}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex-none border-t dark:border-gray-700 p-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Icon name="RefreshCw" className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>
        </div>
    );
};