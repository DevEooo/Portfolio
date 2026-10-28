import { useId } from "react";
import type { GreetingContent } from "../../types/site.ts";
import ScrollRevealText from "../common/ScrollRevealText.tsx";
import "../../styles/Greeting.css";

interface GreetingProps {
  content: GreetingContent;
}

export default function Greeting({ content }: GreetingProps) {
  const titleId = useId();

  return (
    <section className="greeting" aria-labelledby={titleId}>
      <h2 id={titleId} className="greeting__label">
        {content.label}
      </h2>
      <ScrollRevealText text={content.body} className="greeting__body" />
    </section>
  );
}
