# LLM Commander

A modern React TypeScript web application that provides an intelligent interface for interacting with Large Language Models through OpenRouter, enhanced with RAG (Retrieval-Augmented Generation) capabilities.

## 🚀 Features

### Core Functionality
- **Multi-Model Support**: Access various LLM models through OpenRouter (GPT-4, Claude, Gemini, Llama, etc.)
- **Modern Chat Interface**: Clean, responsive chat UI with message history
- **Custom Instructions**: Define custom prompts and rules for consistent AI behavior
- **Settings Management**: Secure API key storage and configuration

### RAG (Retrieval-Augmented Generation)
- **File Upload**: Upload and index text files for enhanced responses
- **Smart Search**: Automatic keyword-based search through uploaded documents
- **Context Integration**: Relevant file chunks are automatically included in conversations
- **Visual Context**: See which sources were used for each response

### File Management
- **Local Storage**: Files saved to `.uploaded_files` directory
- **File Server**: Express.js backend for robust file operations
- **Drag & Drop**: Intuitive file upload interface
- **Google Drive Integration**: (Template provided for future implementation)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- OpenRouter API key ([Get one here](https://openrouter.ai))

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/llm-commander.git
   cd llm-commander
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Option 1: Start both frontend and file server
   npm run dev:full
   
   # Option 2: Start separately
   npm run dev          # Frontend (port 5174)
   npm run file-server  # File server (port 3001)
   ```

4. **Configure your API key**
   - Open the app in your browser (http://localhost:5174)
   - Go to Settings tab
   - Enter your OpenRouter API key
   - Save the configuration

5. **Upload files for RAG**
   - Go to Files tab
   - Upload .txt files via drag & drop or file picker
   - Files are automatically indexed for search

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Components**: Modular React components with TypeScript
- **State Management**: React hooks for local state
- **Styling**: CSS modules with responsive design
- **Build Tool**: Vite for fast development and builds

### Backend (Express.js)
- **File Server**: Handles file uploads and storage
- **API Endpoints**: RESTful APIs for file operations
- **Storage**: Local file system with fallback to localStorage

### RAG System
- **Text Chunking**: Automatic segmentation of documents
- **Keyword Search**: Simple but effective search algorithm
- **Context Injection**: Seamless integration with LLM prompts

## 📁 Project Structure

```
llm-commander/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ChatTab.tsx   # Main chat interface
│   │   ├── FilesTab.tsx  # File management
│   │   ├── RulesTab.tsx  # Custom instructions
│   │   └── SettingsTab.tsx # Configuration
│   ├── utils/            # Utility functions
│   └── assets/           # Images and icons
├── fileServer.js         # Express file server
├── GOOGLE_DRIVE_SETUP.md # Google Drive integration guide
└── package.json
```

## 🤖 RAG Usage

1. **Upload Documents**: Add .txt files through the Files tab
2. **Ask Questions**: Chat normally - the system automatically searches files
3. **View Context**: See which file sections influenced each response
4. **Manage Files**: View, delete, and organize your knowledge base

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run dev:full` - Start both frontend and file server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Security

- API keys are stored locally in browser storage
- No data is sent to external servers except OpenRouter
- File uploads are validated for security
- CORS protection enabled on file server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for LLM API access
- [Lucide React](https://lucide.dev) for beautiful icons
- [Vite](https://vitejs.dev) for fast development experience

---

**Made with ❤️ for the AI community**
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
