import { useState } from 'react'
import Header from './components/Header'
import NavigationPanel from './components/NavigationPanel'
import ChatTab from './components/ChatTab'
import RulesTab from './components/RulesTab'
import SettingsTab from './components/SettingsTab'
import FilesTab from './components/FilesTab'
import './App.css'

export type TabType = 'chat' | 'rules' | 'settings' | 'files'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab />
      case 'rules':
        return <RulesTab />
      case 'settings':
        return <SettingsTab />
      case 'files':
        return <FilesTab />
      default:
        return <ChatTab />
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <NavigationPanel activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  )
}

export default App
