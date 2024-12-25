import { EmailContent } from '@/types/common';

export interface GmailResponse {
  content: EmailContent;
  error?: string;
}

export interface InsertReplyRequest {
  action: 'insertReply';
  text: string;
}