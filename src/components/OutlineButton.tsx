import type { ButtonHTMLAttributes, ReactNode } from 'react';
import '../styles/OutlineButton.css';

/** Where the icon turns to on hover/focus: `up` = 12 o'clock, `up-right` = 1 o'clock. */
export type OutlineButtonTurn = 'none' | 'up' | 'up-right';

type OutlineButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  icon?: ReactNode;
  iconTurn?: OutlineButtonTurn;
};

export default function OutlineButton({
  children,
  icon,
  iconTurn = 'none',
  className,
  type = 'button',
  ...rest
}: OutlineButtonProps) {
  const classes = ['outline-button', iconTurn === 'none' ? '' : `outline-button--turn-${iconTurn}`, className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      <span className="outline-button__label">{children}</span>
      {icon ? (
        <span className="outline-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
