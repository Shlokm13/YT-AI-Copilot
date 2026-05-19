'use client'

import { Video } from 'lucide-react'
import VideoCard from './VideoCard'

/**
 * RelatedVideos Component
 * Displays a list of related YouTube videos
 */
export default function RelatedVideos({ videos }) {
  // Don't render if no videos
  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <div className="p-4 border-t border-border">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-medium text-foreground">Related Videos</h2>
      </div>

      {/* Video list */}
      <div className="space-y-2">
        {videos.map((url, index) => (
          <VideoCard key={index} url={url} index={index} />
        ))}
      </div>
    </div>
  )
}
