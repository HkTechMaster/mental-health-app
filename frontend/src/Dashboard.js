import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import API_BASE_URL from './config';

function Dashboard({ setToken, currentPage, setCurrentPage }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/swot/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            setError('Unable to load your history. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setToken(null);
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="app-shell">
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
                showEndSession={false}
            />

            <div className="dashboard-body">
                <h1 className="dashboard-title">Your Reflection History</h1>
                <p className="dashboard-subtitle">Insights generated from your past conversations.</p>

                {loading && <p className="dashboard-empty">Loading your history...</p>}
                {error && <div className="form-error">{error}</div>}

                {!loading && history.length === 0 && (
                    <p className="dashboard-empty">No sessions analyzed yet. End a conversation in chat to see insights here.</p>
                )}

                {history.map((item) => (
                    <div key={item._id} className="swot-card">
                        <div className="swot-card-header">
                            <span className="swot-date">{formatDate(item.generatedAt)}</span>
                            {item.moodScore && <span className="mood-badge">Mood: {item.moodScore}/10</span>}
                        </div>

                        <p className="swot-summary">{item.conversationSummary}</p>

                        {item.keyMemories && item.keyMemories.length > 0 && (
                            <div className="swot-section">
                                <h4>Key Points</h4>
                                <ul>
                                    {item.keyMemories.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="swot-grid">
                            <div className="swot-box strength">
                                <h4>Strengths</h4>
                                <ul>{item.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                            <div className="swot-box weakness">
                                <h4>Weaknesses</h4>
                                <ul>{item.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}</ul>
                            </div>
                            <div className="swot-box opportunity">
                                <h4>Opportunities</h4>
                                <ul>{item.opportunities?.map((o, i) => <li key={i}>{o}</li>)}</ul>
                            </div>
                            <div className="swot-box threat">
                                <h4>Threats</h4>
                                <ul>{item.threats?.map((t, i) => <li key={i}>{t}</li>)}</ul>
                            </div>
                        </div>

                        {item.keyTopics && item.keyTopics.length > 0 && (
                            <div className="topic-tags">
                                {item.keyTopics.map((t, i) => <span key={i} className="topic-tag">{t}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;