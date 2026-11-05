import { useId } from 'react';
import ScrollRevealText from '../../components/ScrollRevealText.tsx';
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
      <ScrollRevealText text={overview} className="project-overview__lead" />
    </section>
  );
}
