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
