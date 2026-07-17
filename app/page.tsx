export default function Home() {
  return (
    <main className="game-shell">
      <iframe
        className="game-frame"
        src="/game/index.html"
        title="西洋音樂家知識格鬥：Maestro Combat"
        allow="autoplay; fullscreen"
      />
      <noscript>
        <a href="/game/index.html">開啟 Maestro Combat</a>
      </noscript>
    </main>
  );
}
