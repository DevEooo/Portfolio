import { useEffect, useState } from 'react';
import OutlineButton from '../../components/OutlineButton.tsx';
import type { ContactPageContent } from '../../types/site.ts';
import '../../styles/contact/ContactDetails.css';

const COPY_RESET_MS = 2000;

type CopyState = 'idle' | 'copied' | 'failed';

type ContactDetailsProps = {
  content: ContactPageContent['details'];
};

/** Email (with copy) and location. Sticks beside the form on wide screens. */
export default function ContactDetails({ content }: ContactDetailsProps) {
  const { email, location } = content;
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = window.setTimeout(() => setCopyState('idle'), COPY_RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email.address);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const buttonLabel =
    copyState === 'copied' ? email.copiedLabel : copyState === 'failed' ? email.failedLabel : email.copyLabel;
  const announcement =
    copyState === 'copied' ? email.copiedAnnouncement : copyState === 'failed' ? email.failedLabel : '';

  return (
    <section className="contact-details" aria-label={content.label}>
      <dl className="contact-details__list">
        <div className="contact-details__item">
          <dt className="contact-details__term">{email.label}</dt>
          <dd className="contact-details__desc">
            <a className="contact-details__value contact-details__link" href={`mailto:${email.address}`}>
              {email.address}
            </a>
            <OutlineButton className="contact-details__copy" onClick={() => void copyEmail()}>
              {buttonLabel}
            </OutlineButton>
            <span className="contact-details__status" role="status">
              {announcement}
            </span>
          </dd>
        </div>

        <div className="contact-details__item">
          <dt className="contact-details__term">{location.label}</dt>
          <dd className="contact-details__desc contact-details__value">{location.value}</dd>
        </div>
      </dl>
    </section>
  );
}
