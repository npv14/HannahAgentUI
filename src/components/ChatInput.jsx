import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  const handleChange = (event) => {
    setText(event.target.value)
    event.target.style.height = 'auto'
    event.target.style.height = Math.min(event.target.scrollHeight, 120) + 'px'
  }

  return (
    <footer className="chat-footer">
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea
          className="chat-input__field"
          placeholder="Hỏi Hannah về khóa học, học bổng, ký túc xá, thực tập và cuộc sống tại Perth..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button className="chat-input__button" type="submit" disabled={disabled || !text.trim()}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </footer>
  )
}

