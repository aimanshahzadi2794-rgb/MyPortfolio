import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useReveal } from '../hooks.js';
import Typing from '../components/Typing.jsx';
import CountUp from '../components/CountUp.jsx';
import Slider from '../components/Slider.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

const TOOLS = ['JavaScript', 'React', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Next.js', 'Python', 'FastAPI', 'LangChain',
  'C++', 'Java', 'C#', 'Assembly', 'Flutter', 'Firebase', 'Unity', 'Laravel', 'Arduino', 'HTML', 'CSS', 'Git'];

const HIGHLIGHTS = [
  { text: 'Built an AI-powered no-code GenAI platform with RAG and LoRA/QLoRA fine-tuning.', by: 'ModelForge' },
  { text: 'Completed a full-stack development internship working with React and Node.js.', by: 'DecodeLabs' },
  { text: 'Worked on AI/ML engineering tasks as a virtual intern.', by: 'DevelopersHub Corporation' },
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Home | Aiman Shahzadi';
    api.get('/projects').then(setProjects).catch(() => setError('Could not load projects. Is the API server running?'));
  }, []);

  useReveal(projects.length);

  return (
    <>
      <section className="hero">
        <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
        <div className="container hero-inner">
          <div>
            <span className="pill">👋 Open to opportunities</span>
            <h1>Hi, I'm <span className="grad">Aiman Shahzadi</span></h1>
            <h2>I build <Typing words={['full-stack web apps.', 'AI-powered tools.', 'React & Node.js apps.', 'games & low-level systems.']} /></h2>
            <p className="lead">Final-year BS Computer Science student and full-stack developer, passionate about web apps, AI-powered products and low-level systems.</p>
            <div className="cta">
              <Link to="/projects" className="btn">View My Work →</Link>
              <Link to="/contact" className="btn btn-outline">Hire Me</Link>
            </div>
          </div>
          <div className="avatar-wrap">
            <div className="avatar-ring"><div className="avatar">AS</div></div>
            <span className="float f1">⚛️ React</span>
            <span className="float f2">🟢 Node.js</span>
            <span className="float f3">🤖 AI</span>
            <span className="float f4">🎮 Games</span>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container stats">
          <div><CountUp to={projects.length} /><span>Projects</span></div>
          <div><CountUp to={2} /><span>Internships</span></div>
          <div><CountUp to={16} /><span>Technologies</span></div>
          <div><CountUp to={3} /><span>Years of CS</span></div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container reveal">
          <h2 className="title">About <span className="grad">Me</span></h2>
          <div className="about-grid">
            <div className="glass">
              <p>I'm a final-year BS Computer Science student at Riphah International University, Lahore, with hands-on experience
              in full-stack development using React, Node.js and modern JavaScript. I've completed a full-stack internship and
              built many end-to-end projects, from an AI-powered no-code GenAI platform to a Super Mario game in Java and a memory game in assembly.
              I'm comfortable owning a feature from database to UI. I'm looking to join a full-stack or web engineering team.</p>
              <p style={{ marginTop: 12 }}><b>Languages:</b> English, Urdu</p>
            </div>
            <div className="glass">
              <h3>💼 Experience</h3>
              <ul className="timeline">
                <li><b>Jun – Jul 2026</b>AI/ML Engineering Intern, DevelopersHub Corporation (Virtual)</li>
                <li><b>May – Jun 2026</b>Full Stack Development Intern, DecodeLabs (Virtual)</li>
              </ul>
              <h3 style={{ marginTop: 18 }}>🎓 Education</h3>
              <ul className="timeline">
                <li><b>2023 – Present</b>BS Computer Science, Riphah International University, Lahore</li>
                <li><b>2021 – 2023</b>Pre-Medical, DPS &amp; College, Kasur</li>
                <li><b>2019 – 2021</b>Matric in Science, Allama Iqbal Public High School, Kasur</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="title">Featured <span className="grad">Projects</span></h2>
          {error && <div className="alert error">{error}</div>}
          <div className="grid">
            {projects.slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} compact />)}
          </div>
          <p style={{ marginTop: 28, textAlign: 'center' }}>
            <Link to="/projects" className="btn">See all {projects.length} projects →</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="title">Tech <span className="grad">Toolbox</span></h2>
          <div className="chips reveal">{TOOLS.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="title">Highlights</h2>
          <Slider items={HIGHLIGHTS} />
        </div>
      </section>

      <section className="section">
        <div className="container center cta-box reveal">
          <h2>Let's build something great together</h2>
          <p>I'm looking to join a full-stack or web engineering team.</p>
          <Link to="/contact" className="btn">Get In Touch</Link>
        </div>
      </section>
    </>
  );
}
