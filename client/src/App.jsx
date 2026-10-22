import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const { pathname } = useLocation();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  const logout = () => { localStorage.removeItem('token'); setAuthed(false); };

  return (
    <>
      <Navbar authed={authed} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={() => setAuthed(true)} />} />
          <Route path="/admin" element={authed ? <Admin /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Aiman Shahzadi. Built with React &amp; Node.js.</p>
      </footer>
    </>
  );
}
