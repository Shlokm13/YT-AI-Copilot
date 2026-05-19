'use client'

import { useState } from 'react'
import { Copy, Check, FileText, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

/**
 * SummaryCard Component
 * Displays the AI-generated video summary
 */
export default function SummaryCard({ summary, isLoading }) {

  // Track copy state
  const [copied, setCopied] = useState(false)

  // Copy summary
  const handleCopy = () => {

  if (!summary) return

  try {

    // CLEAN MARKDOWN SYMBOLS

    const cleanText = summary
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')

    // CREATE TEMP TEXTAREA

    const textarea = document.createElement('textarea')

    textarea.value = cleanText

    document.body.appendChild(textarea)

    textarea.select()

    document.execCommand('copy')

    document.body.removeChild(textarea)

    // SHOW SUCCESS

    setCopied(true)

    setTimeout(() => {

      setCopied(false)

    }, 2000)

  } catch (err) {

    console.error('Failed to copy:', err)

  }

}

  return (

    <div className="p-4">

      {/* Header */}

      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2">

          <FileText className="w-4 h-4 text-primary" />

          <h2 className="text-sm font-medium text-foreground">

            Video Summary

          </h2>

        </div>


        {/* Copy Button */}

        {summary && (

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
          >

            {copied ? (

              <>

                <Check className="w-3 h-3 text-green-500" />

                <span className="text-green-500">

                  Copied

                </span>

              </>

            ) : (

              <>

                <Copy className="w-3 h-3 text-muted-foreground" />

                <span className="text-muted-foreground">

                  Copy

                </span>

              </>

            )}

          </button>

        )}

      </div>


      {/* Summary Card */}

      <div className="p-4 rounded-xl bg-card border border-border shadow-sm">

        {isLoading ? (

          // Loading State

          <div className="flex items-center justify-center py-10">

            <Loader2 className="w-5 h-5 text-primary animate-spin" />

            <span className="ml-2 text-sm text-muted-foreground">

              Generating summary...

            </span>

          </div>

        ) : summary ? (

          // Summary Content

          <div
           className="
  prose
  prose-invert
  prose-sm
  max-w-none
  text-zinc-200

  prose-headings:text-white
  prose-headings:font-semibold
  prose-headings:text-base
  prose-headings:mb-3
  prose-headings:mt-6

  prose-p:text-zinc-300
  prose-p:leading-7
  prose-p:mb-5

  prose-strong:text-white
  prose-strong:font-semibold

  prose-li:text-zinc-300
  prose-li:mb-2

  prose-ul:mb-6

  animate-in
  fade-in
  duration-500
"
          >

            <ReactMarkdown>

              {summary}

            </ReactMarkdown>

          </div>

        ) : (

          // Empty State

          <div className="flex items-center justify-center py-10">

            <p className="text-sm text-muted-foreground text-center">

              Open a YouTube video to generate AI summary

            </p>

          </div>

        )}

      </div>

    </div>

  )

}