import Cursor from '../components/Cursor.tsx';
import Header from '../sections/Header.tsx';
import Footer from '../sections/Footer.tsx';
import WorkHeading from '../sections/work/WorkHeading.tsx';
import WorkList from '../sections/work/WorkList.tsx';
import { headerContent } from '../content/Header.ts';
import { footerContent } from '../content/Footer.ts';
import { projects } from '../content/Projects.ts';
import { workPageContent } from '../content/Work.ts';
import '../styles/work/WorkPage.css';

export default function WorkPage() {
  const content = workPageContent;

  return (
    <>
      <title>{content.documentTitle}</title>
      <Cursor />
      <Header content={headerContent} inert={false} revealed />
      <main id="main" tabIndex={-1} className="work-page">
        <WorkHeading content={content} total={projects.length} />
        <WorkList projects={projects} content={content} />
      </main>
      <Footer content={footerContent} inert={false} />
    </>
  );
}
