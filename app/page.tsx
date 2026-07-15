export default function Home() {
  return (
    <main className="game-shell">
      <iframe
        className="game-frame"
        src="/game/index.html"
        title="西洋藝術大亂鬥：Canvas Combat"
        allow="autoplay; fullscreen"
      />
      <noscript>
        <a href="/game/index.html">開啟 Canvas Combat</a>
      </noscript>
    </main>
  );
}

