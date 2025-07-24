import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, ExternalLink } from 'lucide-react'
import './SettingsTab.css'

const SettingsTab = () => {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Load API key from localStorage on component mount
    const saved = localStorage.getItem('openrouter-api-key')
    if (saved) {
      setApiKey(saved)
      setIsValid(true)
    }
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openrouter-api-key', apiKey.trim())
      setIsValid(true)
    } else {
      localStorage.removeItem('openrouter-api-key')
      setIsValid(false)
    }
    
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setApiKey(value)
    // Basic validation - OpenRouter API keys typically start with 'sk-or-'
    setIsValid(value.trim().length > 0 && value.startsWith('sk-or-'))
  }

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey)
  }

  return (
    <div className="settings-tab">
      <div className="settings-header">
        <h2>Settings</h2>
        <p className="settings-description">
          Configure your OpenRouter API settings to enable LLM interactions.
        </p>
      </div>

      <div className="settings-content">
        <div className="setting-section">
          <div className="setting-header">
            <Key size={20} />
            <h3>OpenRouter API Key</h3>
          </div>
          
          <div className="api-key-container">
            <div className="input-group">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`api-key-input ${isValid ? 'valid' : apiKey.trim() ? 'invalid' : ''}`}
              />
              <button
                type="button"
                onClick={toggleShowApiKey}
                className="toggle-visibility"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {apiKey.trim() && !isValid && (
              <div className="validation-message error">
                Please enter a valid OpenRouter API key (starts with 'sk-or-')
              </div>
            )}
            
            {isValid && (
              <div className="validation-message success">
                API key is valid ✓
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className={`save-button ${isSaved ? 'saved' : ''}`}
          >
            <Save size={16} />
            {isSaved ? 'Saved!' : 'Save API Key'}
          </button>
        </div>

        <div className="info-section">
          <h3>How to get your OpenRouter API key:</h3>
          <ol>
            <li>
              Visit{' '}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                openrouter.ai
                <ExternalLink size={14} />
              </a>
            </li>
            <li>Sign up for an account or log in</li>
            <li>Navigate to the API Keys section in your dashboard</li>
            <li>Create a new API key</li>
            <li>Copy and paste it into the field above</li>
          </ol>

          <div className="security-note">
            <h4>Security Note:</h4>
            <p>
              Your API key is stored locally in your browser and is never sent to our servers. 
              It's only used to make direct requests to OpenRouter's API from your browser.
            </p>
          </div>
        </div>

        <div className="models-info">
          <h3>Supported Models:</h3>
          <p>
            This app supports various LLM models available through OpenRouter, including:
          </p>
          <ul>
            <li>OpenAI GPT models (GPT-3.5, GPT-4)</li>
            <li>Anthropic Claude models</li>
            <li>Google Gemini models</li>
            <li>Meta Llama models</li>
            <li>And many more...</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
