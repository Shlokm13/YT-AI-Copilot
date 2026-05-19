'use client'

import { ExternalLink, Play } from 'lucide-react'

/**
 * VideoCard Component
 * Displays a single related video with thumbnail and link
 */
export default function VideoCard({ url, index }) {
  // Extract video ID from YouTube URL for thumbnail
  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url)
      // Handle youtu.be short links
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1)
      }
      // Handle youtube.com links
      return urlObj.searchParams.get('v')
    } catch {
      return null
    }
  }

  const videoId = getVideoId(url)
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden bg-secondary">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`Video ${index + 1} thumbnail`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Play className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate mb-2">
          Related Video {index + 1}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <span>Watch on YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
