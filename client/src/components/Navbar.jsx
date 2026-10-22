import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ authed, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <Link to="/" className="logo">Aiman<span>Shahzadi</span></Link>
      <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      <nav id="menu" className={open ? 'open' : ''} onClick={() => setOpen(false)}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/skills">Skills &amp; Services</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {authed && <NavLink to="/admin">Admin</NavLink>}
        {authed && <a onClick={onLogout}>Logout</a>}
      </nav>
    </header>
  );
}
