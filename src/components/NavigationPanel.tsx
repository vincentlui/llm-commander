import { MessageCircle, Settings, FileText, FolderOpen } from 'lucide-react'
import type { TabType } from '../App'
import './NavigationPanel.css'

interface NavigationPanelProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const NavigationPanel = ({ activeTab, onTabChange }: NavigationPanelProps) => {
  const tabs = [
    { id: 'chat' as TabType, label: 'Chat', icon: MessageCircle },
    { id: 'files' as TabType, label: 'Files', icon: FolderOpen },
    { id: 'rules' as TabType, label: 'Rules', icon: FileText },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="navigation-panel">
      <ul className="nav-list">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <li key={tab.id}>
              <button
                className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavigationPanel
