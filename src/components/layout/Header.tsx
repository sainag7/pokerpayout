export function Header() {
  return (
    <header className="text-center py-5 px-4">
      <h1 className="font-heading text-3xl text-gold flex items-center justify-center gap-3">
        <span className="text-text-secondary/40 text-xl" aria-hidden="true">
          {'\u2660'}
        </span>
        Poker Payout
        <span className="text-loss/40 text-xl" aria-hidden="true">
          {'\u2665'}
        </span>
      </h1>
    </header>
  );
}
