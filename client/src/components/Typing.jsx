import { useEffect, useState } from 'react';

// typewriter effect that cycles through a list of phrases
export default function Typing({ words }) {
  const [text, setText] = useState('');

  useEffect(() => {
    let w = 0, c = 0, deleting = false, timer;
    const tick = () => {
      const word = words[w];
      setText(word.slice(0, c));
      if (!deleting && c === word.length) { deleting = true; timer = setTimeout(tick, 1200); return; }
      if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
      c += deleting ? -1 : 1;
      timer = setTimeout(tick, deleting ? 40 : 90);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return <><span>{text}</span><i className="cursor">|</i></>;
}
