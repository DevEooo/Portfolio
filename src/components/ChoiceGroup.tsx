import { useId } from 'react';
import type { ChoiceOption } from '../types/site.ts';
import '../styles/ChoiceGroup.css';

type ChoiceGroupProps = {
  name: string;
  index: string;
  label: string;
  options: readonly ChoiceOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
};

/** Single-choice pills. Native radios underneath, so arrow keys and forms work as expected. */
export default function ChoiceGroup({ name, index, label, options, value, onChange, error = '' }: ChoiceGroupProps) {
  const errorId = useId();
  const invalid = error !== '';

  return (
    <fieldset
      className="choice-group"
      data-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId : undefined}
    >
      <legend className="choice-group__legend">
        <span className="choice-group__index" aria-hidden="true">
          {index}
        </span>
        {label}
      </legend>

      <div className="choice-group__options">
        {options.map((option) => (
          <label key={option.value} className="choice-group__option">
            <input
              className="choice-group__input"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="choice-group__pill">{option.label}</span>
          </label>
        ))}
      </div>

      {invalid ? (
        <p id={errorId} className="choice-group__error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
