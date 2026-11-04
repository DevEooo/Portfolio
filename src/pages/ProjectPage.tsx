import { ScrollRestoration, useLoaderData } from 'react-router';
import Cursor from '../components/Cursor.tsx';
import Header from '../sections/Header.tsx';
import Footer from '../sections/Footer.tsx';
import ProjectHero from '../sections/project/ProjectHero.tsx';
import ProjectOverview from '../sections/project/ProjectOverview.tsx';
import ProjectGallery from '../sections/project/ProjectGallery.tsx';
import ProjectProcess from '../sections/project/ProjectProcess.tsx';
import NextProject from '../sections/project/NextProject.tsx';
import { headerContent } from '../content/Header.ts';
import { footerContent } from '../content/Footer.ts';
import { projectPageContent } from '../content/Projects.ts';
import { fillTemplate } from '../lib/text.ts';
import type { projectLoader } from './projectLoader.ts';
import '../styles/project/ProjectPage.css';

export default function ProjectPage() {
  const { project, position, total, next, nextPosition } = useLoaderData<typeof projectLoader>();
  const content = projectPageContent;

  return (
    <>
      <title>{fillTemplate(content.documentTitle, { name: project.name })}</title>
      <Cursor />
      <Header content={headerContent} inert={false} revealed />
      <main key={project.slug} id="main" tabIndex={-1} className="project-page">
        <ProjectHero project={project} position={position} total={total} content={content} />
        <ProjectOverview label={content.overviewLabel} overview={project.overview} />
        <ProjectGallery images={project.gallery} content={content.gallery} />
        <ProjectProcess stages={project.stages} content={content.process} />
        <NextProject next={next} position={nextPosition} total={total} content={content.next} />
      </main>
      <Footer content={footerContent} inert={false} />
      <ScrollRestoration />
    </>
  );
}
