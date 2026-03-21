import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage.jsx'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <section className="chat-window">
      <div className="chat-window__messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="chat-window__status">Thinking with university data...</div>
        )}
        <div ref={bottomRef} />
      </div>
    </section>
  )
}
