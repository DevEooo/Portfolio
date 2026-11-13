import { useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import ChoiceGroup from '../../components/ChoiceGroup.tsx';
import TextField from '../../components/TextField.tsx';
import OutlineButton from '../../components/OutlineButton.tsx';
import type { ContactPageContent } from '../../types/site.ts';
import '../../styles/contact/ContactForm.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = 'name' | 'company' | 'email' | 'message';
type FieldValues = Record<FieldKey, string>;
type Errors = Readonly<Record<string, string>>;

const EMPTY_FIELDS: FieldValues = { name: '', company: '', email: '', message: '' };

type ContactFormProps = {
  content: ContactPageContent['form'];
};

export default function ContactForm({ content }: ContactFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  const [values, setValues] = useState<FieldValues>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const { questions, fields } = content;

  const fieldId = (key: string): string => `${uid}-${key}`;

  const clearError = (key: string): void => {
    if (!errors[key]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const choose = (name: string, value: string): void => {
    setAnswers((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const edit = (key: FieldKey, value: string): void => {
    setValues((current) => ({ ...current, [key]: value }));
    clearError(key);
  };

  const focusFirstInvalid = (found: Errors): void => {
    const [first] = Object.keys(found);
    if (!first) return;
    const radios = Array.from(formRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []);
    const target = radios.find((radio) => radio.name === first) ?? document.getElementById(fieldId(first));
    target?.focus();
  };

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const found: Record<string, string> = {};
    questions.forEach((question) => {
      if (!answers[question.name]) found[question.name] = question.error;
    });
    if (!values.name.trim()) found.name = fields.name.error;
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = fields.email.error;

    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('');
      focusFirstInvalid(found);
      return;
    }
    // TODO (Herald): send `answers` + `values` to a form endpoint, then show a real confirmation.
    setStatus(content.sentStatus);
  };

  return (
    <form ref={formRef} className="contact-form" aria-label={content.label} noValidate onSubmit={submit}>
      {questions.map((question) => (
        <ChoiceGroup
          key={question.name}
          name={question.name}
          index={question.index}
          label={question.label}
          options={question.options}
          value={answers[question.name] ?? null}
          onChange={(value) => choose(question.name, value)}
          error={errors[question.name]}
        />
      ))}

      <div className="contact-form__row">
        <TextField
          id={fieldId('name')}
          index={fields.name.index}
          label={fields.name.label}
          placeholder={fields.name.placeholder}
          autoComplete="name"
          value={values.name}
          onChange={(value) => edit('name', value)}
          error={errors.name}
        />
        <TextField
          id={fieldId('company')}
          label={fields.company.label}
          placeholder={fields.company.placeholder}
          autoComplete="organization"
          value={values.company}
          onChange={(value) => edit('company', value)}
        />
      </div>

      <TextField
        id={fieldId('email')}
        index={fields.email.index}
        label={fields.email.label}
        placeholder={fields.email.placeholder}
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(value) => edit('email', value)}
        error={errors.email}
      />

      <TextField
        id={fieldId('message')}
        index={fields.message.index}
        label={fields.message.label}
        placeholder={fields.message.placeholder}
        multiline
        value={values.message}
        onChange={(value) => edit('message', value)}
      />

      <div className="contact-form__submit">
        <OutlineButton type="submit" icon={<ArrowRight focusable="false" />} iconTurn="up-right">
          {content.submitLabel}
        </OutlineButton>
        <p className="contact-form__alt">
          {content.alternative.lead}{' '}
          <a className="contact-form__alt-link" href={`mailto:${content.alternative.address}`}>
            {content.alternative.address}
          </a>
        </p>
        <p className="contact-form__status" role="status">
          {status}
        </p>
      </div>
    </form>
  );
}
