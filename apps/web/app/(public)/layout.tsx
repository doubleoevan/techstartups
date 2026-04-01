// Public layout — wraps all public-facing pages (landing, pricing, blog, startup profiles).
// Header and Footer are added in TASK-008.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
