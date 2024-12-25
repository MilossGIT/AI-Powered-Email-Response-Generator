# AI-Powered Email Response Generator

A Chrome extension that uses AI to generate contextual email responses with customizable tones. Perfect for Gmail users who want to save time while maintaining professional communication.

## Features

- 🤖 AI-powered response generation
- 🎨 Multiple tone options:
  - Professional
  - Friendly
  - Formal
  - Casual
- 🌓 Dark/Light mode support
- ⚡ Quick insertion into Gmail
- 📋 Easy copy/paste functionality
- 🔄 Context-aware responses

## Installation

### From Source
1. Clone the repository:
```bash
git clone https://github.com/MilossGIT/AI-Powered-Email-Response-Generator.git
cd AI-Powered-Email-Response-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Build the extension:
```bash
npm run build
```

5. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the project

### Usage

1. Open Gmail in Chrome
2. Select an email you want to reply to
3. Click the extension icon
4. Choose your preferred tone
5. Click "Generate Reply"
6. Insert or copy the generated response
7. Edit as needed before sending

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm
- Chrome browser

### Setup Development Environment
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Technologies Used
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Chrome Extensions API
- Vite

## Configuration

The extension can be configured by modifying the following files:
- `src/config.ts` - API and model settings
- `tailwind.config.js` - UI customization
- `manifest.json` - Extension settings

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/YourFeature
```
3. Commit your changes:
```bash
git commit -am 'Add your feature'
```
4. Push to the branch:
```bash
git push origin feature/YourFeature
```
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the API
- Chrome Extensions documentation
- React and TypeScript communities

## Support

For support, please open an issue in the GitHub repository or contact the maintainers directly.

## Project Status

This project is actively maintained. Feel free to contribute or report issues.
