/**
 * Grid Sidebar Label — Sticky section labels for the 12-col grid.
 * 12px, bold, #7A7A7A, uppercase, tracking-0.2em. Sticky top-32.
 */
export default function GridSidebarLabel({ children, className = '' }) {
  return (
    <div className={`sticky top-32 text-xs font-bold text-muted uppercase tracking-[0.2em] ${className}`}>
      {children}
    </div>
  );
}
