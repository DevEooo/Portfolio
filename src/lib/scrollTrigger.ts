import gsap from 'gsap';

let scrollTriggerPromise: Promise<void> | undefined;

export function loadScrollTrigger(): Promise<void> {
  scrollTriggerPromise ??= import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  });
  return scrollTriggerPromise;
}
