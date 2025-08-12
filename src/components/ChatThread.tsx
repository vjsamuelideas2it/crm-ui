import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface ChatMessage {
  id: number | string;
  text: string;
  date: string | Date;
  authorName?: string;
  isMine?: boolean;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  onSend?: (text: string) => void | Promise<void>;
  onDelete?: (id: number | string) => void | Promise<void>;
  placeholder?: string;
  sending?: boolean;
  readOnly?: boolean;
  sendLabel?: string;
}

const ChatThread: React.FC<ChatThreadProps> = ({ messages, onSend, onDelete, placeholder = 'Type a message...', sending = false, readOnly = false, sendLabel = 'Send' }) => {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sorted.length]);

  const handleSend = async () => {
    const msg = text.trim();
    if (!msg || sending || !onSend) return;
    await onSend(msg);
    setText('');
  };

  return (
    <div className="chat">
      <div className="chat__list">
        {sorted.length === 0 ? (
          <div className="chat__empty">No conversations yet</div>
        ) : (
          <ul className="chat__items">
            {sorted.map((m) => (
              <li key={m.id} className={`chat__item ${m.isMine ? 'chat__item--mine' : 'chat__item--other'}`}>
                <div className="chat__bubble">
                  <div className="chat__text">{m.text}</div>
                  <div className="chat__meta">
                    <span className="chat__author">{m.authorName || (m.isMine ? 'You' : 'User')}</span>
                    <span className="chat__dot">•</span>
                    <span className="chat__time">{new Date(m.date).toLocaleString()}</span>
                  </div>
                </div>
                {!!onDelete && (
                  <button className="chat__action" onClick={() => onDelete(m.id)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div ref={endRef} />
      </div>
      {!readOnly && (
        <div className="chat__composer">
          <input
            className="chat__input form-input"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button className="btn btn--primary chat__send" onClick={handleSend} disabled={sending || !text.trim()}>
            {sendLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatThread;
