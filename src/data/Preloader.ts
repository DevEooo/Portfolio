import type { PreloaderContent } from "../components/specific/Preloader.tsx";

export const preloaderContent = {
  identity: ["AI Engineer", "Jakarta, Indonesia"],
  status: { loading: "Loading", ready: "Ready" },
  srLabel: "Loading Herald Panji’s portfolio",
} as const satisfies PreloaderContent;
