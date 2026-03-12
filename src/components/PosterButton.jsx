/**
 * Poster Button — High-contrast, zero-radius rectangular button.
 * Primary: #1351AA bg, cream text. Secondary: #141414 bg, cream text.
 * Hover: transition to #141414 over 0.3s.
 */
export default function PosterButton({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  as: Component = 'button',
  ...props
}) {
  const base = 'px-8 py-4 text-sm font-bold uppercase tracking-wider transition-[background-color] duration-300 ease-linear rounded-none';
  const variants = {
    primary: 'bg-accent text-cream hover:bg-text',
    secondary: 'bg-text text-cream hover:bg-text/90',
  };
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
