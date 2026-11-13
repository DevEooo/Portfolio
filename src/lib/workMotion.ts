import gsap from 'gsap';

export const WORK_MEDIA = {
  wide: '(min-width: 56.01rem)',
  reduce: '(prefers-reduced-motion: reduce)',
  fullMotion: '(prefers-reduced-motion: no-preference)',
} as const;

export const WORK_READING = { start: 'top center', end: 'bottom center' } as const;

export const WORK_MOTION = {
  swap: 0.75,
  swapEase: 'power3.inOut',
  swapCounter: 60,
  swapPush: 25,
  introTitle: 0.9,
  introLine: 0.8,
  introStagger: 0.06,
  introRowDelay: 0.1,
  introRowY: 16,
  introEase: 'power3.out',
} as const;

const FULL = 100;

export type PreviewStack = {
  show: (from: number, to: number, direction: number, reduced: boolean) => void;
  reset: () => void;
};

export function createPreviewStack(slides: readonly Element[], images: readonly Element[]): PreviewStack {
  let layer = 1;

  const reset = (): void => {
    gsap.killTweensOf([...slides, ...images]);
    slides.forEach((slide, i) => gsap.set(slide, { zIndex: i === 0 ? 1 : 0, yPercent: 0 }));
    gsap.set(images, { yPercent: 0 });
    layer = 1;
  };

  const show = (from: number, to: number, direction: number, reduced: boolean): void => {
    const slide = slides[to];
    const image = images[to];
    const outgoing = images[from];
    if (!slide || !image || from === to) return;

    gsap.killTweensOf([slide, image]);
    layer += 1;
    gsap.set(slide, { zIndex: layer });

    if (reduced) {
      gsap.set([slide, image], { yPercent: 0 });
      return;
    }

    const start = direction >= 0 ? FULL : -FULL;
    const tween = { duration: WORK_MOTION.swap, ease: WORK_MOTION.swapEase };
    gsap.fromTo(slide, { yPercent: start }, { yPercent: 0, ...tween });
    gsap.fromTo(image, { yPercent: (-start * WORK_MOTION.swapCounter) / FULL }, { yPercent: 0, ...tween });
    if (outgoing) {
      gsap.killTweensOf(outgoing);
      gsap.fromTo(
        outgoing,
        { yPercent: 0 },
        { yPercent: (-start * WORK_MOTION.swapPush) / FULL, ...tween, onComplete: () => gsap.set(outgoing, { yPercent: 0 }) },
      );
    }
  };

  reset();
  return { show, reset };
}
