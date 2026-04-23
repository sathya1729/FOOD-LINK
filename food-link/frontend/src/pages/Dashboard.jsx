import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/donations');
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        // Refresh local state
        setDonations(donations.map(d => d._id === id ? { ...d, status: newStatus } : d));
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'var(--status-pending)';
      case 'Donated': return 'var(--status-donated)';
      case 'Claimed': return 'var(--status-claimed)';
      default: return 'white';
    }
  };

  return (
    <div className="animate-fade-in">
      <button className="btn btn-back" onClick={() => navigate(-1)}>
        &larr; Go Back
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Donation Dashboard</h1>
        <button className="btn btn-secondary" onClick={fetchDonations}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <p>No donations found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {donations.map(donation => (
            <div key={donation._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{donation.foodType}</h3>
                <span style={{ 
                  backgroundColor: getStatusColor(donation.status),
                  color: donation.status === 'Donated' ? '#000' : '#fff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {donation.status}
                </span>
              </div>
              
              <img src={donation.image} alt="Food" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
              
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}><strong>Donor:</strong> {donation.donorName}</p>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}><strong>Qty:</strong> {donation.quantity}</p>
                {donation.claimerName && (
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}><strong>Claimed by:</strong> {donation.claimerName}</p>
                )}
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Time Cooked:</strong> {new Date(donation.timeCooked).toLocaleString()}
                </p>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                {/* Donor Action: Mark as Donated (In transit / Sent) */}
                {donation.status === 'Pending' && (
                  <button className="btn btn-secondary" style={{ flex: 1, borderColor: 'var(--status-donated)', color: 'var(--status-donated)' }} onClick={() => updateStatus(donation._id, 'Donated')}>
                    Mark as Donated
                  </button>
                )}
                
                {/* Claimer Action: Mark as Claimed (Received) */}
                {donation.status === 'Donated' && (
                  <button className="btn btn-secondary" style={{ flex: 1, borderColor: 'var(--status-claimed)', color: 'var(--status-claimed)' }} onClick={() => updateStatus(donation._id, 'Claimed')}>
                    Mark as Claimed
                  </button>
                )}

                {/* Already claimed state */}
                {donation.status === 'Claimed' && (
                  <button className="btn" style={{ flex: 1, backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'var(--status-claimed)', cursor: 'default' }} disabled>
                    Successfully Claimed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
