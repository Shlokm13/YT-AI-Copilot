/**
 * API Service for YT AI Copilot
 * Handles all communication with the Flask backend
 */

import axios from 'axios'

// Base URL for the Flask backend
// Change this to your actual backend URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Load a YouTube video and get its summary
 * @param {string} url - The YouTube video URL
 * @returns {Promise<{summary: string}>} - The video summary
 */
export async function loadVideo(url) {
  try {
    const response = await api.post('/load_video', { url })
    return response.data
  } catch (error) {
    console.error('Error loading video:', error)
    throw error
  }
}

/**
 * Ask a question about the loaded video
 * @param {string} query - The user's question
 * @returns {Promise<{answer: string, related_videos: string[]}>} - AI answer and related videos
 */
export async function askQuestion(query) {
  try {
    const response = await api.post('/ask', { query })
    return response.data
  } catch (error) {
    console.error('Error asking question:', error)
    throw error
  }
}
