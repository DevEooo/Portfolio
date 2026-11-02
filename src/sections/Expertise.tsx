import { useEffect, useId, useRef, useState } from "react";
import type { ExpertiseContent } from "../types/site.ts";
import "../styles/Expertise.css";

const ACTIVE_LINE_MARGIN = "-50% 0px -50% 0px";
const ARRIVE_MARGIN = "0px 0px -15% 0px";
const INDEX_DIGITS = 2;

const padIndex = (value: number): string => String(value).padStart(INDEX_DIGITS, "0");

interface ExpertiseProps {
  content: ExpertiseContent;
}

export default function Expertise({ content }: ExpertiseProps) {
  const titleId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [arrived, setArrived] = useState<ReadonlySet<number>>(() => new Set());
  const { services } = content;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-index]"));
    const indexOf = (el: Element): number => Number((el as HTMLElement).dataset.index);

    if (!("IntersectionObserver" in window)) {
      setArrived(new Set(rows.map(indexOf)));
      return;
    }

    const crossing = new Set<number>();
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(indexOf(entry.target));
          else crossing.delete(indexOf(entry.target));
        });
        setActiveIndex(crossing.size > 0 ? Math.max(...crossing) : null);
      },
      { rootMargin: ACTIVE_LINE_MARGIN },
    );

    const arriveObserver = new IntersectionObserver(
      (entries) => {
        const newlyArrived = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
        if (newlyArrived.length === 0) return;
        newlyArrived.forEach((target) => arriveObserver.unobserve(target));
        setArrived((current) => new Set([...current, ...newlyArrived.map(indexOf)]));
      },
      { rootMargin: ARRIVE_MARGIN },
    );

    rows.forEach((row) => {
      activeObserver.observe(row);
      arriveObserver.observe(row);
    });

    return () => {
      activeObserver.disconnect();
      arriveObserver.disconnect();
    };
  }, [services.length]);

  const activeService = activeIndex === null ? undefined : services[activeIndex];
  const usedTools: readonly string[] = activeService?.tools ?? [];

  return (
    <section className="expertise" aria-labelledby={titleId}>
      <div className="expertise__aside">
        <div>
          <p className="expertise__eyebrow">
            <span className="expertise__eyebrow-index">{content.eyebrow.index}</span>
            {content.eyebrow.label}
          </p>
          <h2 id={titleId} className="expertise__title">
            <span className="expertise__title-line">{content.title.lead}</span>{" "}
            <span className="expertise__title-line expertise__title-line--accent">{content.title.accent}</span>
          </h2>
        </div>

        <div className="expertise__tools">
          <h3 className="expertise__tools-label">{content.toolsLabel}</h3>
          <ul className="expertise__capsules" data-filtered={activeService ? "true" : "false"}>
            {content.tools.map((tool) => (
              <li key={tool} className="expertise__capsule" data-used={usedTools.includes(tool) ? "true" : "false"}>
                {tool}
              </li>
            ))}
          </ul>
          <p className="expertise__note" aria-hidden="true">
            {activeService ? (
              <>
                {content.usedInLabel} <span className="expertise__note-title">{activeService.title}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="expertise__main">
        <ol ref={listRef} className="expertise__services" data-has-active={activeService ? "true" : "false"}>
          {services.map((service, index) => (
            <li
              key={service.id}
              className="expertise__service"
              data-index={index}
              data-state={index === activeIndex ? "active" : "idle"}
              data-arrived={arrived.has(index) ? "true" : "false"}
            >
              <span className="expertise__number" aria-hidden="true">
                {padIndex(index + 1)}
              </span>
              <div className="expertise__service-body">
                <h3 className="expertise__service-title">{service.title}</h3>
                <p className="expertise__service-description">{service.description}</p>
                <p className="expertise__sr-only">
                  {content.toolsLabel}: {service.tools.join(", ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
