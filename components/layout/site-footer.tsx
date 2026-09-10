import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col gap-4 text-sm text-muted-2">
        <p>
          RailChart Explorer is an independent interface and is not affiliated with or operated
          by IRCTC or Indian Railways.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <Link href="/" className="hover:text-muted transition-colors">
            Chart Search
          </Link>
          <Link href="/about" className="hover:text-muted transition-colors">
            How It Works
          </Link>
          <span>© {new Date().getFullYear()} RailChart Explorer</span>
        </div>
      </div>
    </footer>
  );
}
