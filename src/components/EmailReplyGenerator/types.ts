export type EmailTone = 'professional' | 'casual' | 'friendly' | 'formal';
export type ReplyLength = 'short' | 'medium' | 'long';

export interface EmailData {
  subject: string;
  body: string;
  sender: string;
  recipients: string[];
}

export interface GeneratedReply {
  text: string;
  tone: EmailTone;
  length: ReplyLength;
}
