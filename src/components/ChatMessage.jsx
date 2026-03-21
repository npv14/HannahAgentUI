export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : ''}`}>
      <div className="chat-message__bubble">
        <p>{message.content}</p>
      </div>
    </div>
  )
}
