import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Donate from './pages/Donate';
import ClaimFood from './pages/ClaimFood';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="logo">Food Link</div>
          <nav>
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/claim" element={<ClaimFood />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
