import type { SiteHeaderContent } from "../types/site.ts";

export const siteHeaderContent = {
  // TODO: replace the text label with the logo mark once it exists.
  logo: { label: "Logo", href: "/", ariaLabel: "Herald Panji, home" },
  location: { label: "Jakarta, ID", timeZone: "Asia/Jakarta", separator: "//" },
  navLabel: "Main",
  nav: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],
} as const satisfies SiteHeaderContent;
