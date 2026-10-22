import { useEffect } from 'react';

// fades elements with class "reveal" in when they scroll into view
export function useReveal(key) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal:not(.show)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
