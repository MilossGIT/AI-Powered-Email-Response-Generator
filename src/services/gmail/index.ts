// src/services/gmail/index.ts
import { EmailContent } from '@/types/common';

export class GmailService {
  async getSelectedEmail(): Promise<EmailContent | null> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.id) {
          reject(new Error('No active tab'));
          return;
        }

        chrome.tabs.sendMessage(
          tab.id,
          { action: 'getSelectedEmail' },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
              return;
            }
            resolve(response.content);
          }
        );
      });
    });
  }

  async insertReply(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab.id) {
          reject(new Error('No active tab'));
          return;
        }

        chrome.tabs.sendMessage(
          tab.id,
          { action: 'insertReply', text },
          () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
              return;
            }
            resolve();
          }
        );
      });
    });
  }
}