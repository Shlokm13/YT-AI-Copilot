'use client'

import { useState } from 'react'
import { Link2, Loader2 } from 'lucide-react'

/**
 * VideoInput Component
 * Input field for entering YouTube video URLs
 */
export default function VideoInput({ onLoadVideo, isLoading }) {
  const [url, setUrl] = useState('')

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Don't submit if empty or loading
    if (!url.trim() || isLoading) return
    
    // Pass URL to parent
    onLoadVideo(url.trim())
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          {/* URL input */}
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          
          {/* Load button */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load Video</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
