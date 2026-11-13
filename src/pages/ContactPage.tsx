import Cursor from '../components/Cursor.tsx';
import Header from '../sections/Header.tsx';
import Footer from '../sections/Footer.tsx';
import ContactIntro from '../sections/contact/ContactIntro.tsx';
import ContactDetails from '../sections/contact/ContactDetails.tsx';
import ContactForm from '../sections/contact/ContactForm.tsx';
import { headerContent } from '../content/Header.ts';
import { footerContent } from '../content/Footer.ts';
import { contactPageContent } from '../content/Contact.ts';
import '../styles/contact/ContactPage.css';

export default function ContactPage() {
  const content = contactPageContent;

  return (
    <>
      <title>{content.documentTitle}</title>
      <Cursor />
      <Header content={headerContent} inert={false} revealed />
      <main id="main" tabIndex={-1} className="contact-page">
        <ContactIntro content={content} />
        <div className="contact-page__body">
          <ContactDetails content={content.details} />
          <ContactForm content={content.form} />
        </div>
      </main>
      <Footer content={footerContent} inert={false} />
    </>
  );
}
