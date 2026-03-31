import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage.jsx'
import hannahAvatar from '../../1709481962418.jpg'

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <img src={hannahAvatar} alt="Hannah Vu" className="chat-avatar" />
            <div className="chat-window__status">
              <span className="chat-window__dot" />
              <span className="chat-window__dot" />
              <span className="chat-window__dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
