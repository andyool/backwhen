// Re-mounts on every navigation: a quick fade so pages arrive, not wait.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
