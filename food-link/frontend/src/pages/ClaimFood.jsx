import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ClaimFood() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [distance, setDistance] = useState('10');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/donations');
      const data = await res.json();
      // Filter out claimed donations, show only Pending or Donated
      setDonations(data.filter(d => d.status !== 'Claimed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };

  const handleClaim = async (id) => {
    if (!orgName) {
      alert("Please enter your Organization Name first!");
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Claimed', claimerName: orgName })
      });
      
      if (res.ok) {
        alert("Food successfully claimed!");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error claiming food", err);
    }
  };

  // Default center (if no donations and no user location)
  const defaultCenter = [17.3850, 78.4867]; // Hyderabad, India
  const center = userLocation ? [userLocation.lat, userLocation.lng] : (donations.length > 0 ? [donations[0].location.lat, donations[0].location.lng] : defaultCenter);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <button className="btn btn-back" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>
        <h1>Claim Food</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find available donations near you.</p>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ margin: 0, flex: '1', minWidth: '200px' }}>
          <label>Organization Name</label>
          <input type="text" className="form-control" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="NGO / Orphanage Name" />
        </div>
        
        <div className="form-group" style={{ margin: 0, flex: '1', minWidth: '200px' }}>
          <label>Search Radius</label>
          <select className="form-control" value={distance} onChange={(e) => setDistance(e.target.value)}>
            <option value="10">Within 10 km</option>
            <option value="30">Within 30 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>

        <button className="btn btn-secondary" onClick={handleAutoLocation}>
          📍 Detect My Location
        </button>
      </div>

      {loading ? (
        <p>Loading map and donations...</p>
      ) : (
        <div className="glass-card" style={{ padding: '1rem' }}>
          <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {donations.map(donation => (
              <Marker key={donation._id} position={[donation.location.lat, donation.location.lng]}>
                <Popup>
                  <div style={{ maxWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--bg-color)' }}>{donation.foodType}</h3>
                    <img src={donation.image} alt={donation.foodType} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
                    <p style={{ margin: '0 0 0.2rem 0', color: '#333' }}><strong>Donor:</strong> {donation.donorName}</p>
                    <p style={{ margin: '0 0 0.2rem 0', color: '#333' }}><strong>Quantity:</strong> {donation.quantity}</p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#333' }}><strong>Cooked:</strong> {new Date(donation.timeCooked).toLocaleString()}</p>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', width: '100%' }} onClick={() => handleClaim(donation._id)}>
                      Claim Food
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default ClaimFood;
