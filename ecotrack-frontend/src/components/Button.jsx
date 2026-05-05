/**
 * Button — standardized button for all EcoTrack pages.
 *
 * Props:
 *   variant  — 'primary' | 'secondary' | 'danger' | 'ghost'  (default: 'primary')
 *   size     — 'sm' | 'md' | 'lg' | 'xl'                     (default: 'md')
 *   loading  — boolean: shows spinner + disables
 *   full     — boolean: full width
 *   icon     — string emoji or element prepended to label
 *   as       — 'button' | 'a'                                 (default: 'button')
 *   All standard <button> and <a> props are forwarded.
 */

const Button = ({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  full     = false,
  icon,
  children,
  disabled,
  as: Tag  = 'button',
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    full    ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="spinner" />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </Tag>
  );
};

export default Button;
