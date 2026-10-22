import { useEffect, useRef, useState } from 'react';

// progress bar that fills when scrolled into view
export default function SkillBar({ name, level }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setW(level); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [level]);

  return (
    <div className="skill" ref={ref}>
      <div className="skill-head"><span>{name}</span><span>{level}%</span></div>
      <div className="bar"><div className="fill" style={{ width: w + '%' }} /></div>
    </div>
  );
}
