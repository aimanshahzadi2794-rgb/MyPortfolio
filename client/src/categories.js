// key => [label, emoji]
export const CATEGORIES = {
  web: ['Web', '🌐'],
  ai: ['AI / ML', '🤖'],
  mobile: ['Mobile', '📱'],
  game: ['Games', '🎮'],
  systems: ['Systems & DSA', '⚙️'],
};

export const techList = (s) => (s || '').split(',').map((t) => t.trim()).filter(Boolean);
