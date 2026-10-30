import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ProjectImage } from "../../types/site.ts";
import { cursorProjectTarget } from "./cursorTarget.ts";
import "../../styles/HoverExpandList.css";

gsap.registerPlugin(useGSAP);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FULL_MOTION = "(prefers-reduced-motion: no-preference)";
const NO_HOVER = "(hover: none)";

const HOVER_EXPAND = {
  expand: { duration: 0.55, ease: "expo.out" },
  dim: { opacity: 0.38, duration: 0.22, ease: "power1.out" },
  media: { from: 1.06, duration: 0.5, ease: "expo.out" },
  description: { shift: -8, duration: 0.3, delay: 0.12, ease: "expo.out" },
  minScale: 0.01,
} as const;

export type HoverExpandItem = {
  id: string;
  index: string;
  label: string;
  sublabel: string;
  description: string;
  href: string;
  image?: ProjectImage;
  cursorLabel: string;
};

interface HoverExpandListProps {
  items: readonly HoverExpandItem[];
  placeholder: string;
}

type RowState = "idle" | "open" | "dimmed";

export default function HoverExpandList({ items, placeholder }: HoverExpandListProps) {
  const rootRef = useRef<HTMLUListElement>(null);
  const reducedRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ reduce: REDUCED_MOTION, full: FULL_MOTION }, (context) => {
      reducedRef.current = context.conditions?.reduce === true;
    });
    return () => mm.revert();
  });

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const rows = gsap.utils.toArray<HTMLElement>(".hover-expand__row", root);
      const firstPanel = root.querySelector<HTMLElement>(".hover-expand__panel");
      const firstRow = rows[0];
      if (!firstRow || !firstPanel) return;

      const collapsed = firstRow.offsetHeight;
      const expanded = firstPanel.offsetHeight;
      const delta = expanded - collapsed;
      const time = (seconds: number): number => (reducedRef.current ? 0 : seconds);
      const { expand, dim, media, description } = HOVER_EXPAND;

      rows.forEach((row, i) => {
        const isOpen = i === openIndex;
        const isBelowOpen = openIndex !== null && i > openIndex;
        const isDimmed = openIndex !== null && !isOpen;
        const panel = row.querySelector<HTMLElement>(".hover-expand__panel");
        const inner = row.querySelector<HTMLElement>(".hover-expand__inner");
        const hit = row.querySelector<HTMLElement>(".hover-expand__hit");
        const mediaEl = row.querySelector<HTMLElement>(".hover-expand__media");
        const text = row.querySelector<HTMLElement>(".hover-expand__text");
        const descriptionEl = row.querySelector<HTMLElement>(".hover-expand__description");
        if (!panel || !inner || !hit || !mediaEl || !text || !descriptionEl) return;

        const counterScale = (): void => {
          const scale = Number(gsap.getProperty(panel, "scaleY")) || 0;
          gsap.set(inner, { scaleY: 1 / Math.max(scale, HOVER_EXPAND.minScale) });
        };

        gsap.to(row, { y: isBelowOpen ? delta : 0, duration: time(expand.duration), ease: expand.ease, overwrite: "auto" });
        gsap.to(row, { opacity: isDimmed ? dim.opacity : 1, duration: time(dim.duration), ease: dim.ease, overwrite: "auto" });
        gsap.to(panel, {
          scaleY: isOpen ? 1 : collapsed / expanded,
          duration: time(expand.duration),
          ease: expand.ease,
          overwrite: "auto",
          onUpdate: counterScale,
          onComplete: counterScale,
        });
        gsap.to(hit, { scaleY: isOpen ? expanded / collapsed : 1, duration: time(expand.duration), ease: expand.ease, overwrite: "auto" });
        gsap.to(text, { y: isOpen ? delta : 0, duration: time(expand.duration), ease: expand.ease, overwrite: "auto" });
        gsap.to(mediaEl, {
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : media.from,
          duration: time(media.duration),
          ease: media.ease,
          overwrite: "auto",
        });
        gsap.to(descriptionEl, {
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : description.shift,
          duration: time(description.duration),
          delay: isOpen ? time(description.delay) : 0,
          ease: description.ease,
          overwrite: "auto",
        });
      });

      const endLine = root.querySelector<HTMLElement>(".hover-expand__end");
      if (endLine) {
        gsap.to(endLine, { y: openIndex !== null ? delta : 0, duration: time(expand.duration), ease: expand.ease, overwrite: "auto" });
      }
    },
    { scope: rootRef, dependencies: [openIndex] },
  );

  const open = (index: number) => setOpenIndex(index);
  const close = (index: number) => setOpenIndex((current) => (current === index ? null : current));

  const stateOf = (index: number): RowState => {
    if (openIndex === null) return "idle";
    return openIndex === index ? "open" : "dimmed";
  };

  return (
    <ul ref={rootRef} className="hover-expand">
      {items.map((item, index) => (
        <li key={item.id} className="hover-expand__row" data-state={stateOf(index)}>
          <a
            className="hover-expand__link"
            href={item.href}
            {...cursorProjectTarget(item.cursorLabel)}
            onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
              if (event.pointerType !== "touch") open(index);
            }}
            onPointerLeave={(event: PointerEvent<HTMLAnchorElement>) => {
              if (event.pointerType !== "touch") close(index);
            }}
            onFocus={() => open(index)}
            onBlur={() => close(index)}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (openIndex !== index && window.matchMedia(NO_HOVER).matches) {
                event.preventDefault();
                open(index);
              }
            }}
          >
            <span className="hover-expand__hit" aria-hidden="true" />
            <span className="hover-expand__panel" aria-hidden="true">
              <span className="hover-expand__inner">
                <span className="hover-expand__media">
                  {item.image ? (
                    <img
                      className="hover-expand__img"
                      src={item.image.src}
                      alt=""
                      width={item.image.width}
                      height={item.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="hover-expand__placeholder">{placeholder}</span>
                  )}
                </span>
              </span>
            </span>
            <span className="hover-expand__text">
              <span className="hover-expand__main">
                <span className="hover-expand__index">{item.index}</span>
                <span className="hover-expand__label">{item.label}</span>
                <span className="hover-expand__description">{item.description}</span>
              </span>
              <span className="hover-expand__sublabel">{item.sublabel}</span>
            </span>
          </a>
        </li>
      ))}
      <li className="hover-expand__end" aria-hidden="true" />
    </ul>
  );
}
