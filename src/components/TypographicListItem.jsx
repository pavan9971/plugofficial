/**
 * Typographic List Item — Large interactive list items with sidebar index.
 * 1px border-top, mono index (#7A7A7A), large header (text-5xl, bold).
 * Hover: header color → #1351AA.
 */
export default function TypographicListItem({ index, title, children, className = '', ...props }) {
  const idx = String(index).padStart(3, '0');
  return (
    <div
      className={`group flex flex-row items-start border-t border-border py-6 transition-colors duration-300 ease-linear ${className}`}
      {...props}
    >
      <span className="font-mono text-xs text-muted tracking-wider shrink-0 mr-6">{idx}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-4xl md:text-5xl font-bold text-text group-hover:text-accent transition-colors duration-300 ease-linear">
          {title}
        </h3>
        {children && <div className="mt-2 text-text-secondary text-lg">{children}</div>}
      </div>
    </div>
  );
}
