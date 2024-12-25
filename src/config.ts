interface Config {
    apiKey: string;
    endpoint: string;
    model: string;
}

const config: Config = {
    apiKey: process.env.VITE_OPENAI_API_KEY || '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo'
} as const;

export default config;