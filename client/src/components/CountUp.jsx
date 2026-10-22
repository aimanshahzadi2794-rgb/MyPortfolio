import { useEffect, useRef, useState } from 'react';

// number that counts up when it scrolls into view
export default function CountUp({ to }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!to) return;
    let step;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let i = 0;
      step = setInterval(() => {
        i++; setN(i);
        if (i >= to) clearInterval(step);
      }, 600 / to);
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => { io.disconnect(); clearInterval(step); };
  }, [to]);

  return <strong ref={ref}>{n}</strong>;
}
