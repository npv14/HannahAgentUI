import React from 'react'
import hannahAvatar from '../../1709481962418.jpg'

// Render inline text: **bold**, 【citation】, and https:// URLs
function renderInline(text) {
  const parts = text.split(/(https?:\/\/[^\s,，]+|\*\*.*?\*\*|【.*?】)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('【') && part.endsWith('】')) {
      const label = part.slice(1, -1).replace(/^[\d:†]+/, '').replace(/\.pdf$/i, '')
      return <span key={i} className="chat-citation">{label.trim()}</span>
    }
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="chat-link">
          {part}
        </a>
      )
    }
    return part
  })
}

function renderTable(tableLines) {
  // First line = header, skip separator lines (|---|---|), rest = body
  const parseRow = (line) =>
    line.split('|').slice(1, -1).map((cell) => cell.trim())

  const header = parseRow(tableLines[0])
  const bodyLines = tableLines.slice(1).filter(
    (l) => !/^\|[\s\-:]+\|$/.test(l.trim())
  )
  const rows = bodyLines.map(parseRow)

  return (
    <div className="chat-table-wrap">
      <table className="chat-table">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i}>{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderContent(content) {
  const lines = content.split('\n')
  const elements = []
  let bulletBuffer = []
  let numberedBuffer = []
  let tableBuffer = []

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
  const flushTable = () => {
    if (tableBuffer.length) {
      elements.push(
        <React.Fragment key={`tbl-${elements.length}`}>
          {renderTable(tableBuffer)}
        </React.Fragment>
      )
      tableBuffer = []
    }
  }
  const flushAll = () => { flushBullets(); flushNumbered(); flushTable() }

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines – flush buffers
    if (!trimmed) {
      flushAll()
      continue
    }

    // Skip horizontal rules (---)
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      flushAll()
      continue
    }

    // Table rows: lines starting and ending with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushBullets()
      flushNumbered()
      tableBuffer.push(trimmed)
      continue
    } else if (tableBuffer.length) {
      flushTable()
    }

    // Headers: ### h3, ## h2, # h1
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.*)/)
    if (headerMatch) {
      flushAll()
      const level = headerMatch[1].length
      const text = headerMatch[2]
      const Tag = `h${level}`
      elements.push(
        <Tag key={`h-${elements.length}`} className={`chat-heading chat-heading--${level}`}>
          {renderInline(text)}
        </Tag>
      )
      continue
    }

    // Bullet list
    const bulletMatch = trimmed.match(/^[-•]\s+(.*)/)
    if (bulletMatch) {
      flushNumbered()
      flushTable()
      bulletBuffer.push(bulletMatch[1])
      continue
    }

    // Numbered list
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.*)/)
    if (numberedMatch) {
      flushBullets()
      flushTable()
      numberedBuffer.push(numberedMatch[1])
      continue
    }

    // Default: paragraph
    flushAll()
    elements.push(
      <p key={`p-${elements.length}`} className="chat-para">
        {renderInline(trimmed)}
      </p>
    )
  }
  flushAll()
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
