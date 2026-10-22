import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { CATEGORIES } from '../categories.js';

// create / edit form for a project (used for both)
function ProjectForm({ project, onDone, onCancel }) {
  const [f, setF] = useState({
    title: project.title || '', category: project.category || 'web', tech_stack: project.tech_stack || '',
    link: project.link || '', description: project.description || '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (project.id) await api.putForm(`/projects/${project.id}`, fd);   // UPDATE
      else await api.postForm('/projects', fd);                           // CREATE
      onDone(project.id ? 'Project updated.' : 'Project created.');
    } catch (err) {
      setErrors(err.errors || { form: err.message });
    }
  }

  const Err = ({ k }) => errors[k] ? <small className="err">{errors[k]}</small> : null;

  return (
    <form className="form glass" onSubmit={submit}>
      <h3>{project.id ? 'Edit project' : 'New project'}</h3>
      {errors.form && <div className="alert error">{errors.form}</div>}
      <label>Title<input value={f.title} onChange={set('title')} /><Err k="title" /></label>
      <label>Category
        <select value={f.category} onChange={set('category')}>
          {Object.entries(CATEGORIES).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
        </select><Err k="category" />
      </label>
      <label>Tech stack (comma separated)<input value={f.tech_stack} onChange={set('tech_stack')} /><Err k="tech_stack" /></label>
      <label>Project link<input value={f.link} onChange={set('link')} placeholder="https://" /><Err k="link" /></label>
      <label>Description<textarea rows="4" value={f.description} onChange={set('description')} /><Err k="description" /></label>
      <label>Image {project.image && '(leave empty to keep the current one)'}
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <button className="btn" type="submit">Save</button>{' '}
      <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);   // null = closed, {} = new, project = edit
  const [flash, setFlash] = useState('');

  const loadProjects = () => api.get('/projects').then(setProjects);
  const loadMessages = () => api.get('/messages').then(setMessages);

  useEffect(() => {
    document.title = 'Admin | Aiman Shahzadi';
    loadProjects(); loadMessages().catch(() => {});
  }, []);

  const done = (msg) => { setEditing(null); setFlash(msg); loadProjects(); };

  async function remove(p) {                                  // DELETE
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await api.del(`/projects/${p.id}`);
    setFlash('Project deleted.'); loadProjects();
  }

  async function removeMessage(m) {
    if (!window.confirm('Delete this message?')) return;
    await api.del(`/messages/${m.id}`);
    loadMessages();
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className="title">Admin <span className="grad">Panel</span></h2>

        <div className="tabs">
          <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects ({projects.length})</button>
          <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Messages ({messages.length})</button>
        </div>

        {flash && <div className="alert success">{flash}</div>}

        {tab === 'projects' && (editing ? (
          <ProjectForm project={editing} onDone={done} onCancel={() => setEditing(null)} />
        ) : (
          <>
            <div className="head-row"><span /><button className="btn" onClick={() => { setFlash(''); setEditing({}); }}>+ New Project</button></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Title</th><th>Category</th><th>Tech</th><th>Actions</th></tr></thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>{p.title}</td>
                      <td>{CATEGORIES[p.category]?.[0]}</td>
                      <td>{p.tech_stack}</td>
                      <td>
                        <button className="link-btn" onClick={() => { setFlash(''); setEditing(p); }}>Edit</button>
                        <button className="link-danger" onClick={() => remove(p)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}

        {tab === 'messages' && (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className="msg-row">
                    <td>{m.name}<br /><small>{m.email}</small></td>
                    <td>{m.subject}</td>
                    <td className="msg-text">{m.message}</td>
                    <td>{new Date(m.created_at).toLocaleDateString()}</td>
                    <td><button className="link-danger" onClick={() => removeMessage(m)}>Delete</button></td>
                  </tr>
                ))}
                {messages.length === 0 && <tr><td colSpan="5">No messages yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
