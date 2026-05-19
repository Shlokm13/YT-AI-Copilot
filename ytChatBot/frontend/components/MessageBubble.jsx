'use client'

/**
 * MessageBubble Component
 * Renders a single chat message (user or AI)
 */

import ReactMarkdown from 'react-markdown'

export default function MessageBubble({

  message,

  isUser,

  time

}) {
  return (

  <div

    className={`

      flex

      ${isUser ? 'justify-end' : 'justify-start'}

      mb-4

      animate-in

      fade-in

      duration-300

    `}

  >

    <div className="max-w-[85%]">

      <div

        className={`

          px-4

          py-3

          rounded-2xl

          text-sm

          leading-relaxed

          shadow-sm

          transition-all

          ${

            isUser

              ? 'bg-primary text-primary-foreground rounded-br-md'

              : 'bg-secondary text-secondary-foreground rounded-bl-md'

          }

        `}

      >
        <ReactMarkdown>
          
          {message}

        </ReactMarkdown>

      

      </div>


      {/* Timestamp */}

      <p

        className={`

          text-[10px]

          text-zinc-500

          mt-1

          px-1

          ${isUser ? 'text-right' : 'text-left'}

        `}

      >

        {time}

      </p>

    </div>

  </div>

)
}
