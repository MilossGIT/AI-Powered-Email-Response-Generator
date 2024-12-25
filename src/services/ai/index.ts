// src/services/ai/index.ts
import { EmailContent, EmailTone } from '@/types/common';

export class AIService {
    private apiKey: string;
    private endpoint: string;
    private model: string;

    constructor() {
        // Add validation for API key
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
        }

        this.apiKey = apiKey;
        this.endpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';

        // Log config status (remove in production)
        console.log('AI Service initialized:', {
            hasApiKey: !!this.apiKey,
            endpoint: this.endpoint,
            model: this.model
        });
    }

    async generateReply(emailData: EmailContent, tone: EmailTone): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key is not configured');
        }

        try {
            const prompt = `Generate a ${tone} tone email reply.

Original Email:
Subject: ${emailData.subject}
From: ${emailData.sender}
Message: ${emailData.body}

Requirements:
1. Use a ${tone} tone consistently
2. Make the reply contextually relevant
3. Address specific points and questions
4. If there are topics in [brackets], address them specifically
5. Keep the response concise but complete
6. Include a proper greeting and closing

Generate the reply:`;

            console.log('Making API request with prompt:', prompt);

            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: "You are an AI email assistant that generates contextually appropriate replies. Always analyze the email carefully and address specific points raised."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                    presence_penalty: 0.6,
                    frequency_penalty: 0.8
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('API Error Response:', error);
                throw new Error(error.error?.message || 'Failed to generate reply');
            }

            const data = await response.json();
            console.log('API Response:', data);
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating reply:', error);
            throw error;
        }
    }
}