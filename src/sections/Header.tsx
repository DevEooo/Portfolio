import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeaderContent } from "../types/site.ts";
import Logo from "../components/Logo.tsx";
import "../styles/Header.css";

gsap.registerPlugin(useGSAP);

const MINUTE_MS = 60_000;
const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

const HEADER_INTRO = {
  at: 0.1,
  duration: 0.6,
  stagger: 0.08,
  y: 8,
  ease: "power3.out",
} as const;

function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function useMinuteClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      setNow(new Date());
      interval = window.setInterval(() => setNow(new Date()), MINUTE_MS);
    }, MINUTE_MS - (Date.now() % MINUTE_MS));

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  return now;
}

interface HeaderProps {
  content: HeaderContent;
  inert?: boolean;
  revealed?: boolean;
}

export default function Header({ content, inert = false, revealed = true }: HeaderProps) {
  const { logo, location, navLabel, nav } = content;
  const now = useMinuteClock();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>(rootRef.current?.children ?? []);
        if (!revealed) {
          gsap.set(items, { opacity: 0 });
          return;
        }
        gsap.fromTo(
          items,
          { opacity: 0, y: -HEADER_INTRO.y },
          {
            opacity: 1,
            y: 0,
            delay: HEADER_INTRO.at,
            duration: HEADER_INTRO.duration,
            stagger: HEADER_INTRO.stagger,
            ease: HEADER_INTRO.ease,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [revealed] },
  );

  return (
    <header ref={rootRef} className="header" inert={inert}>
      <a className="header__logo" href={logo.href} aria-label={logo.ariaLabel}>
        <Logo />
      </a>

      <p className="header__clock">
        <span>{location.label}</span>
        <span className="header__separator" aria-hidden="true">
          {location.separator}
        </span>
        <time dateTime={now.toISOString()}>{formatTime(now, location.timeZone)}</time>
      </p>

      <nav className="header__nav" aria-label={navLabel}>
        <ul className="header__nav-list">
          {nav.map((item) => (
            <li key={item.href}>
              <a className="header__nav-link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
