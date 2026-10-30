import { useId } from "react";
import type { SelectedWorkContent } from "../../types/site.ts";
import HoverExpandList, { type HoverExpandItem } from "../common/HoverExpandList.tsx";
import WorkIntro from "./WorkIntro.tsx";
import "../../styles/SelectedWork.css";

const INDEX_DIGITS = 2;

const padIndex = (value: number): string => String(value).padStart(INDEX_DIGITS, "0");

interface SelectedWorkProps {
  content: SelectedWorkContent;
}

export default function SelectedWork({ content }: SelectedWorkProps) {
  const titleId = useId();
  const { projects } = content;

  const items: HoverExpandItem[] = projects.map((project, i) => ({
    id: project.id,
    index: padIndex(i + 1),
    label: project.title,
    sublabel: `${project.year}${content.metaSeparator}${project.category}`,
    description: project.description,
    href: project.href,
    image: project.image,
    cursorLabel: project.title,
  }));
  const photos = projects.flatMap((project) => (project.image ? [{ id: project.id, image: project.image }] : []));

  return (
    <section className="selected-work" aria-labelledby={titleId}>
      <WorkIntro titleId={titleId} title={content.title} photos={photos} placeholder={content.photoPlaceholder} />

      <div className="selected-work__list">
        <div className="selected-work__head">
          <p className="selected-work__label">
            <span className="selected-work__count">{padIndex(projects.length)}</span>{" "}
            <strong className="selected-work__label-text">{content.listLabel}</strong>
          </p>
          <a className="selected-work__view-all" href={content.viewAll.href}>
            {content.viewAll.label}
            <span className="selected-work__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
        <HoverExpandList items={items} placeholder={content.photoPlaceholder} />
      </div>
    </section>
  );
}
