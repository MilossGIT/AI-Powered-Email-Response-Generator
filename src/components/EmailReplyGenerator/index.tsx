import React, { useState, useEffect } from 'react';
import { ToneSelector } from '../ToneSelector';
import { ResponsePreview } from '../ResponsePreview';
import { AIService } from '@/services/ai';
import { GmailService } from '@/services/gmail';
import { EmailContent, EmailTone, GeneratedReply } from '@/types/common';

const EmailReplyGenerator: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<EmailContent | null>(null);
    const [selectedTone, setSelectedTone] = useState<EmailTone>('professional');
    const [generatedReply, setGeneratedReply] = useState<GeneratedReply | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleEmailSelect();
    }, []);

    const handleEmailSelect = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const gmailService = new GmailService();
            const email = await gmailService.getSelectedEmail();
            if (email) {
                setSelectedEmail(email);
            }
        } catch (err) {
            setError('Failed to select email. Please try again.');
            console.error('Error selecting email:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateReply = async () => {
        if (!selectedEmail) return;

        try {
            setIsLoading(true);
            setError(null);

            const aiService = new AIService();
            const response = await aiService.generateReply(selectedEmail, selectedTone);

            setGeneratedReply({
                text: response,
                tone: selectedTone,
                length: 'medium',
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate reply';
            setError(`Failed to generate reply: ${errorMessage}`);
            console.error('Error generating reply:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInsertReply = async () => {
        if (!generatedReply) return;

        try {
            setIsLoading(true);
            const gmailService = new GmailService();
            await gmailService.insertReply(generatedReply.text);
            window.close();
        } catch (err) {
            setError('Failed to insert reply. Please try again.');
            console.error('Error inserting reply:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        await handleGenerateReply();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-300">Processing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {selectedEmail ? (
                    <div className="space-y-6">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-white">
                                {selectedEmail.subject}
                            </h2>
                            <p className="text-gray-300">From: {selectedEmail.sender}</p>
                            <p className="text-gray-300">
                                To: {selectedEmail.recipients.join(', ')}
                            </p>
                            <p className="text-gray-400 mt-2 text-sm whitespace-pre-wrap">
                                {selectedEmail.body}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <ToneSelector
                                selectedTone={selectedTone}
                                onToneSelect={setSelectedTone}
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleGenerateReply}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                Generate AI Reply
                            </button>

                            {generatedReply && (
                                <ResponsePreview
                                    reply={generatedReply}
                                    onInsert={handleInsertReply}
                                    onRefresh={handleRefresh}
                                    disabled={isLoading}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-300 py-8">
                        <p className="mb-4">No email selected</p>
                        <button
                            onClick={handleEmailSelect}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Select Email
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailReplyGenerator;