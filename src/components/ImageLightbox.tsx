import { useEffect, useRef, type MouseEvent } from 'react';
import type { ProjectMedia as ProjectMediaData } from '../types/site.ts';
import ProjectMedia from './ProjectMedia.tsx';
import '../styles/ImageLightbox.css';

type ImageLightboxProps = {
  media: ProjectMediaData | null;
  caption: string;
  label: string;
  closeLabel: string;
  onClose: () => void;
};

export default function ImageLightbox({ media, caption, label, closeLabel, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (media && !dialog.open) dialog.showModal();
    if (!media && dialog.open) dialog.close();
  }, [media]);

  const handleClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className="image-lightbox" aria-label={label} onClose={onClose} onClick={handleClick}>
      <button type="button" className="image-lightbox__close" aria-label={closeLabel} onClick={() => dialogRef.current?.close()}>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" />
        </svg>
      </button>
      {media ? (
        <figure className="image-lightbox__frame">
          <ProjectMedia media={media} loading="eager" />
          <figcaption className="image-lightbox__caption">{caption}</figcaption>
        </figure>
      ) : null}
    </dialog>
  );
}
