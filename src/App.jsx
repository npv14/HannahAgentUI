import { useMemo, useState } from 'react'
import ChatWindow from './components/ChatWindow.jsx'
import ChatInput from './components/ChatInput.jsx'
import { sendMessage, streamMessage } from './services/chatApiService.js'
import hannahAvatar from '../1709481962418.jpg'

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Xin chào! Mình là trợ lý của Hannah Vu — Global Engagement Manager tại Đại học Tây Úc (UWA), Perth.\n\nMình có thể giúp bạn và phụ huynh tìm hiểu về:\n- Các khóa học & điều kiện đầu vào tại UWA\n- Chương trình liên kết & cơ hội chuyển tiếp\n- Học bổng phù hợp theo trình độ học vấn của bạn\n- Chuẩn bị kỹ năng thực tập & xin việc tại Úc\n- Cuộc sống & hoạt động tại Perth\n- Chỗ ở (accommodation) cho sinh viên quốc tế\n\nSau khi trao đổi, mình có thể giúp bạn lập danh sách việc cần làm (to-do list) và xuất thành file PDF.\n\nBạn muốn bắt đầu từ đâu? Hãy cho mình biết tên, trình độ học vấn hiện tại và mục tiêu của bạn nhé!'
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
        <div className="app__header-identity">
          <img src={hannahAvatar} alt="Hannah Vu" className="app__avatar" />
          <div>
            <p className="app__eyebrow">Global Engagement Manager at University of Western Australia</p>
            <h1>Hannah Vu</h1>
          </div>
        </div>

      </header>

      <ChatWindow messages={messages} isLoading={isLoading} />

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}
