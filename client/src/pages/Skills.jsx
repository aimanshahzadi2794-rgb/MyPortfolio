import { useEffect } from 'react';
import { useReveal } from '../hooks.js';
import SkillBar from '../components/SkillBar.jsx';

// levels are self-assessed: change them to match your real level
const SKILLS = {
  'HTML & CSS': 90, 'JavaScript': 85, 'React': 80, 'Node.js': 75, 'Python': 75, 'C++': 80, 'Java': 80,
  'C#': 70, 'SQL / MongoDB': 75, 'Flutter': 70, 'PHP & Laravel': 65, 'Assembly': 60, 'Git': 75,
};

const SERVICES = [
  { icon: '🌐', title: 'Full-Stack Web Development', text: 'End-to-end web apps with React, Node.js and Laravel, from database to UI.' },
  { icon: '🤖', title: 'AI-Powered Web Features', text: 'LLM, RAG and fine-tuning workflows integrated into web products with FastAPI and LangChain.' },
  { icon: '📱', title: 'Mobile App Development', text: 'Cross-platform Flutter apps with a Firebase backend.' },
];

export default function Skills() {
  useEffect(() => { document.title = 'Skills & Services | Aiman Shahzadi'; }, []);
  useReveal('skills');

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="title">My <span className="grad">Skills</span></h2>
          {Object.entries(SKILLS).map(([name, level]) => <SkillBar key={name} name={name} level={level} />)}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="title"><span className="grad">Services</span></h2>
          <div className="grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="card center reveal">
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
