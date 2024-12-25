export type EmailTone = 'professional' | 'casual' | 'friendly' | 'formal';
export type ReplyLength = 'short' | 'medium' | 'long';

export interface EmailContent {
    subject: string;
    body: string;
    sender: string;
    recipients: string[];
    timestamp?: string;
}

export interface GeneratedReply {
    text: string;
    tone: EmailTone;
    length: ReplyLength;
    timestamp: string;
}

export type ToneType = EmailTone;
export type AIResponse = GeneratedReply;

export interface AIServiceConfig {
    apiKey: string;
    endpoint: string;
    model: string;
}