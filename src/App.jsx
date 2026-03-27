import { useMemo, useState } from 'react'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import { sendMessage, streamMessage } from './services/chatApiService.js'

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hello! I am the university assistant. Ask me about admissions, courses, fees, scholarships, accommodation, campus facilities, or IT support.'
  }
]

export default function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const historyPayload = useMemo(() => {
    return messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({ role: message.role, content: message.content }))
  }, [messages])

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim()
    }

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: ''
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

    const requestPayload = {
      question: userMessage.content,
      history: [...historyPayload, { role: 'user', content: userMessage.content }],
      maxSources: 5
    }

    try {
      if (isStreaming) {
        await streamMessage(requestPayload, (chunk) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: message.content + chunk }
                : message
            )
          )
        })
      } else {
        const response = await sendMessage(requestPayload)
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: response.answer }
              : message
          )
        )
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content:
                  'Sorry, something went wrong while contacting the university assistant. Please try again.'
              }
            : message
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">University AI Assistant</p>
          <h1>Student and Parent Support</h1>
        </div>
        <label className="toggle">
          <span>Streaming</span>
          <input
            type="checkbox"
            checked={isStreaming}
            onChange={(event) => setIsStreaming(event.target.checked)}
          />
          <span className="toggle__slider" />
        </label>
      </header>

      <ChatWindow messages={messages} isLoading={isLoading} />

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
