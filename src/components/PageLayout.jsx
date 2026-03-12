/**
 * PageLayout — Wrapper for app pages with cream background and consistent structure.
 */
export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-cream text-text max-w-4xl mx-auto px-6 py-8 ${className}`}>
      {children}
    </div>
  );
}
