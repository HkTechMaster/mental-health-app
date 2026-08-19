import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import API_BASE_URL from './config';

function Chat({ setToken, currentPage, setCurrentPage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const messagesRef = useRef(messages);

  // messagesRef ko hamesha latest rakho (beforeunload ke liye zaroori)
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { message: userMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function endSession() {
    if (messages.length < 2) {
      alert("Have a short conversation first, then end the session.");
      return;
    }
    setEnding(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/swot/generate`,
        { messages },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([]);
      alert("Session ended. Your insights have been saved to your dashboard.");
    } catch (err) {
      alert("Could not save session insights. Please try again.");
    } finally {
      setEnding(false);
    }
  }

  // Agar user tab band kare ya website chhode, bina button dabaye,
  // sendBeacon se background mein SWOT trigger karo
  useEffect(() => {
    function handleBeforeUnload() {
      const currentMessages = messagesRef.current;
      if (currentMessages.length < 2) return;

      const token = localStorage.getItem('token');

      navigator.sendBeacon(
        'http://localhost:5000/api/swot/generate-beacon',
        new Blob([JSON.stringify({ token, messages: currentMessages })], { type: 'application/json' })
      );
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="app-shell">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEndSession={endSession}
        ending={ending}
        onLogout={handleLogout}
        showEndSession={true}
      />

      <div className="chat-body">
        <div className="chat-body-inner">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="brand">
                <span className="breathing-dot"></span>
                Manochikitsak
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
              <span className="msg-label">Manochikitsak</span>
              <div className="msg-bubble">Thinking...</div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-input-bar">
        <div className="input-inner">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn-send" onClick={sendMessage} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;