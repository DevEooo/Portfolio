import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { transitionContent } from '../content/Transition.ts';
import '../styles/TransitionProvider.css';

gsap.registerPlugin(useGSAP);

const MEDIA = {
  reduce: '(prefers-reduced-motion: reduce)',
  full: '(prefers-reduced-motion: no-preference)',
} as const;

const PROJECT_PATH = /^\/work\/([^/]+)\/?$/;
const MAIN_ID = 'main';
const COLUMNS = 8;
const COLUMN_KEYS = Array.from({ length: COLUMNS }, (_, i) => `column-${i}`);

const PAGE_TRANSITION = {
  halves: { duration: 0.35, stagger: 0.02, ease: 'power3.inOut' },
  text: { from: 105, out: -105, duration: 0.3, lead: 0.6, nameDelay: 0.05, ease: 'power3.out' },
  line: { to: 0.8, run: 0.25, finish: 0.12, ease: 'power2.out' },
  contentOut: { duration: 0.15, ease: 'power2.in' },
  fade: 0.15,
} as const;

const pageNames: Readonly<Record<string, string>> = transitionContent.pageNames;

type Destination = { label: string; name: string };

async function destinationOf(pathname: string): Promise<Destination> {
  const match = PROJECT_PATH.exec(pathname);
  if (match) {
    const { projects } = await import('../content/Projects.ts');
    const project = projects.find((item) => item.slug === match[1]);
    return { label: transitionContent.nextProjectLabel, name: project?.name ?? pageNames['/work'] ?? pathname };
  }
  return { label: transitionContent.nextPageLabel, name: pageNames[pathname] ?? pathname };
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function internalLinkFrom(event: MouseEvent, currentPathname: string): URL | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target instanceof Element ? event.target.closest('a') : null;
  if (!(anchor instanceof HTMLAnchorElement) || !anchor.hasAttribute('href')) return null;
  if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === currentPathname) return null;
  return url;
}

interface TransitionProviderProps {
  children: ReactNode;
}

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLParagraphElement>(null);
  const pathnameRef = useRef(pathname);
  const busyRef = useRef(false);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const label = labelRef.current;
      const name = nameRef.current;
      const line = lineRef.current;
      const lineFill = lineFillRef.current;
      if (!contextSafe || !root || !label || !name || !line || !lineFill) return;

      const columns = gsap.utils.toArray<HTMLElement>('.page-transition__column', root).map((column) =>
        gsap.utils.toArray<HTMLElement>('.page-transition__half', column),
      );
      const halves = columns.flat();
      const texts = [label, name];
      const { halves: halvesStep, text, line: lineStep, contentOut, fade } = PAGE_TRANSITION;

      const animate = contextSafe((build: () => gsap.core.Animation): gsap.core.Animation => build());

      const moveHalves = (scaleY: number): gsap.core.Animation =>
        animate(() => {
          const timeline = gsap.timeline();
          columns.forEach((column, i) => {
            timeline.to(column, { scaleY, duration: halvesStep.duration, ease: halvesStep.ease }, i * halvesStep.stagger);
          });
          return timeline;
        });

      const prepare = contextSafe((destination: Destination, closed: boolean): void => {
        label.textContent = destination.label;
        name.textContent = destination.name;
        root.dataset.active = 'true';
        gsap.set(halves, { scaleY: closed ? 1 : 0 });
        gsap.set(texts, { yPercent: closed ? 0 : text.from });
        gsap.set(lineFill, { scaleX: closed ? 1 : 0 });
        gsap.set(line, { opacity: 1 });
      });

      const finish = contextSafe((): void => {
        gsap.set(root, { autoAlpha: 0 });
        gsap.set(halves, { scaleY: 0 });
        delete root.dataset.active;
      });

      const arrive = async (destination: Destination): Promise<void> => {
        await nextFrame();
        await nextFrame();
        document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
        if (announceRef.current) announceRef.current.textContent = destination.name;
      };

      const mm = gsap.matchMedia();
      mm.add({ reduce: MEDIA.reduce, full: MEDIA.full }, (context) => {
        const reduce = context.conditions?.reduce === true;

        const playReduced = async (to: string, destination: Destination): Promise<void> => {
          prepare(destination, true);
          await animate(() => gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: fade }));
          await navigate(to);
          await arrive(destination);
          await animate(() => gsap.to(root, { autoAlpha: 0, duration: fade }));
        };

        const playFull = async (to: string, destination: Destination): Promise<void> => {
          prepare(destination, false);
          animate(() => gsap.set(root, { autoAlpha: 1 }));
          const cover = moveHalves(1);
          const contentAt = Math.max(0, cover.duration() - text.duration * text.lead);
          animate(() => gsap.to(label, { yPercent: 0, duration: text.duration, ease: text.ease, delay: contentAt }));
          animate(() =>
            gsap.to(name, { yPercent: 0, duration: text.duration, ease: text.ease, delay: contentAt + text.nameDelay }),
          );
          const lineRun = animate(() =>
            gsap.to(lineFill, { scaleX: lineStep.to, duration: lineStep.run, ease: lineStep.ease, delay: contentAt }),
          );
          await cover;
          await Promise.all([lineRun, navigate(to)]);
          await animate(() => gsap.to(lineFill, { scaleX: 1, duration: lineStep.finish, ease: lineStep.ease }));
          await arrive(destination);
          animate(() => gsap.to(texts, { yPercent: text.out, duration: contentOut.duration, ease: contentOut.ease }));
          animate(() => gsap.to(line, { opacity: 0, duration: contentOut.duration, ease: contentOut.ease }));
          await moveHalves(0);
        };

        const go = async (url: URL): Promise<void> => {
          busyRef.current = true;
          try {
            const destination = await destinationOf(url.pathname);
            const to = `${url.pathname}${url.search}${url.hash}`;
            if (reduce) await playReduced(to, destination);
            else await playFull(to, destination);
          } finally {
            finish();
            busyRef.current = false;
          }
        };

        const onClick = (event: MouseEvent): void => {
          const url = internalLinkFrom(event, pathnameRef.current);
          if (!url) return;
          event.preventDefault();
          if (busyRef.current) return;
          void go(url);
        };

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <>
      {children}
      <div ref={rootRef} className="page-transition" aria-hidden="true">
        <div className="page-transition__columns">
          {COLUMN_KEYS.map((key) => (
            <div key={key} className="page-transition__column">
              <span className="page-transition__half page-transition__half--top" />
              <span className="page-transition__half page-transition__half--bottom" />
            </div>
          ))}
        </div>
        <div className="page-transition__foot">
          <div className="page-transition__mask">
            <span ref={labelRef} className="page-transition__label" />
          </div>
          <div className="page-transition__mask page-transition__mask--name">
            <span ref={nameRef} className="page-transition__name" />
          </div>
          <div ref={lineRef} className="page-transition__line">
            <div ref={lineFillRef} className="page-transition__line-fill" />
          </div>
        </div>
      </div>
      <p ref={announceRef} className="page-transition__announce" role="status" aria-live="polite" />
    </>
  );
}
