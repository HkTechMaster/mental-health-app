import { useState } from 'react';
import axios from 'axios';

function Chat({ setToken }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: userMessage.text });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="brand">
          <span className="breathing-dot"></span>
          Solace
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="brand">
              <span className="breathing-dot"></span>
              Solace
            </div>
            <p>This is a quiet space to share what's on your mind. Type a message to begin.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.sender}`}>
            <span className="msg-label">{msg.sender === 'user' ? 'You' : 'Solace'}</span>
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="msg-row bot thinking">
            <span className="msg-label">Solace</span>
            <div className="msg-bubble">Thinking...</div>
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn-send" onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default Chat;