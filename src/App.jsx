import { useState, useCallback } from 'react';
import CardScanner from './components/CardScanner.jsx';
import CardResult from './components/CardResult.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [tcgCards, setTcgCards] = useState([]);
  const [cardImage, setCardImage] = useState(null);
  const [step, setStep] = useState('');

  const analyze = useCallback(async (base64, mediaType) => {
    setIsLoading(true);
    setError(null);
    setCardData(null);
    setPokemonData(null);
    setTcgCards([]);
    setCardImage(`data:${mediaType};base64,${base64}`);

    try {
      // Step 1: Identify the card with Claude Vision
      setStep('Identifying card with AI...');
      const cardRes = await fetch('/api/analyze-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64, mediaType }),
      });
      const cardJson = await cardRes.json();
      if (!cardJson.success) throw new Error(cardJson.error || 'Could not analyze card');
      const card = cardJson.card;
      setCardData(card);

      // Step 2 & 3: Fetch Pokemon data and TCG prices in parallel
      setStep('Fetching price and Pokemon data...');
      const [pokemonRes, priceRes] = await Promise.allSettled([
        fetch(`/api/pokemon/${encodeURIComponent(card.pokemonName)}`).then(r => r.json()),
        fetch(`/api/card-prices?name=${encodeURIComponent(card.cardName || card.pokemonName)}&setName=${encodeURIComponent(card.setName || '')}`).then(r => r.json()),
      ]);

      if (pokemonRes.status === 'fulfilled' && pokemonRes.value.success) {
        setPokemonData(pokemonRes.value.pokemon);
      }
      if (priceRes.status === 'fulfilled' && priceRes.value.success) {
        setTcgCards(priceRes.value.cards || []);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setStep('');
    }
  }, []);

  function reset() {
    setCardData(null);
    setPokemonData(null);
    setTcgCards([]);
    setCardImage(null);
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-area">
            <div className="pokeball-sm">
              <div className="pb-top" /><div className="pb-mid" /><div className="pb-bot" /><div className="pb-ctr" />
            </div>
            <div>
              <div className="app-title">The Trainer's Deck</div>
              <div className="app-sub">Pokémon Card Scanner & Identifier</div>
            </div>
          </div>
          {cardData && (
            <button className="btn btn-outline-light" onClick={reset}>
              ← Scan New Card
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {!cardData ? (
          <div className="home-screen">
            <CardScanner onAnalyze={analyze} isLoading={isLoading} />

            {isLoading && (
              <div className="loading-panel">
                <div className="pokeball-loader">
                  <div className="pb-top" /><div className="pb-mid" /><div className="pb-bot" /><div className="pb-ctr" />
                </div>
                <p className="loading-step">{step}</p>
              </div>
            )}

            {error && (
              <div className="error-panel">
                <span className="error-icon">⚠️</span>
                <div>
                  <strong>Something went wrong</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="feature-grid">
              {[
                { icon: '🔍', title: 'AI Card Recognition', desc: 'Powered by Claude to identify any Pokémon card from a photo' },
                { icon: '💰', title: 'Live Market Prices', desc: 'Real-time pricing from TCGPlayer — see what your card is worth' },
                { icon: '📖', title: 'Pokédex Data', desc: 'Full stats, abilities, type matchups, and Pokédex entries' },
                { icon: '🎮', title: 'Game History', desc: 'Every game the Pokémon has appeared in across all generations' },
                { icon: '⚔️', title: 'Type Matchups', desc: 'Strengths and weaknesses so you know how to battle' },
                { icon: '🛒', title: 'Buy & Sell Links', desc: 'Direct links to TCGPlayer, eBay, and more' },
              ].map(f => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CardResult
            card={cardData}
            pokemon={pokemonData}
            tcgCards={tcgCards}
            cardImage={cardImage}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>The Trainer's Deck · Prices from TCGPlayer · Data from PokéAPI · Powered by Claude AI</p>
      </footer>
    </div>
  );
}
