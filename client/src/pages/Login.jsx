import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Admin Login | Aiman Shahzadi'; }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api.post('/auth/login', form);
      localStorage.setItem('token', token);
      onLogin();
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section">
      <div className="container narrow">
        <h2 className="title">Admin <span className="grad">Login</span></h2>
        {error && <div className="alert error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <label>Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}
