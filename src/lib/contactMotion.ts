export const CONTACT_MEDIA = {
  reduce: '(prefers-reduced-motion: reduce)',
  fullMotion: '(prefers-reduced-motion: no-preference)',
} as const;

export const CONTACT_MOTION = {
  /** Heading lines and eyebrow on page load. */
  intro: { eyebrowAt: 0.1, eyebrowDuration: 0.6, linesAt: 0.15, line: 0.9, lineRise: 110, stagger: 0.1, fadeY: 8, ease: 'power3.out' },
  /** Live clock: load-in, digit roll and the colon "breathing". */
  clock: {
    labelAt: 0.35,
    labelDuration: 0.6,
    digitsAt: 0.4,
    digitStagger: 0.06,
    blocksAt: 0.6,
    blockStagger: 0.08,
    blockDuration: 0.5,
    blockEase: 'back.out(2)',
    blockFrom: 0,
    introDuration: 0.9,
    introRise: 110,
    roll: 0.6,
    rollEase: 'power3.inOut',
    /** Seconds per dim-and-brighten cycle. Keep it a whole number so it stays in step with the clock. */
    pulsePeriod: 2,
    pulseDim: 0.35,
    pulseEase: 'sine.inOut',
    /** Let the intro finish before the colon starts breathing. */
    pulseStartAfterMs: 1200,
  },
} as const;
