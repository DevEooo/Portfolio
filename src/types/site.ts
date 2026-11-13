export type NavLink = {
  label: string;
  href: string;
};

export type HeaderContent = {
  logo: {
    href: string;
    ariaLabel: string;
  };
  location: {
    label: string;
    timeZone: string;
    separator: string;
  };
  navLabel: string;
  nav: readonly NavLink[];
};

export type HeroContent = {
  meta: {
    index: string;
    role: string;
    availability: {
      label: string;
      isAvailable: boolean;
    };
  };
  name: {
    first: string;
    last: string;
  };
  statement: string;
  visual: {
    src: string;
    alt: string;
  };
  scrollCue: string;
};

export type MarqueeContent = {
  list: {
    words: string;
    separator: string;
  };
};

export type GreetingContent = {
  label: string;
  body: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  href: string;
  image?: ProjectImage;
};

export type SelectedWorkContent = {
  title: { first: string; last: string };
  listLabel: string;
  viewAll: { label: string; href: string };
  metaSeparator: string;
  photoPlaceholder: string;
  projects: readonly Project[];
};

export type ExpertiseService = {
  id: string;
  title: string;
  description: string;
  tools: readonly string[];
};

export type ExpertiseContent = {
  eyebrow: { index: string; label: string };
  title: { lead: string; accent: string };
  toolsLabel: string;
  usedInLabel: string;
  tools: readonly string[];
  services: readonly ExpertiseService[];
};

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  label: string;
  links: readonly FooterLink[];
};

export type FooterContent = {
  headline: {
    lead: string;
    accent: string;
  };
  body: string;
  cta: { label: string; href: string };
  email: {
    address: string;
    copyLabel: string;
    copiedLabel: string;
    failedLabel: string;
  };
  linksLabel: string;
  groups: readonly FooterLinkGroup[];
  newTabLabel: string;
  copyright: string;
  backToTop: {
    label: string;
    targetId: string;
  };
};

export type ProjectStageId = 'research' | 'plan' | 'design' | 'build' | 'launch';

export type ProjectStage = {
  id: ProjectStageId;
  body: string;
};

export type ProjectMedia = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
};

export type ProjectDetail = {
  slug: string;
  name: string;
  type: string;
  year: string;
  status: string;
  overview: string;
  cover: ProjectMedia;
  gallery: readonly ProjectMedia[];
  stages: readonly ProjectStage[];
};

export type ProjectPageContent = {
  documentTitle: string;
  backLink: { label: string; href: string };
  counterLabel: string;
  scrollCue: string;
  meta: { type: string; year: string; status: string };
  overviewLabel: string;
  gallery: {
    label: string;
    previous: string;
    next: string;
    open: string;
    viewer: string;
    close: string;
  };
  process: {
    heading: string;
    navLabel: string;
    stageTitles: Record<ProjectStageId, string>;
  };
  next: {
    navLabel: string;
    /** Big display text in the middle of the section. */
    title: string;
    /** Accessible name of the link; `{name}` is the next project's name. */
    linkLabel: string;
    /** Text inside the cursor bubble while hovering the section. */
    cursorLabel: string;
  };
};

export type TransitionContent = {
  nextPageLabel: string;
  nextProjectLabel: string;
  pageNames: Readonly<Record<string, string>>;
};

export type WorkPageContent = {
  documentTitle: string;
  eyebrow: string;
  title: string;
  countLabel: string;
  intro: string;
  listLabel: string;
  cursorLabel: string;
};

export type ChoiceOption = {
  value: string;
  label: string;
};

export type ContactQuestion = {
  name: string;
  index: string;
  label: string;
  error: string;
  options: readonly ChoiceOption[];
};

export type ContactTextField = {
  index?: string;
  label: string;
  placeholder: string;
};

export type ContactRequiredField = ContactTextField & {
  index: string;
  error: string;
};

export type ContactPageContent = {
  documentTitle: string;
  eyebrow: string;
  /** Rendered as two lines: `lead` / `rest` + `accent` (accent in azure). */
  title: { lead: string; rest: string; accent: string };
  clock: { label: string; timeZone: string };
  details: {
    label: string;
    email: {
      label: string;
      address: string;
      copyLabel: string;
      copiedLabel: string;
      failedLabel: string;
      copiedAnnouncement: string;
    };
    location: { label: string; value: string };
  };
  form: {
    label: string;
    questions: readonly ContactQuestion[];
    fields: {
      name: ContactRequiredField;
      company: ContactTextField;
      email: ContactRequiredField;
      message: ContactTextField;
    };
    submitLabel: string;
    alternative: { lead: string; address: string };
    sentStatus: string;
  };
};
