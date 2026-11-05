import { Link } from 'react-router';
import type { ProjectDetail, ProjectPageContent } from '../../types/site.ts';
import { cursorBubbleTarget } from '../../lib/cursorTarget.ts';
import { fillTemplate, padIndex, titleFit, titleFitByWord } from '../../lib/text.ts';
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
      <Link
        className="next-project__link"
        to={`/work/${next.slug}`}
        aria-label={fillTemplate(content.linkLabel, { name: next.name })}
        {...cursorBubbleTarget(content.cursorLabel)}
      >
        <span className="next-project__meta">
          <span className="next-project__name">{next.name}</span>
          <span className="next-project__counter">
            {padIndex(position)} / {padIndex(total)}
          </span>
        </span>
        <span
          className="next-project__title"
          data-fit={titleFit(content.title)}
          data-fit-narrow={titleFitByWord(content.title)}
        >
          {content.title}
        </span>
      </Link>
    </nav>
  );
}
