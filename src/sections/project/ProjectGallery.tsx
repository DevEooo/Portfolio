import { useEffect, useRef, useState } from 'react';
import type { ProjectMedia as ProjectMediaData, ProjectPageContent } from '../../types/site.ts';
import ProjectMedia from '../../components/ProjectMedia.tsx';
import ImageLightbox from '../../components/ImageLightbox.tsx';
import { fillTemplate, padIndex } from '../../lib/text.ts';
import { slideStep, useDragScroll } from '../../lib/useDragScroll.ts';
import '../../styles/project/ProjectGallery.css';

const EDGE_TOLERANCE = 2;

type ProjectGalleryProps = {
  images: readonly ProjectMediaData[];
  content: ProjectPageContent['gallery'];
};

export default function ProjectGallery({ images, content }: ProjectGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [first, setFirst] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(images.length <= 1);
  const [inspected, setInspected] = useState<number | null>(null);
  const total = images.length;

  useDragScroll(trackRef);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const sync = (): void => {
      const step = slideStep(track);
      setFirst(step > 0 ? Math.min(total - 1, Math.round(track.scrollLeft / step)) : 0);
      setAtStart(track.scrollLeft <= EDGE_TOLERANCE);
      setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - EDGE_TOLERANCE);
    };
    const onScroll = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    sync();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [total]);

  const scrollBySlides = (direction: 1 | -1): void => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * slideStep(track) });
  };

  const inspectedImage = inspected === null ? null : (images[inspected] ?? null);
  const counter = (n: number): string => `${padIndex(n)} / ${padIndex(total)}`;
  // Several slides are visible at once, so the track runs out of scroll before the last
  // slide can become "first". Once the end is reached, the counter reports the last slide.
  const current = atEnd && !atStart ? total : first + 1;

  if (total === 0) return null;

  return (
    <section className="project-gallery" aria-label={content.label}>
      <div className="project-gallery__head">
        <p className="project-gallery__count" aria-live="polite">
          {counter(current)}
        </p>
        <div className="project-gallery__arrows">
          <button type="button" className="project-gallery__arrow" aria-label={content.previous} disabled={atStart} onClick={() => scrollBySlides(-1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M17 10H3M8 5l-5 5 5 5" />
            </svg>
          </button>
          <button type="button" className="project-gallery__arrow" aria-label={content.next} disabled={atEnd} onClick={() => scrollBySlides(1)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 10h14M12 5l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={trackRef} className="project-gallery__track">
        {images.map((image, i) => (
          <figure key={`${i}-${image.src ?? image.alt}`} className="project-gallery__slide">
            <button
              type="button"
              className="project-gallery__open"
              aria-label={fillTemplate(content.open, { current: i + 1, total, alt: image.alt })}
              onClick={() => setInspected(i)}
            >
              <ProjectMedia media={image} />
            </button>
          </figure>
        ))}
      </div>

      <ImageLightbox
        media={inspectedImage}
        caption={inspected === null ? '' : counter(inspected + 1)}
        label={content.viewer}
        closeLabel={content.close}
        onClose={() => setInspected(null)}
      />
    </section>
  );
}
