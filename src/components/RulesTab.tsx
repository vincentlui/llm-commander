import { useState, useEffect } from 'react'
import { Save, RefreshCw } from 'lucide-react'
import './RulesTab.css'

const RulesTab = () => {
  const [customInstructions, setCustomInstructions] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    // Load custom instructions from localStorage on component mount
    const saved = localStorage.getItem('custom-instructions')
    if (saved) {
      setCustomInstructions(saved)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('custom-instructions', customInstructions)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    setCustomInstructions('')
    localStorage.removeItem('custom-instructions')
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const exampleInstructions = `You are a helpful AI assistant with the following guidelines:

1. Always be polite and professional
2. Provide clear and concise answers
3. If you're unsure about something, say so
4. Format code examples with proper syntax highlighting
5. Break down complex topics into easy-to-understand steps

Additional context or specialized knowledge areas:
- Focus on practical, actionable advice
- Consider the user's level of expertise when explaining concepts`

  return (
    <div className="rules-tab">
      <div className="rules-header">
        <h2>Custom Instructions</h2>
        <p className="rules-description">
          Define custom instructions that will be prepended to every chat prompt. 
          This helps the LLM understand your preferences and respond accordingly.
        </p>
      </div>

      <div className="rules-content">
        <div className="textarea-container">
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder={exampleInstructions}
            className="instructions-textarea"
            rows={15}
          />
        </div>

        <div className="rules-actions">
          <button
            onClick={handleSave}
            className={`save-button ${isSaved ? 'saved' : ''}`}
          >
            <Save size={16} />
            {isSaved ? 'Saved!' : 'Save Instructions'}
          </button>
          
          <button
            onClick={handleReset}
            className="reset-button"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="rules-info">
          <h3>How it works:</h3>
          <ul>
            <li>These instructions are automatically added to the beginning of every conversation</li>
            <li>They help set the tone, style, and context for the AI's responses</li>
            <li>You can include specific knowledge areas, formatting preferences, or behavioral guidelines</li>
            <li>Changes are saved locally in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RulesTab
