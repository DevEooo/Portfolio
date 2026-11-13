import '../styles/TextField.css';

const MESSAGE_ROWS = 4;

type TextFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  index?: string;
  error?: string;
  type?: 'text' | 'email';
  autoComplete?: string;
  multiline?: boolean;
};

/** Underlined field. On focus an azure line draws in left → right; on blur it exits to the right. */
export default function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  index,
  error = '',
  type = 'text',
  autoComplete,
  multiline = false,
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const invalid = error !== '';
  const shared = {
    id,
    className: 'text-field__input',
    placeholder,
    value,
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? errorId : undefined,
  } as const;

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {index ? (
          <span className="text-field__index" aria-hidden="true">
            {index}
          </span>
        ) : null}
        {label}
      </label>

      <div className="text-field__control">
        {multiline ? (
          <textarea {...shared} rows={MESSAGE_ROWS} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input
            {...shared}
            type={type}
            autoComplete={autoComplete}
            inputMode={type === 'email' ? 'email' : undefined}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
        <span className="text-field__line" aria-hidden="true" />
      </div>

      {invalid ? (
        <p id={errorId} className="text-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
