import { useEffect, type RefObject } from 'react';

const DRAG_SCROLL = {
  /** Pixels a press must travel before it counts as a drag, so plain clicks still work. */
  threshold: 6,
  /** Fraction of a slide added in the drag direction, so a short flick advances one slide. */
  flickBias: 0.3,
  /** Milliseconds to wait for the settle scroll where `scrollend` is unsupported. */
  settleFallback: 600,
} as const;

const DRAGGING_ATTRIBUTE = 'data-dragging';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Distance between the starts of the first two children, i.e. one slide plus the gap. */
export function slideStep(track: HTMLElement): number {
  const [a, b] = track.children;
  return a instanceof HTMLElement && b instanceof HTMLElement ? b.offsetLeft - a.offsetLeft : 0;
}

/**
 * Lets a mouse drag a horizontal scroll-snap track. Touch and trackpads already scroll
 * natively, so only `pointerType === 'mouse'` is handled. While dragging, the track carries
 * `data-dragging` so CSS can turn snapping off; on release it settles on the nearest slide.
 */
export function useDragScroll(trackRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;
    let suppressClick = false;
    let settleTimer = 0;

    const release = (): void => {
      window.clearTimeout(settleTimer);
      track.removeEventListener('scrollend', release);
      track.removeAttribute(DRAGGING_ATTRIBUTE);
    };

    const settle = (dragDistance: number): void => {
      const step = slideStep(track);
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (step <= 0) {
        release();
        return;
      }
      const bias = -Math.sign(dragDistance) * DRAG_SCROLL.flickBias;
      const index = Math.max(0, Math.round(track.scrollLeft / step + bias));
      const reduce = window.matchMedia(REDUCED_MOTION).matches;

      track.addEventListener('scrollend', release);
      settleTimer = window.setTimeout(release, DRAG_SCROLL.settleFallback);
      track.scrollTo({ left: Math.min(index * step, maxScroll), behavior: reduce ? 'auto' : 'smooth' });
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      release();
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      dragged = false;
      suppressClick = false;
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (!dragged) {
        if (Math.abs(distance) < DRAG_SCROLL.threshold) return;
        dragged = true;
        track.setPointerCapture(event.pointerId);
        track.setAttribute(DRAGGING_ATTRIBUTE, '');
      }
      track.scrollLeft = startScroll - distance;
    };

    const onPointerEnd = (event: PointerEvent): void => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragged) return;
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      suppressClick = true;
      settle(event.clientX - startX);
    };

    const onClickCapture = (event: MouseEvent): void => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onDragStart = (event: DragEvent): void => event.preventDefault();

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerEnd);
    track.addEventListener('pointercancel', onPointerEnd);
    track.addEventListener('click', onClickCapture, true);
    track.addEventListener('dragstart', onDragStart);

    return () => {
      release();
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerEnd);
      track.removeEventListener('pointercancel', onPointerEnd);
      track.removeEventListener('click', onClickCapture, true);
      track.removeEventListener('dragstart', onDragStart);
    };
  }, [trackRef]);
}
