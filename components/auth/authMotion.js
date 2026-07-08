// Shared entrance-motion variants for the auth views (login / forgot /
// reset), so the staggered reveal is defined once. Pass the page's
// `useReducedMotion()` value to disable motion accessibly.

export const EASE = [0.16, 1, 0.3, 1];

export function stagger(reduce) {
  return reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.07, delayChildren: 0.05 },
        },
      };
}

export function item(reduce) {
  return reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      };
}
