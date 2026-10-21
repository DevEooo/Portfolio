import { useEffect, useState } from "react";
import type { SiteHeaderContent } from "../../types/site.ts";
import "../../styles/SiteHeader.css";

const MINUTE_MS = 60_000;

function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/** Current time, refreshed exactly on each minute boundary. */
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

interface SiteHeaderProps {
  content: SiteHeaderContent;
  /** Keeps keyboard focus out of the header while something (e.g. the preloader) covers it. */
  inert?: boolean;
}

export default function SiteHeader({ content, inert = false }: SiteHeaderProps) {
  const { logo, location, navLabel, nav } = content;
  const now = useMinuteClock();

  return (
    <header className="site-header" inert={inert}>
      <a className="site-header__logo" href={logo.href} aria-label={logo.ariaLabel}>
        {logo.label}
      </a>

      <p className="site-header__clock">
        <span>{location.label}</span>
        <span className="site-header__separator" aria-hidden="true">
          {location.separator}
        </span>
        <time dateTime={now.toISOString()}>{formatTime(now, location.timeZone)}</time>
      </p>

      <nav className="site-header__nav" aria-label={navLabel}>
        <ul className="site-header__nav-list">
          {nav.map((item) => (
            <li key={item.href}>
              <a className="site-header__nav-link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
