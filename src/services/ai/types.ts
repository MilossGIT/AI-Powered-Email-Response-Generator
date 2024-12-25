import { EmailContent, EmailTone, ReplyLength } from '@/types/common';

export interface AIServiceConfig {
  apiKey: string;
  endpoint: string;
  model: string;
}

export interface GenerateReplyParams {
  emailData: EmailContent;
  tone: EmailTone;
  length: ReplyLength;
}