/**
 * Sekin va chiroyli animatsiya bilan sahifa boshiga ko'tarish funksiyasi.
 * Tez va xunuk sakrashning oldini oladi.
 * Easing funksiyasi: easeInOutCubic (boshida va oxirida mayin, o'rtada ravon).
 */
export const smoothScrollToTop = (duration = 750) => {
  const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  if (startPosition <= 0) return;

  const startTime = performance.now();

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    const nextY = Math.round(startPosition * (1 - ease));
    window.scrollTo(0, nextY);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};
