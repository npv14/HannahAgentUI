import { useState, useRef, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep: #1a3a2e;
    --green-mid: #2d5a45;
    --green-light: #4a8c6a;
    --green-pale: #e8f2ec;
    --gold: #c9a84c;
    --gold-light: #f5e9c8;
    --cream: #faf8f4;
    --cream-dark: #f0ece3;
    --text-dark: #1a1a1a;
    --text-mid: #4a4a4a;
    --text-muted: #8a8a8a;
    --white: #ffffff;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
  }

  .chat-root {
    font-family: 'Source Sans 3', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* HEADER */
  .chat-header {
    background: var(--white);
    border-bottom: 1px solid var(--cream-dark);
    padding: 0 32px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: var(--shadow-sm);
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .header-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--green-light);
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--green-deep);
    letter-spacing: -0.01em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .toggle-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .toggle-track {
    width: 40px;
    height: 22px;
    background: var(--cream-dark);
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    transition: background 0.25s ease;
    border: 1px solid #ddd;
  }

  .toggle-track.on {
    background: var(--green-mid);
    border-color: var(--green-mid);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: var(--white);
    border-radius: 50%;
    transition: transform 0.25s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .toggle-track.on .toggle-thumb {
    transform: translateX(18px);
  }

  /* CHAT AREA */
  .chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    scroll-behavior: smooth;
  }

  /* MESSAGES */
  .message-row {
    display: flex;
    animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .message-row.user {
    justify-content: flex-end;
  }

  .message-row.assistant {
    justify-content: flex-start;
    align-items: flex-start;
    gap: 12px;
  }

  /* Avatar */
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--green-deep);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .avatar svg {
    width: 18px;
    height: 18px;
    fill: var(--gold);
  }

  /* Bubbles */
  .bubble {
    max-width: 72%;
    line-height: 1.65;
    font-size: 15px;
  }

  .bubble.user {
    background: var(--green-deep);
    color: var(--white);
    padding: 13px 18px;
    border-radius: 20px 20px 4px 20px;
    box-shadow: var(--shadow-md);
    font-weight: 400;
  }

  .bubble.assistant {
    background: var(--white);
    color: var(--text-dark);
    padding: 18px 20px;
    border-radius: 4px 20px 20px 20px;
    box-shadow: var(--shadow-md);
    border-left: 3px solid var(--gold);
    position: relative;
  }

  .bubble.assistant .bubble-meta {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--green-light);
    margin-bottom: 8px;
  }

  .bubble.assistant p {
    color: var(--text-mid);
    font-weight: 400;
  }

  /* Citation chips */
  .citation-chip {
    display: inline-block;
    background: var(--gold-light);
    color: var(--green-deep);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 2px 7px;
    border-radius: 4px;
    margin: 0 2px;
    border: 1px solid var(--gold);
  }

  /* Welcome bubble */
  .bubble.welcome {
    background: linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%);
    color: var(--white);
    padding: 22px 24px;
    border-radius: 4px 20px 20px 20px;
    box-shadow: var(--shadow-lg);
    border-left: none;
    max-width: 80%;
  }

  .bubble.welcome .welcome-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--gold-light);
  }

  .bubble.welcome p {
    color: rgba(255,255,255,0.82);
    font-size: 14px;
    line-height: 1.6;
  }

  .welcome-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }

  .welcome-tag {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.85);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 4px 11px;
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .welcome-tag:hover {
    background: rgba(255,255,255,0.22);
  }

  /* Typing indicator */
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 14px 18px;
    background: var(--white);
    border-radius: 4px 20px 20px 20px;
    border-left: 3px solid var(--gold);
    box-shadow: var(--shadow-sm);
    width: fit-content;
  }

  .dot {
    width: 7px;
    height: 7px;
    background: var(--green-light);
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.15s; }
  .dot:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* INPUT BAR */
  .chat-footer {
    background: var(--white);
    border-top: 1px solid var(--cream-dark);
    padding: 16px 24px;
    position: sticky;
    bottom: 0;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  }

  .input-wrapper {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: var(--cream);
    border: 1.5px solid var(--cream-dark);
    border-radius: 16px;
    padding: 10px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: var(--green-light);
    box-shadow: 0 0 0 3px rgba(74, 140, 106, 0.1);
  }

  .chat-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 14.5px;
    color: var(--text-dark);
    line-height: 1.5;
    min-height: 22px;
    max-height: 120px;
    overflow-y: auto;
  }

  .chat-textarea::placeholder {
    color: var(--text-muted);
  }

  .send-btn {
    width: 36px;
    height: 36px;
    background: var(--green-deep);
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.15s;
  }

  .send-btn:hover { background: var(--green-mid); transform: scale(1.05); }
  .send-btn:active { transform: scale(0.96); }
  .send-btn:disabled { background: var(--cream-dark); cursor: not-allowed; transform: none; }

  .send-btn svg { fill: white; width: 16px; height: 16px; }

  .footer-hint {
    text-align: center;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 10px;
  }
`;

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "welcome",
    content: "",
    tags: ["Admissions", "Scholarships", "Courses", "Accommodation", "Fees", "IT Support"],
  },
];

const DEMO_RESPONSE = `Chào Nam — tóm tắt hồ sơ của bạn: tên Nam, IELTS 8, điểm tổng lớp 12 là 9/10, muốn học cử nhân ở Perth.

Học bổng phù hợp nhất là **Global Excellence Scholarship** của The University of Western Australia (UWA) — UWA nằm ở Perth. Giá trị lên tới AUD 48,000 cho chương trình cử nhân (tối đa AUD 12,000 mỗi năm). Với điểm tương đương ATAR 98+, bạn có thể nhận AUD 12,000/năm.`;

export default function UniversityChat() {
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: DEMO_RESPONSE },
      ]);
    }, 1800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTagClick = (tag) => {
    setInput(`Tell me about ${tag.toLowerCase()}`);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const renderContent = (content) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1 ? <strong key={i}>{p}</strong> : p
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chat-root">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <span className="header-eyebrow">University AI Assistant</span>
            <h1 className="header-title">Student & Parent Support</h1>
          </div>
          <div className="header-right">
            <span className="toggle-label">Streaming</span>
            <div
              className={`toggle-track ${streaming ? "on" : ""}`}
              onClick={() => setStreaming(!streaming)}
            >
              <div className="toggle-thumb" />
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="chat-body">
          {messages.map((msg) => {
            if (msg.role === "welcome") {
              return (
                <div key={msg.id} className="message-row assistant" style={{ animationDelay: "0.1s" }}>
                  <div className="avatar">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                  </div>
                  <div className="bubble welcome">
                    <div className="welcome-title">Hello! I'm your university assistant.</div>
                    <p>Ask me about admissions, courses, fees, scholarships, accommodation, campus facilities, or IT support.</p>
                    <div className="welcome-tags">
                      {msg.tags.map((t) => (
                        <button key={t} className="welcome-tag" onClick={() => handleTagClick(t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === "user") {
              return (
                <div key={msg.id} className="message-row user">
                  <div className="bubble user">{msg.content}</div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="message-row assistant">
                <div className="avatar">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
                <div className="bubble assistant">
                  <div className="bubble-meta">Assistant</div>
                  {msg.content.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: i < msg.content.split("\n\n").length - 1 ? "10px" : 0 }}>
                      {renderContent(para)}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="message-row assistant" style={{ animation: "slideUp 0.3s ease both" }}>
              <div className="avatar">
                <svg viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <div className="typing-indicator">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <footer className="chat-footer">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Ask about admissions, scholarships, courses…"
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
          <div className="footer-hint">Press Enter to send · Shift+Enter for new line</div>
        </footer>
      </div>
    </>
  );
}
