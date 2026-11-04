import type { ProjectMedia as ProjectMediaData } from '../types/site.ts';
import '../styles/ProjectMedia.css';

type ProjectMediaProps = {
  media: ProjectMediaData;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: 'high' | 'auto';
};

export default function ProjectMedia({ media, className = '', loading = 'lazy', priority = 'auto' }: ProjectMediaProps) {
  const classes = `project-media ${className}`.trim();
  if (media.src === null) {
    return (
      <span className={`${classes} project-media--placeholder`} role="img" aria-label={media.alt}>
        <span className="project-media__label" aria-hidden="true">
          {media.alt}
        </span>
      </span>
    );
  }
  return (
    <img
      className={classes}
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading={loading}
      decoding="async"
      fetchPriority={priority}
    />
  );
}
