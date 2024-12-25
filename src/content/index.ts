import { EmailContent } from '@/types/common';

const SELECTORS = {
    emailContainer: '.h7',
    emailBody: '.a3s.aiL',
    emailSubject: 'h2.hP',
    emailSender: '.gD',
    emailRecipients: '.g2',
    replyBox: '[role="textbox"]'
};

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'getSelectedEmail') {
        const content = getEmailContent();
        console.log('Extracted email content:', content);
        sendResponse(content ? { content } : { error: 'No email selected' });
    } else if (request.action === 'insertReply') {
        insertReply(request.text);
        sendResponse({});
    }
    return true;
});

function getEmailContent(): EmailContent | null {
    try {
        // Get the selected email container
        const container = document.querySelector(SELECTORS.emailContainer);
        if (!container) {
            console.log('Email container not found');
            return null;
        }

        // Get email components
        const bodyElement = container.querySelector(SELECTORS.emailBody);
        const subjectElement = document.querySelector(SELECTORS.emailSubject);
        const senderElement = container.querySelector(SELECTORS.emailSender);
        const recipientElements = container.querySelectorAll(SELECTORS.emailRecipients);

        // Validate required elements
        if (!bodyElement || !subjectElement || !senderElement) {
            console.log('Missing required email elements:', {
                body: !!bodyElement,
                subject: !!subjectElement,
                sender: !!senderElement
            });
            return null;
        }

        // Extract text content and clean it
        const body = bodyElement.textContent?.trim() || '';
        const subject = subjectElement.textContent?.trim() || '';
        const sender = senderElement.textContent?.trim() || '';
        const recipients = Array.from(recipientElements)
            .map(el => el.textContent?.trim() || '')
            .filter(Boolean);

        // Log the extracted content for debugging
        console.log('Raw extracted content:', {
            subject,
            sender,
            recipients,
            bodyLength: body.length,
            bodyPreview: body.substring(0, 100) + '...'
        });

        return {
            subject,
            body,
            sender,
            recipients,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error extracting email content:', error);
        return null;
    }
}

function insertReply(text: string): void {
    try {
        const textarea = document.querySelector(SELECTORS.replyBox) as HTMLElement;
        if (!textarea) {
            console.error('Reply textbox not found');
            return;
        }

        // Focus and set content
        textarea.focus();
        textarea.textContent = text;

        // Dispatch input event to trigger Gmail's UI updates
        const inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);

        console.log('Reply inserted successfully');
    } catch (error) {
        console.error('Error inserting reply:', error);
    }
}