import {
  FiArrowUpRight,
  FiBookOpen,
  FiChevronRight,
  FiClock,
  FiCommand,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-5 pb-10 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between py-6">
        <a href="/" className="flex items-center gap-3" aria-label="ShelfSphere home">
          <span className="brand-mark"><FiBookOpen size={18} /></span>
          <span className="brand-name">ShelfSphere</span>
        </a>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <a className="nav-link hidden sm:inline" href="/login">Sign in</a>
          <a className="button button-dark" href="/register">Join the library <FiArrowUpRight /></a>
        </div>
      </nav>

      <section className="hero-shell mx-auto max-w-7xl">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Your library, in orbit</p>
          <h1>Find your next <em>favorite</em> chapter.</h1>
          <p className="hero-text">A calmer way to discover, borrow, and keep track of the stories that stay with you.</p>
          <div className="search-box">
            <FiSearch size={20} aria-hidden="true" />
            <span>Search books, authors, or ISBNs</span>
            <span className="shortcut"><FiCommand size={12} /> K</span>
          </div>
          <div className="hero-actions">
            <a href="/dashboard/books" className="button button-accent">Explore the collection <FiArrowUpRight /></a>
            <a href="/register" className="text-link">Create an account <FiChevronRight /></a>
          </div>
        </div>
        <div className="hero-art" aria-label="A stack of books in the ShelfSphere collection">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="book-stack">
            <div className="book book-top"><span>THE<br />LONG<br />WAY</span></div>
            <div className="book book-middle"><span>FIELD<br />NOTES</span></div>
            <div className="book book-bottom"><span>ATLAS OF<br />SMALL THINGS</span></div>
          </div>
          <div className="art-caption"><span className="live-dot" /> 18,426 books in orbit</div>
        </div>
      </section>

      <section className="metrics mx-auto max-w-7xl" aria-label="Library statistics">
        <div className="metric"><FiBookOpen /><strong>18,426</strong><span>books to explore</span></div>
        <div className="metric"><FiUsers /><strong>2,840</strong><span>curious readers</span></div>
        <div className="metric"><FiClock /><strong>642</strong><span>new this week</span></div>
        <div className="metric metric-note"><span>Curated for the<br /><strong>curiously minded.</strong></span><FiArrowUpRight /></div>
      </section>

      <section className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-black/10 pt-6 text-sm">
        <p className="muted">A shared space for better reading habits.</p>
        <a className="text-link" href="/dashboard">Open your dashboard <FiChevronRight /></a>
      </section>
    </main>
  );
}
