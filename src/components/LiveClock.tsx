import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CONTACT_MEDIA, CONTACT_MOTION } from '../lib/contactMotion.ts';
import '../styles/LiveClock.css';

gsap.registerPlugin(useGSAP);

const SECOND_MS = 1000;
/** Fire just after the second flips so the formatted time has already changed. */
const TICK_SLACK_MS = 15;
const FULL = 100;
const MOTION = CONTACT_MOTION.clock;

type ClockParts = { hh: string; mm: string; ss: string };

function readParts(date: Date, formatter: Intl.DateTimeFormat): ClockParts {
  const parts = formatter.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? '00';
  return { hh: pick('hour'), mm: pick('minute'), ss: pick('second') };
}

/** Re-renders once per second, aligned to the wall clock so it never drifts. */
function useSecondClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer = 0;
    const schedule = (): void => {
      const wait = SECOND_MS - (Date.now() % SECOND_MS) + TICK_SLACK_MS;
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return now;
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(CONTACT_MEDIA.reduce);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const prefersReducedMotion = (): boolean => window.matchMedia(CONTACT_MEDIA.reduce).matches;

type DigitState = { current: string; previous: string | null; turn: number };

type RollingDigitProps = { value: string; animate: boolean };

/** One digit in a masked slot. On change the old glyph rolls up and out while the new one rolls in from below. */
function RollingDigit({ value, animate }: RollingDigitProps) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const [digit, setDigit] = useState<DigitState>({ current: value, previous: null, turn: 0 });

  if (digit.current !== value) {
    setDigit({ current: value, previous: animate ? digit.current : null, turn: digit.turn + 1 });
  }

  useGSAP(
    () => {
      if (digit.previous === null) return;
      const entering = slotRef.current?.querySelector('[data-glyph="current"]');
      const leaving = slotRef.current?.querySelector('[data-glyph="previous"]');
      if (!entering || !leaving) return;

      const turn = digit.turn;
      const roll = { duration: MOTION.roll, ease: MOTION.rollEase };
      gsap.fromTo(entering, { yPercent: FULL }, { yPercent: 0, ...roll });
      gsap.fromTo(
        leaving,
        { yPercent: 0 },
        {
          yPercent: -FULL,
          ...roll,
          onComplete: () => setDigit((state) => (state.turn === turn ? { ...state, previous: null } : state)),
        },
      );
    },
    { scope: slotRef, dependencies: [digit.turn] },
  );

  return (
    <span ref={slotRef} className="live-clock__slot">
      <span className="live-clock__reel">
        {digit.previous === null ? null : (
          <span key={`previous-${digit.turn}`} className="live-clock__glyph" data-glyph="previous">
            {digit.previous}
          </span>
        )}
        <span key={`current-${digit.turn}`} className="live-clock__glyph" data-glyph="current">
          {digit.current}
        </span>
      </span>
    </span>
  );
}

type LiveClockProps = {
  label: string;
  timeZone: string;
  className?: string;
};

/** "HH:MM SS" clock with an azure block colon. Screen readers get the time once, at minute precision. */
export default function LiveClock({ label, timeZone, className }: LiveClockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const now = useSecondClock();
  const reduced = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const [formatter] = useState(
    () => new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }),
  );
  const { hh, mm, ss } = readParts(now, formatter);
  const animate = !reduced;

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(CONTACT_MEDIA.fullMotion, () => {
        const blocks = gsap.utils.toArray<HTMLElement>('.live-clock__block');

        gsap
          .timeline({ defaults: { ease: CONTACT_MOTION.intro.ease } })
          .from('.live-clock__label', { opacity: 0, y: CONTACT_MOTION.intro.fadeY, duration: MOTION.labelDuration }, MOTION.labelAt)
          .from(
            '.live-clock__reel',
            { yPercent: MOTION.introRise, duration: MOTION.introDuration, stagger: MOTION.digitStagger },
            MOTION.digitsAt,
          )
          .from(
            blocks,
            { scale: MOTION.blockFrom, duration: MOTION.blockDuration, ease: MOTION.blockEase, stagger: MOTION.blockStagger },
            MOTION.blocksAt,
          );

        // One continuous loop, phase-locked to the clock: brightest when the cycle starts on a whole period.
        let pulse: gsap.core.Timeline | undefined;
        const startPulse = (afterMs: number): void => {
          pulse?.kill();
          gsap.set(blocks, { opacity: 1 });
          const periodMs = MOTION.pulsePeriod * SECOND_MS;
          const toNextCycle = (periodMs - ((Date.now() + afterMs) % periodMs)) % periodMs;
          const half = MOTION.pulsePeriod / 2;
          pulse = gsap
            .timeline({ repeat: -1, delay: (afterMs + toNextCycle) / SECOND_MS })
            .to(blocks, { opacity: MOTION.pulseDim, duration: half, ease: MOTION.pulseEase })
            .to(blocks, { opacity: 1, duration: half, ease: MOTION.pulseEase });
        };
        const onVisibility = (): void => {
          if (document.hidden) pulse?.pause();
          else startPulse(0);
        };

        startPulse(MOTION.pulseStartAfterMs);
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
          document.removeEventListener('visibilitychange', onVisibility);
          pulse?.kill();
          gsap.set(blocks, { clearProps: 'opacity' });
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className ? `live-clock ${className}` : 'live-clock'}>
      <p className="live-clock__label">
        {label}
        <span className="live-clock__sr">
          : <time dateTime={`${hh}:${mm}`}>{`${hh}:${mm}`}</time>
        </span>
      </p>

      <p className="live-clock__time" aria-hidden="true">
        <span className="live-clock__group">
          <RollingDigit value={hh.charAt(0)} animate={animate} />
          <RollingDigit value={hh.charAt(1)} animate={animate} />
        </span>
        <span className="live-clock__colon">
          <span className="live-clock__block" />
          <span className="live-clock__block" />
        </span>
        <span className="live-clock__group">
          <RollingDigit value={mm.charAt(0)} animate={animate} />
          <RollingDigit value={mm.charAt(1)} animate={animate} />
        </span>
        <span className="live-clock__group live-clock__seconds">
          <RollingDigit value={ss.charAt(0)} animate={animate} />
          <RollingDigit value={ss.charAt(1)} animate={animate} />
        </span>
      </p>
    </div>
  );
}
