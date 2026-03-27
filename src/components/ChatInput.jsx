import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text.trim()) {
      return
    }

    onSend(text)
    setText('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        className="chat-input__field"
        placeholder="Nhập tên, điểm IELTS/TOEFL, GPA và ngành học để tìm học bổng phù hợp."
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={2}
        disabled={disabled}
      />
      <button className="chat-input__button" type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  )
}
