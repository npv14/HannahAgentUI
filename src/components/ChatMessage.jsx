import hannahAvatar from '../../1709481962418.jpg'

// Render inline text: **bold** and 【citation】
function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|【.*?】)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('【') && part.endsWith('】')) {
      const label = part.slice(1, -1).replace(/^[\d:†]+/, '').replace(/\.pdf$/i, '')
      return <span key={i} className="chat-citation">{label.trim()}</span>
    }
    return part
  })
}

function renderContent(content) {
  const lines = content.split('\n')
  const elements = []
  let bulletBuffer = []
  let numberedBuffer = []

  const flushBullets = () => {
    if (bulletBuffer.length) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="chat-list">
          {bulletBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ul>
      )
      bulletBuffer = []
    }
  }
  const flushNumbered = () => {
    if (numberedBuffer.length) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="chat-list chat-list--ordered">
          {numberedBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ol>
      )
      numberedBuffer = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushBullets()
      flushNumbered()
      continue
    }
    const bulletMatch = trimmed.match(/^[-•]\s+(.*)/)
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.*)/)

    if (bulletMatch) {
      flushNumbered()
      bulletBuffer.push(bulletMatch[1])
    } else if (numberedMatch) {
      flushBullets()
      numberedBuffer.push(numberedMatch[1])
    } else {
      flushBullets()
      flushNumbered()
      elements.push(
        <p key={`p-${elements.length}`} className="chat-para">
          {renderInline(trimmed)}
        </p>
      )
    }
  }
  flushBullets()
  flushNumbered()
  return elements
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      {!isUser && (
        <img src={hannahAvatar} alt="Hannah Vu" className="chat-avatar" />
      )}
      <div className="chat-message__bubble">
        {isUser
          ? <p>{message.content}</p>
          : renderContent(message.content)
        }
      </div>
    </div>
  )
}
