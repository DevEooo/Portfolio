import { Link } from 'react-router';
import type { ProjectDetail, ProjectPageContent } from '../../types/site.ts';
import { cursorProjectTarget } from '../../lib/cursorTarget.ts';
import { padIndex, titleFit, titleFitByWord } from '../../lib/text.ts';
import '../../styles/project/NextProject.css';

type NextProjectProps = {
  next: ProjectDetail;
  position: number;
  total: number;
  content: ProjectPageContent['next'];
};

export default function NextProject({ next, position, total, content }: NextProjectProps) {
  return (
    <nav className="next-project" aria-label={content.navLabel}>
      <Link className="next-project__link" to={`/work/${next.slug}`} {...cursorProjectTarget(content.cursorLabel)}>
        <span className="next-project__counter" aria-hidden="true">
          {padIndex(position)} / {padIndex(total)}
        </span>
        <span className="next-project__name" data-fit={titleFit(next.name)} data-fit-narrow={titleFitByWord(next.name)}>
          {next.name}
        </span>
      </Link>
    </nav>
  );
}
