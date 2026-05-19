'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import VideoInput from '@/components/VideoInput'
import SummaryCard from '@/components/SummaryCard'
import ChatSection from '@/components/ChatSection'
import RelatedVideos from '@/components/RelatedVideos'
import { loadVideo, askQuestion } from '@/services/api'

/**
 * Main Page Component
 * The main container for the YT AI Copilot app
 */
export default function HomePage() {
  // Video loading state
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [summary, setSummary] = useState('')
  
  // Chat state
  const [messages, setMessages] = useState([])
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  
  // Related videos state
  const [relatedVideos, setRelatedVideos] = useState([])
  
  // Error state
  const [error, setError] = useState('')
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')

  /**
   * Handle loading a new video
   */
  const handleLoadVideo = async (url) => {

    if (url === currentVideoUrl) return;

    setCurrentVideoUrl(url);
     
    // Reset states
    setError('')
    setIsLoadingVideo(true)
    setSummary('')
    setMessages([])
    setRelatedVideos([])
    setIsVideoLoaded(false)

    try {
      // Call the API to load video
      const response = await loadVideo(url)
      
      // Update state with response
      setSummary(response.summary)
      setIsVideoLoaded(true)
    } catch (err) {
      // Handle error
      console.error('Failed to load video:', err)
      setError('Failed to load video. Please check the URL and try again.')
    } finally {
      setIsLoadingVideo(false)
    }
  }

  /**
   * Handle sending a chat message
   */
  const handleSendMessage = async (text) => {
    // Add user message to chat
    const userMessage = {

      text,

      isUser: true,

      time: new Date().toLocaleTimeString()

    }
    setMessages((prev) => [...prev, userMessage])
    
    // Clear any previous errors
    setError('')
    setIsLoadingChat(true)

    try {
      // Call the API to ask question
      const response = await askQuestion(text)
      console.log('AI response:', response)
      
      // Add AI response to chat
      const aiMessage = {

        text: response.answer,

        isUser: false,

        time: new Date().toLocaleTimeString()

    } 
      setMessages((prev) => [...prev, aiMessage])
      
      // Update related videos if provided
      if (response.related_videos && response.related_videos.length > 0) {
        setRelatedVideos(response.related_videos)
      }
    } catch (err) {
      // Handle error
      console.error('Failed to get answer:', err)
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false,
        time: new Date().toLocaleTimeString()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  useEffect(() => {

  const handleMessage = async (event) => {

    if (event.data.type === "YOUTUBE_URL") {

      const url = event.data.url;

      console.log("Received URL:", url);

      handleLoadVideo(url);

    }

  };

  window.addEventListener("message", handleMessage);

  return () => {

    window.removeEventListener("message", handleMessage);

  };

}, []);


  return (
    <main className="min-h-screen flex items-start justify-center p-4 md:p-8">
      {/* Main container - sidebar style */}
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Video URL Input */}
        <VideoInput 
          onLoadVideo={handleLoadVideo} 
          isLoading={isLoadingVideo} 
        />
        
        {/* Error message */}
        {error && (
          <div className="mx-4 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        {/* Video Summary */}
        <SummaryCard 
          summary={summary} 
          isLoading={isLoadingVideo} 
        />
        
        {/* Chat Section */}
        <ChatSection 
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoadingChat}
          isVideoLoaded={isVideoLoaded}
        />
        
        {/* Related Videos */}
        <RelatedVideos videos={relatedVideos} />
      </div>
    </main>
  )
}
