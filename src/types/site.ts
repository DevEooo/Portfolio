export type NavLink = {
  label: string;
  href: string;
};

export type SiteHeaderContent = {
  logo: {
    /** Visible text until the logo mark exists. */
    label: string;
    href: string;
    /** Accessible name for the logo link. */
    ariaLabel: string;
  };
  location: {
    label: string;
    /** IANA time zone used for the live clock, e.g. "Asia/Jakarta". */
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
  cta: NavLink;
  visual: {
    placeholder: string;
  };
  scrollCue: string;
};
