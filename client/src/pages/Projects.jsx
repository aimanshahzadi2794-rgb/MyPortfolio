import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { CATEGORIES, techList } from '../categories.js';
import { useReveal } from '../hooks.js';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);   // project shown in the modal
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Projects | Aiman Shahzadi';
    api.get('/projects').then(setProjects).catch(() => setError('Could not load projects. Is the API server running?'));
  }, []);

  // close modal with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  useReveal(`${filter}-${projects.length}`);

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="title">Project <span className="grad">Showcase</span></h2>

          <div className="filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            {Object.entries(CATEGORIES).map(([key, [label, emoji]]) => (
              <button key={key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{emoji} {label}</button>
            ))}
          </div>

          {error && <div className="alert error">{error}</div>}
          <div className="grid">
            {visible.map((p) => <ProjectCard key={p.id} p={p} onOpen={setSelected} />)}
          </div>
          {!error && visible.length === 0 && <p>No projects found.</p>}
        </div>
      </section>

      <div className={`modal ${selected ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
        {selected && (
          <div className="modal-box">
            <button className="close" onClick={() => setSelected(null)}>&times;</button>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <p><b>Tech:</b> {techList(selected.tech_stack).join(', ') || '-'}</p>
            {selected.link && <a className="btn small" href={selected.link} target="_blank" rel="noopener noreferrer">Visit Project</a>}
          </div>
        )}
      </div>
    </>
  );
}
