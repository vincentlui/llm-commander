import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText } from 'lucide-react'
import './ChatTab.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  ragContext?: string[]
}

interface FileIndex {
  id: string
  name: string
  content: string
  chunks: string[]
  uploadDate: Date
  size: number
}

const ChatTab = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('qwen/qwen3-235b-a22b-07-25:free')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const openRouterModels = [
    { id: 'qwen/qwen3-235b-a22b-07-25:free', name: 'qwen/qwen3-235b-a22b-07-25:free' },
    { id: 'openai/gpt-4', name: 'GPT-4' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
    { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B' },
  ]

  const searchRelevantChunks = (query: string, topK: number = 3): string[] => {
    const savedFiles = localStorage.getItem('indexed-files')
    if (!savedFiles) return []

    try {
      const files: FileIndex[] = JSON.parse(savedFiles)
      const allChunks: { chunk: string, score: number, fileName: string }[] = []

      // Simple keyword-based search scoring
      const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2)
      
      files.forEach(file => {
        file.chunks.forEach(chunk => {
          const chunkLower = chunk.toLowerCase()
          let score = 0
          
          queryWords.forEach(word => {
            const wordCount = (chunkLower.match(new RegExp(word, 'g')) || []).length
            score += wordCount * word.length // Longer words get higher weight
          })
          
          if (score > 0) {
            allChunks.push({
              chunk: `[From ${file.name}]: ${chunk}`,
              score,
              fileName: file.name
            })
          }
        })
      })

      // Sort by relevance score and return top K
      return allChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.chunk)
    } catch (error) {
      console.error('Error searching files:', error)
      return []
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    // Search for relevant chunks
    const relevantChunks = searchRelevantChunks(inputValue, 3)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      ragContext: relevantChunks.length > 0 ? relevantChunks : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Get API key and custom instructions from localStorage
      const apiKey = localStorage.getItem('openrouter-api-key')
      const customInstructions = localStorage.getItem('custom-instructions') || ''

      if (!apiKey) {
        throw new Error('OpenRouter API key not configured. Please set it in Settings.')
      }

      // Prepare the prompt with custom instructions and RAG context
      let systemMessage = customInstructions 
        ? `${customInstructions}\n\nPlease use the above instructions as context when responding to the user.`
        : ''

      // Add RAG context if available
      if (relevantChunks.length > 0) {
        const ragContext = `\n\nRelevant information from uploaded files:\n${relevantChunks.join('\n\n')}\n\nPlease use this information to help answer the user's question when relevant.`
        systemMessage += ragContext
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'LLM Commander',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
            { role: 'user', content: inputValue }
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const assistantResponse = data.choices[0]?.message?.content || 'No response received'

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-tab">
      <div className="chat-header">
        <div className="model-selector">
          <label htmlFor="model-select">Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            {openRouterModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <Bot size={48} />
            <p>Start a conversation with your selected LLM model</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-icon">
                {message.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                {message.ragContext && message.ragContext.length > 0 && (
                  <div className="rag-context">
                    <div className="rag-header">
                      <FileText size={16} />
                      <span>Context from files ({message.ragContext.length} sources)</span>
                    </div>
                    <div className="rag-sources">
                      {message.ragContext.map((context, index) => (
                        <div key={index} className="rag-source">
                          {context.length > 200 ? context.substring(0, 200) + '...' : context}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="message-text">{message.content}</div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant">
            <div className="message-icon">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="message-input"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatTab
