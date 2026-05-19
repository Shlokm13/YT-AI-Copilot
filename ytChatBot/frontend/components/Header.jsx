'use client'

import { Settings, Sparkles } from 'lucide-react'

/**
 * Header Component
 * Displays the app title with AI icon and settings button
 */
export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3">
        {/* AI Icon */}
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        
        {/* Title and subtitle */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">YT AI Copilot</h1>
          <p className="text-xs text-muted-foreground">Your YouTube assistant</p>
        </div>
      </div>

      {/* Right side - Settings button */}
      <button 
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </header>
  )
}
