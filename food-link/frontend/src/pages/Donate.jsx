import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Donate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    donorName: '',
    foodType: '',
    quantity: '',
    timeCooked: '',
    address: '',
    lat: '',
    lng: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Auto-detected location' // Ideally use reverse geocoding here
        }));
      }, (err) => {
        alert('Could not get location. Please enter manually.');
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        location: { lat: Number(formData.lat), lng: Number(formData.lng) }
      };
      
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Donation submitted successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to submit donation.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn btn-back" onClick={() => navigate(-1)}>
        &larr; Go Back
      </button>
      
      <div className="glass-card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Donate Food</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Donor Name (Restaurant/Function Hall)</label>
            <input type="text" name="donorName" className="form-control" value={formData.donorName} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Food Type / Name</label>
              <input type="text" name="foodType" className="form-control" value={formData.foodType} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Quantity (e.g., 50 people)</label>
              <input type="text" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Time Cooked</label>
            <input type="datetime-local" name="timeCooked" className="form-control" value={formData.timeCooked} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" name="address" placeholder="Enter address manually or use auto-location" className="form-control" value={formData.address} onChange={handleChange} required />
              <button type="button" className="btn btn-secondary" onClick={getLocation} style={{ whiteSpace: 'nowrap' }}>
                📍 Auto Location
              </button>
            </div>
            {(formData.lat && formData.lng) && (
              <small style={{ color: 'var(--status-claimed)' }}>Location set: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</small>
            )}
          </div>

          <div className="form-group">
            <label>Picture of the Food</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} required />
            {formData.image && (
              <div style={{ marginTop: '1rem' }}>
                <img src={formData.image} alt="Food preview" style={{ height: '150px', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Donate Food'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Donate;
