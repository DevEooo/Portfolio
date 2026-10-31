import type { SiteFooterContent } from "../types/site.ts";

export const siteFooterContent = {
  headline: { lead: "Got any ideas?", accent: "Let’s talk." },
  body: "Software, tools, websites, or something that’s still taking shape. If it can be built, we can build it together.",
  cta: { label: "Start a conversation", href: "/contact" },
  email: {
    address: "heralddpanji@gmail.com",
    copyLabel: "Copy to clipboard",
    copiedLabel: "Copied",
    failedLabel: "Couldn’t copy",
  },
  linksLabel: "Footer",
  groups: [
    {
      label: "Elsewhere",
      links: [
        { label: "GitHub", href: "#TODO-github-profile-url", external: true },
        { label: "LinkedIn", href: "#TODO-linkedin-profile-url", external: true },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Legal Notice", href: "/legal-notice" },
      ],
    },
  ],
  newTabLabel: "(opens in a new tab)",
  copyright: "© 2026 Herald Panji",
  backToTop: { label: "Back to top", targetId: "main" },
} as const satisfies SiteFooterContent;
