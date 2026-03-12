/**
 * SectionGrid — 12-column layout with label sidebar (cols 1-3) and content (cols 4-12).
 * Optional right border on sidebar. Sections separated by 1px borders.
 */
export default function SectionGrid({
  label,
  children,
  className = '',
  showSidebarBorder = true,
}) {
  return (
    <section className={`grid grid-cols-12 gap-x-6 border-t border-border ${className}`}>
      <div className={`col-span-3 py-8 ${showSidebarBorder ? 'border-r border-border pr-6' : ''}`}>
        {label}
      </div>
      <div className="col-span-9 py-8">
        {children}
      </div>
    </section>
  );
}
