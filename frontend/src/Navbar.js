function Navbar({ currentPage, setCurrentPage, onEndSession, ending, onLogout, showEndSession }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="breathing-dot"></span>
          <div className="brand-text">
            <span className="brand-name">Manochikitsak</span>
            <span className="brand-tagline">a quiet space to heal</span>
          </div>
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${currentPage === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentPage('chat')}
          >
            Chatbot
          </button>
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentPage('about')}
          >
            About
          </button>
          {showEndSession && (
            <button className="nav-link end-session" onClick={onEndSession} disabled={ending}>
              {ending ? 'Ending...' : 'End Session'}
            </button>
          )}
          <button className="nav-link sign-out" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;