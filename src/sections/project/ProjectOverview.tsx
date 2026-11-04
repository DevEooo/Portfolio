import { useId } from 'react';
import '../../styles/project/ProjectOverview.css';

type ProjectOverviewProps = {
  label: string;
  overview: string;
};

export default function ProjectOverview({ label, overview }: ProjectOverviewProps) {
  const headingId = useId();
  return (
    <section className="project-overview" aria-labelledby={headingId}>
      <h2 id={headingId} className="project-overview__label">
        {label}
      </h2>
      <p className="project-overview__lead">{overview}</p>
    </section>
  );
}
