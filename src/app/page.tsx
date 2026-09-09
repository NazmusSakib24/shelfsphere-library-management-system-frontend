import Link from 'next/link';
import { ArrowRight, BookOpen, Library, Search, Sparkles, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1ea]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-[var(--line)] py-5">
          <Link href="/" className="flex items-center gap-3" aria-label="ShelfSphere home">
            <span className="brand-mark"><BookOpen size={18} /></span>
            <span className="brand-name">ShelfSphere</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#discover" className="nav-link">Discover</a>
            <a href="#about" className="nav-link">About the library</a>
            <Link href="/login" className="nav-link">Log in</Link>
            <Link href="/register" className="button button-dark px-5">Join ShelfSphere <ArrowRight size={15} /></Link>
          </nav>
          <Link href="/login" className="button button-dark px-4 text-sm md:hidden">Log in</Link>
        </header>

        <section className="hero-shell">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Your library, in orbit</div>
            <h1>Find your next <em>favorite</em> story.</h1>
            <p className="hero-text">A calmer way to discover books, borrow with confidence, and keep your reading life beautifully organized.</p>
            <div className="search-box"><Search size={17} /><span>Search the collection</span><span className="shortcut">⌘ K</span></div>
            <div className="hero-actions">
              <Link href="/register" className="button button-accent">Create your account <ArrowRight size={16} /></Link>
              <Link href="/login" className="text-link">Already a member? Sign in <ArrowRight size={15} /></Link>
            </div>
          </div>

          <div className="hero-art" aria-label="A stack of books in orbit" role="img">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="book-stack" aria-hidden="true">
              <div className="book book-bottom">THE ART OF<br />SLOW READING</div>
              <div className="book book-middle">A FIELD GUIDE<br />TO WONDER</div>
              <div className="book book-top">NEW<br />WORLDS</div>
            </div>
            <div className="art-caption"><span className="live-dot" /> A collection that keeps growing</div>
          </div>
        </section>

        <section id="discover" className="metrics" aria-label="ShelfSphere highlights">
          <div className="metric"><Library size={18} /><strong>1,200+</strong><span>stories to explore</span></div>
          <div className="metric"><Users size={18} /><strong>800+</strong><span>curious members</span></div>
          <div className="metric"><Sparkles size={18} /><strong>24/7</strong><span>your reading list</span></div>
          <div id="about" className="metric metric-note"><span>Make room for<br /><strong>one more book.</strong></span><BookOpen size={20} /></div>
        </section>

        <footer className="flex flex-col gap-3 py-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ShelfSphere Library</span>
          <span>Read widely. Return happily.</span>
        </footer>
      </div>
    </main>
  );
}
