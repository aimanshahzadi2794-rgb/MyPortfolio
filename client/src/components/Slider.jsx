import { useEffect, useState } from 'react';

export default function Slider({ items }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="slider">
      {items.map((s, k) => (
        <div key={k} className={`slide ${k === i ? 'active' : ''}`}>{s.text}<b>{s.by}</b></div>
      ))}
      <div className="dots">
        {items.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}
      </div>
    </div>
  );
}
