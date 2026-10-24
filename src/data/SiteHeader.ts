import type { SiteHeaderContent } from "../types/site.ts";

export const siteHeaderContent = {
  logo: { href: "/", ariaLabel: "Herald Panji, home" },
  location: { label: "Jakarta, ID", timeZone: "Asia/Jakarta", separator: "//" },
  navLabel: "Main",
  nav: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
  ],
} as const satisfies SiteHeaderContent;
