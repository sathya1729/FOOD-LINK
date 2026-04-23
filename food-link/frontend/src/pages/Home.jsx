import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        Welcome to Food Link
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Connecting surplus food from donors to those who need it most. Join our mission to eliminate food waste and hunger.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
          <h2>I have food to give</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Restaurants, function halls, and stores can donate surplus food here.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/donate')}>
            Donate Food
          </button>
        </div>

        <div className="glass-card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
          <h2>I need food</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            NGOs, orphanages, and charities can find and claim food donations here.
          </p>
          <button className="btn btn-secondary" style={{ width: '100%', borderColor: '#60a5fa', color: '#60a5fa' }} onClick={() => navigate('/claim')}>
            Claim Food
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
