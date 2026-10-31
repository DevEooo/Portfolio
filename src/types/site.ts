export type NavLink = {
  label: string;
  href: string;
};

export type SiteHeaderContent = {
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

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  label: string;
  links: readonly FooterLink[];
};

export type SiteFooterContent = {
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
