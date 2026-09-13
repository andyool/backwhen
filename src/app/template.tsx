// Re-mounts on every navigation so the enter animation plays per page.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="page-wipe" aria-hidden />
      {children}
    </div>
  );
}
