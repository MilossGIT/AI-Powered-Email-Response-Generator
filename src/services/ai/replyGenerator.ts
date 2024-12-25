// src/services/ai/replyGenerator.ts

export type EmailTone = 'professional' | 'friendly' | 'formal' | 'casual';

export interface EmailContent {
    sender: string;
    subject: string;
    body: string;
}

type EmailIntent = 'spam' | 'inquiry' | 'followUp' | 'request' | 'information' | 'generic';

interface EmailAnalysis {
    intent: EmailIntent;
    keywords: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    isSpam: boolean;
    actionRequired: boolean;
    topics: string[];
}

function analyzeEmailContent(body: string, subject: string): EmailAnalysis {
    const combinedText = `${subject} ${body}`.toLowerCase();

    // Spam detection patterns
    const spamPatterns = [
        'spam',
        'advertisement',
        'buy now',
        'click here',
        'limited time',
        'special offer',
        'winner',
        'congratulations you won',
        'urgent payment',
        'lottery',
        'inheritance'
    ];

    // Check for spam indicators
    const isSpam = spamPatterns.some(pattern => combinedText.includes(pattern));

    // Extract topics from brackets if they exist
    const topics = body.match(/\[(.*?)\]/g)?.map(topic => topic.replace(/[\[\]]/g, '')) || [];

    // Determine email intent
    let intent: EmailIntent = 'generic';
    if (isSpam) {
        intent = 'spam';
    } else if (combinedText.includes('follow up') || combinedText.includes('following up')) {
        intent = 'followUp';
    } else if (combinedText.includes('?')) {
        intent = 'inquiry';
    } else if (combinedText.includes('please') || combinedText.includes('could you') || combinedText.includes('would you')) {
        intent = 'request';
    } else if (combinedText.includes('fyi') || combinedText.includes('information')) {
        intent = 'information';
    }

    // Extract key phrases
    const keywords = topics.length > 0 ? topics :
        body.split(/[.,!?]/)
            .map(s => s.trim())
            .filter(s => s.length > 3);

    return {
        intent,
        keywords,
        sentiment: determineSentiment(combinedText),
        isSpam,
        actionRequired: !isSpam && (intent !== 'information'),
        topics
    };
}

function determineSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['thanks', 'good', 'great', 'appreciate', 'please', 'happy'];
    const negativeWords = ['urgent', 'complaint', 'issue', 'problem', 'wrong', 'bad'];

    const positiveScore = positiveWords.filter(word => text.includes(word)).length;
    const negativeScore = negativeWords.filter(word => text.includes(word)).length;

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
}

function generateContextualResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    if (analysis.isSpam) {
        return generateSpamResponse(content.sender, tone);
    }

    switch (analysis.intent) {
        case 'inquiry':
            return generateInquiryResponse(content, analysis, tone);
        case 'followUp':
            return generateFollowUpResponse(content, analysis, tone);
        case 'request':
            return generateRequestResponse(content, analysis, tone);
        case 'information':
            return generateInformationResponse(content, analysis, tone);
        default:
            return generateGenericResponse(content, analysis, tone);
    }
}

function generateSpamResponse(sender: string, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${sender},\n\nThank you for your message. However, I am unable to process your request at this time as it appears to be unsolicited. If you believe this is an error, please provide additional context or verification.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${sender},\n\nThanks for the message, but I think there might be some confusion here. If this is a legitimate request, could you please provide more details?\n\nBest,\nAI Assistant`,
        formal: `Dear ${sender},\n\nI acknowledge receipt of your communication. However, I must inform you that I cannot proceed with your request as it appears to be unsolicited. If this determination is incorrect, please provide proper verification.\n\nRespectfully,\nAI Assistant`,
        casual: `Hey ${sender},\n\nJust got your message - looks like it might be spam? If not, let me know with more details!\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

function generateInquiryResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${content.sender},\n\nThank you for your inquiry regarding ${content.subject}. I will investigate your questions${analysis.topics.length > 0 ? ` about ${analysis.topics.join(' and ')}` : ''} and provide you with a comprehensive response shortly.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${content.sender},\n\nThanks for asking about ${content.subject}! I'll look into this${analysis.topics.length > 0 ? ` (especially the ${analysis.topics.join(' and ')})` : ''} and get back to you soon.\n\nBest,\nAI Assistant`,
        formal: `Dear ${content.sender},\n\nI acknowledge your inquiry concerning ${content.subject}. I shall investigate the matter${analysis.topics.length > 0 ? ` regarding ${analysis.topics.join(' and ')}` : ''} and respond accordingly.\n\nYours sincerely,\nAI Assistant`,
        casual: `Hey ${content.sender},\n\nGot your questions about ${content.subject}! I'll check this out${analysis.topics.length > 0 ? ` (the ${analysis.topics.join(' and ')})` : ''} and let you know.\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

function generateFollowUpResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${content.sender},\n\nThank you for following up regarding ${content.subject}. I will prioritize this matter and provide you with a status update as soon as possible${analysis.topics.length > 0 ? ` concerning ${analysis.topics.join(' and ')}` : ''}.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${content.sender},\n\nThanks for checking in about ${content.subject}! I'll get you an update ASAP${analysis.topics.length > 0 ? ` on ${analysis.topics.join(' and ')}` : ''}.\n\nBest,\nAI Assistant`,
        formal: `Dear ${content.sender},\n\nI acknowledge your follow-up correspondence regarding ${content.subject}. I shall expedite this matter${analysis.topics.length > 0 ? ` concerning ${analysis.topics.join(' and ')}` : ''} and provide a prompt update.\n\nYours sincerely,\nAI Assistant`,
        casual: `Hey ${content.sender},\n\nThanks for the nudge about ${content.subject}! I'm on it${analysis.topics.length > 0 ? ` - will update you on ${analysis.topics.join(' and ')}` : ''} soon.\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

function generateRequestResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${content.sender},\n\nThank you for your request regarding ${content.subject}. I will process this promptly${analysis.topics.length > 0 ? ` with attention to ${analysis.topics.join(' and ')}` : ''}.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${content.sender},\n\nGot your request about ${content.subject}! I'll take care of this${analysis.topics.length > 0 ? ` (${analysis.topics.join(' and ')})` : ''} for you.\n\nBest,\nAI Assistant`,
        formal: `Dear ${content.sender},\n\nI acknowledge your request concerning ${content.subject}. I shall proceed with the necessary actions${analysis.topics.length > 0 ? ` regarding ${analysis.topics.join(' and ')}` : ''}.\n\nYours sincerely,\nAI Assistant`,
        casual: `Hey ${content.sender},\n\nThanks for asking about ${content.subject}! I'll handle this${analysis.topics.length > 0 ? ` (${analysis.topics.join(' and ')})` : ''} for you.\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

function generateInformationResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${content.sender},\n\nThank you for sharing the information about ${content.subject}. I have noted the details${analysis.topics.length > 0 ? ` regarding ${analysis.topics.join(' and ')}` : ''}.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${content.sender},\n\nThanks for letting me know about ${content.subject}! Got it${analysis.topics.length > 0 ? ` (about ${analysis.topics.join(' and ')})` : ''}.\n\nBest,\nAI Assistant`,
        formal: `Dear ${content.sender},\n\nI acknowledge receipt of your information concerning ${content.subject}. The details${analysis.topics.length > 0 ? ` regarding ${analysis.topics.join(' and ')}` : ''} have been duly noted.\n\nYours sincerely,\nAI Assistant`,
        casual: `Hey ${content.sender},\n\nThanks for the info about ${content.subject}! Noted${analysis.topics.length > 0 ? ` (${analysis.topics.join(' and ')})` : ''}.\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

function generateGenericResponse(content: EmailContent, analysis: EmailAnalysis, tone: EmailTone): string {
    const templates = {
        professional: `Dear ${content.sender},\n\nThank you for your message regarding ${content.subject}. I will review this${analysis.topics.length > 0 ? ` (${analysis.topics.join(' and ')})` : ''} and respond appropriately.\n\nBest regards,\nAI Assistant`,
        friendly: `Hi ${content.sender},\n\nThanks for reaching out about ${content.subject}! I'll take a look${analysis.topics.length > 0 ? ` at ${analysis.topics.join(' and ')}` : ''} and get back to you.\n\nBest,\nAI Assistant`,
        formal: `Dear ${content.sender},\n\nI acknowledge your message concerning ${content.subject}. I shall review the matter${analysis.topics.length > 0 ? ` regarding ${analysis.topics.join(' and ')}` : ''} accordingly.\n\nYours sincerely,\nAI Assistant`,
        casual: `Hey ${content.sender},\n\nThanks for the message about ${content.subject}! I'll check this out${analysis.topics.length > 0 ? ` (${analysis.topics.join(' and ')})` : ''} and let you know.\n\nCheers,\nAI Assistant`
    };

    return templates[tone];
}

export function generateReply(content: EmailContent, tone: EmailTone): string {
    try {
        if (!content.body || !content.sender || !content.subject) {
            throw new Error('Invalid email content. Missing required fields.');
        }

        const analysis = analyzeEmailContent(content.body, content.subject);
        return generateContextualResponse(content, analysis, tone);
    } catch (error) {
        console.error('Error generating reply:', error);
        return `Dear ${content.sender},\n\nI apologize, but I am unable to process this request at the moment. Please try again later.\n\nBest regards,\nAI Assistant`;
    }
}