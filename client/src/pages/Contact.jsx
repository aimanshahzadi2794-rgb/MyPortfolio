import { useEffect, useState } from 'react';
import { api } from '../api.js';

const EMPTY = { name: '', email: '', subject: '', message: '' };

// same rules as the server so users get instant feedback
function validate(f) {
  const e = {};
  if (f.name.trim().length < 3) e.name = 'Name must be at least 3 characters.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (f.subject.trim().length < 3) e.subject = 'Subject must be at least 3 characters.';
  if (f.message.trim().length < 10) e.message = 'Please write at least 10 characters.';
  return e;
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { document.title = 'Contact | Aiman Shahzadi'; }, []);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(ev) {
    ev.preventDefault();
    setSuccess('');
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      const res = await api.post('/contact', form);
      setSuccess(res.message);
      setForm(EMPTY);
    } catch (err) {
      setErrors(err.errors || { form: err.message });
    } finally {
      setSending(false);
    }
  }

  const field = (name, label, type = 'text', area = false) => (
    <label key={name}>{label}
      {area
        ? <textarea rows="5" value={form[name]} onChange={change(name)} className={errors[name] ? 'invalid' : ''} />
        : <input type={type} value={form[name]} onChange={change(name)} className={errors[name] ? 'invalid' : ''} />}
      {errors[name] && <small className="err">{errors[name]}</small>}
    </label>
  );

  return (
    <section className="section">
      <div className="container narrow">
        <h2 className="title">Contact <span className="grad">Me</span></h2>
        <p style={{ marginBottom: 20 }}>
          📧 <a href="mailto:aimanshahzadi2794@gmail.com">aimanshahzadi2794@gmail.com</a><br />
          📍 Kasur, Punjab, Pakistan
        </p>
        {success && <div className="alert success">{success}</div>}
        {errors.form && <div className="alert error">{errors.form}</div>}

        <form className="form" onSubmit={submit} noValidate>
          {field('name', 'Full Name')}
          {field('email', 'Email', 'email')}
          {field('subject', 'Subject')}
          {field('message', 'Message', 'text', true)}
          <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </section>
  );
}
