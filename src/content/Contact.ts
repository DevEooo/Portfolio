import type { ContactPageContent } from '../types/site.ts';

export const contactPageContent = {
  documentTitle: 'Contact — Herald Panji',
  eyebrow: 'Contact',
  title: { lead: 'Get in touch', rest: 'with', accent: 'me.' },
  clock: { label: 'Current time in Jakarta', timeZone: 'Asia/Jakarta' },
  details: {
    label: 'Contact details',
    email: {
      label: 'Email',
      address: 'heralddpanji@gmail.com',
      copyLabel: 'Copy address',
      copiedLabel: 'Copied',
      failedLabel: 'Couldn’t copy',
      copiedAnnouncement: 'Email address copied',
    },
    location: { label: 'Based in', value: 'Jakarta, Indonesia' },
  },
  form: {
    label: 'Project enquiry',
    questions: [
      {
        name: 'need',
        index: '01',
        label: 'What do you need?',
        error: 'Pick what you need.',
        options: [
          { value: 'design', label: 'Design' },
          { value: 'development', label: 'Development' },
          { value: 'design-development', label: 'Design & Development' },
        ],
      },
      {
        name: 'for',
        index: '02',
        label: 'What for?',
        error: 'Pick what it’s for.',
        options: [
          { value: 'ai-agents', label: 'AI Agents' },
          { value: 'saas', label: 'SaaS or Product Application' },
          { value: 'website', label: 'Website' },
          { value: 'others', label: 'Others' },
        ],
      },
      {
        name: 'when',
        index: '03',
        label: 'When?',
        error: 'Pick a timeline.',
        options: [
          { value: 'asap', label: 'As soon as possible' },
          { value: '1-3-months', label: 'In 1–3 months' },
          { value: 'exploring', label: 'Just exploring' },
        ],
      },
    ],
    fields: {
      name: { index: '04', label: 'Name', placeholder: 'Your name', error: 'Add your name.' },
      company: { label: 'Company (optional)', placeholder: 'Company name or site' },
      email: {
        index: '05',
        label: 'Email',
        placeholder: 'you@company.com',
        error: 'Add a valid email, like you@company.com.',
      },
      message: {
        index: '06',
        label: 'Anything else should I know?',
        placeholder: 'A few lines is sufficient: the product, for who, goal and what do you need from me.',
      },
    },
    submitLabel: 'Send message',
    alternative: { lead: 'Or email to', address: 'heralddpanji@gmail.com' },
    sentStatus: 'TODO (Herald): connect a form endpoint. Nothing was sent yet.',
  },
} as const satisfies ContactPageContent;
