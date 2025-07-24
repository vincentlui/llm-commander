# LLM Commander

A modern web application for interacting with Large Language Models through OpenRouter. Built with React, TypeScript, and Vite.

## Features

- **Header Bar**: Clean header displaying the app name
- **Navigation Panel**: Left sidebar with tabs for Chat, Rules, and Settings
- **Chat Interface**: Interactive chat interface for LLM conversations
- **Model Selection**: Choose from various OpenRouter LLM models including:
  - OpenAI GPT models (GPT-3.5, GPT-4)
  - Anthropic Claude models
  - Google Gemini models
  - Meta Llama models
- **Custom Instructions**: Define custom instructions in the Rules tab that get prepended to every chat prompt
- **Settings Management**: Secure local storage of OpenRouter API key

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Setup

1. **Configure API Key**: Go to the Settings tab and enter your OpenRouter API key
2. **Set Custom Instructions** (optional): In the Rules tab, define any custom instructions or context for the AI
3. **Start Chatting**: Switch to the Chat tab, select a model, and start your conversation

## Usage

### Chat Tab
- Select your preferred LLM model from the dropdown
- Type your message and press Enter or click Send
- View conversation history with timestamps
- Messages are formatted clearly with user and assistant indicators

### Rules Tab
- Define custom instructions that will be prepended to every chat prompt
- Use this to set the AI's behavior, expertise areas, or response style
- Instructions are saved locally and persist between sessions

### Settings Tab
- Enter and manage your OpenRouter API key
- View information about supported models
- All settings are stored locally in your browser

## Technical Details

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with custom dark theme
- **Icons**: Lucide React
- **API**: OpenRouter REST API
- **Storage**: Browser localStorage for settings persistence

## Security

- Your API key is stored locally in your browser only
- No data is sent to any servers except OpenRouter's API
- All conversations happen directly between your browser and OpenRouter

## Development

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## License

This project is open source and available under the MIT License.
