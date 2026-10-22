import { CATEGORIES, techList } from '../categories.js';

// compact = short card for the home page; otherwise shows tags + "View Details"
export default function ProjectCard({ p, onOpen, compact }) {
  const [label, emoji] = CATEGORIES[p.category] || ['Project', '💻'];

  return (
    <article className="card reveal">
      {p.image
        ? <img className="thumb" src={`/uploads/${p.image}`} alt={p.title} />
        : <div className={`thumb ph cat-${p.category}`}><span>{emoji}</span></div>}
      <span className="badge">{label}</span>
      <h3>{p.title}</h3>
      {compact ? (
        <p>{p.description.length > 100 ? p.description.slice(0, 100) + '…' : p.description}</p>
      ) : (
        <>
          <div className="tags">{techList(p.tech_stack).map((t) => <span key={t}>{t}</span>)}</div>
          <button className="btn small" onClick={() => onOpen(p)}>View Details</button>
        </>
      )}
    </article>
  );
}
