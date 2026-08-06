import Navbar from './Navbar';

function About({ setToken, currentPage, setCurrentPage }) {
  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <div className="app-shell">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        showEndSession={false}
      />

      <div className="about-body">
        <h1 className="about-title">About Manochikitsak</h1>
        <p className="about-text">
          Manochikitsak is a supportive space where you can talk openly about what's on your mind.
          It's designed to listen without judgment, offer thoughtful guidance, and help you reflect
          on patterns in how you're feeling over time.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>Talk freely</h3>
            <p>Share what you're going through, at your own pace, in a private and calm space.</p>
          </div>
          <div className="about-card">
            <h3>Reflect over time</h3>
            <p>Each conversation is gently summarized into insights you can revisit on your dashboard.</p>
          </div>
          <div className="about-card">
            <h3>Stay supported</h3>
            <p>Manochikitsak remembers context from past conversations to offer better continuity of care.</p>
          </div>
        </div>

        <div className="about-disclaimer">
          <strong>Please note:</strong> Manochikitsak is a supportive tool, not a replacement for
          professional therapy or medical advice. If you are in crisis or need immediate help,
          please reach out to a licensed professional or a mental health helpline in your area.
        </div>
      </div>
    </div>
  );
}

export default About;